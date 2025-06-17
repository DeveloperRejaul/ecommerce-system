import { UUIDV4 } from 'sequelize';
import { AfterBulkDestroy, AfterBulkUpdate, BeforeBulkDestroy, BeforeBulkUpdate, BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import {  deleteToCloudinary } from 'src/utils/file';
import { Category } from '../category/model';
import { Shop } from '../shop/model';
import { Brand } from '../brand/model';

@Table
export class Product extends Model<Product> {
  @IsUUID(4)
  @PrimaryKey
  @Column({defaultValue: UUIDV4()})
  id: string;

  @Column({allowNull:false, type:DataType.TEXT})
  name: string;

  @Column({allowNull:false,type:DataType.TEXT})
  title: string;

  @Column({allowNull:false, type:DataType.TEXT})
  description: string;

  @Column({ 
    type: DataType.ARRAY(DataType.STRING), 
    allowNull: false,
  })
  images: string[];

  @Column({allowNull:false, type: DataType.INTEGER})
  buyPrice: number;

  @Column({allowNull:false, type: DataType.INTEGER})
  sellPrice: number;

  @Column({allowNull:false, defaultValue: 0, type: DataType.INTEGER})
  discount: number;

  @Column({allowNull:false})
  quantity: number;

  // relationship with category
  @ForeignKey(() => Category)
  @Column({allowNull:false})
  categoryId: string;

  @BelongsTo(()=> Category)
  category: Category;

  // relationship with shop
  @ForeignKey(() => Shop)
  @Column({allowNull:false})
  shopId: string;

  @BelongsTo(()=> Shop)
  shop: Shop;


  // relationship with brand
  @ForeignKey(() => Brand)
  @Column({allowNull:false})
  brandId: string;

  @BelongsTo(()=> Brand)
  brand: Brand;

  
  @Column({allowNull:false, type:DataType.TEXT})
  specification:string;

  @Column
  keys:string;

  @Column({defaultValue: 0, type: DataType.DOUBLE})
  rating: number;


 /**
  * A hook function that runs before a bulk destroy operation on the Product model.
  * It retrieves the product to be deleted and stores it in a static property for later use.
  *
  * @param options - The options passed to the bulk destroy operation.
  * @returns {Promise<void>} - A promise that resolves when the operation is complete.
  */
 @BeforeBulkDestroy
 static async beforeDestroyHook(options): Promise<void> {
   const product = await Product.findOne({ where: options.where });
   Product['deleteItem'] = product?.dataValues;
 }

 /**
  * A hook function that runs after a bulk destroy operation on the Product model.
  * It retrieves the product to be deleted, deletes its associated images from the file system,
  * and clears the static property used for tracking the deleted item.
  *
  * @returns {Promise<void>} - A promise that resolves when the operation is complete.
  * @static
  * @memberof Product
  */
 @AfterBulkDestroy
 static async afterDestroyHook(): Promise<void> {
   const product = Product['deleteItem'] as Product;
   if (product?.images?.length) {
     product.images.forEach(async (ele) => {
       await deleteToCloudinary(ele);
     });
   }
   // Clear the static property after the operation is complete
   delete Product['deleteItem'];
 }


 /**
  * A hook function that runs before a bulk update operation on the Product model.
  * It retrieves the product to be updated and stores it in a static property for later use.
  *
  * @param options - The options passed to the bulk update operation.
  * @param options.where - The where clause specifying which rows to update.
  * @returns {Promise<void>} - A promise that resolves when the operation is complete.
  * @static
  * @memberof Product
  */
 @BeforeBulkUpdate
 static async beforeUpdateHook(options): Promise<void> {
   const product = await Product.findOne({ where: options.where });
   Product['prevUpdate'] = product?.dataValues;
 }

 /**
  * A hook function that runs after a bulk update operation on the Product model.
  * It checks if the 'images' field is updated and performs necessary cleanup operations.
  *
  * @param options - The options passed to the bulk update operation.
  * @returns {Promise<void>} - A promise that resolves when the operation is complete.
  */
 @AfterBulkUpdate
 static async afterUpdateHook(options): Promise<void> {
   if (options.fields.includes('images')) {
     const prevProduct = Product['prevUpdate'] as Product;
     const currentProduct = await Product.findOne({ where: options.where });

     if (prevProduct?.images?.length) {
       prevProduct.images.forEach(async (ele) => {
         if (!currentProduct?.images.includes(ele)) await deleteToCloudinary(ele);
       });
     }
   }
 }
}