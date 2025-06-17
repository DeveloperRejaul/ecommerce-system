import { 
  AfterBulkDestroy, AfterBulkUpdate,  BeforeBulkDestroy, BeforeBulkUpdate,
  BelongsTo, Column,  ForeignKey,  Index, IsUUID, Model, PrimaryKey, Table,
} from 'sequelize-typescript';
import { Shop } from '../shop/model';
import {  deleteToCloudinary } from 'src/utils/file';
import { UUIDV4 } from 'sequelize';
import { Product } from '../products/model';
import { Coupon } from '../coupon/model';

export enum CategoryType  {
  ROUNDED='ROUNDED',
  SQUARE='SQUARE',
  TOP_SELECTION='TOP_SELECTION',
  HIDE='HIDE'
}

@Table
export class Category extends Model<Category> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: UUIDV4() })
  id: string;

  /**
   * The unique name of the category scoped to the shop.
   * 
   * @type {string}
   * @remarks The combination of `name` and `shopId` must be unique.
   */
  @Index({ name: 'category_name_shopId_unique', unique: true })
  @Column({ allowNull: false })
  name: string;


  @Column({ allowNull: false })
  avatar: string;


  @Column({ allowNull: false, defaultValue: 'ROUNDED', values: ['ROUNDED', 'SQUARE', 'TOP_SELECTION', 'HIDE'] })
  type: string;


  @Column({ allowNull: false, defaultValue: 0 })
  discount: number;

  /**
   * The foreign key referencing the associated shop.
   * 
   * @type {string}
   */
  @ForeignKey(() => Shop)
  @Index({ name: 'category_name_shopId_unique', unique: true })
  @Column
  shopId: string;

  @BelongsTo(() => Shop)
  shop: Shop;


  @ForeignKey(() => Category)
  @Column({ allowNull: true })
  parentId: string;


  @ForeignKey(() => Coupon)
  @Column({ allowNull: true })
  coupon: string;

  /**
   * Lifecycle hook executed before a bulk delete operation.
   * 
   * @param options - The options used for the delete operation.
   * @remarks Saves the item to be deleted for cleanup operations after deletion.
   */
  @BeforeBulkDestroy
  static async beforeDestroyHook(options): Promise<void> {
    const user = await Category.findOne({ where: options.where });
    Category['deleteItem'] = user?.dataValues;
  }

  /**
   * Lifecycle hook executed after a bulk delete operation.
   * 
   * @remarks Deletes associated files and products after the category is removed.
   */
  @AfterBulkDestroy
  static async afterDestroyHook(): Promise<void> {
    const userData = Category['deleteItem'];

    // handle null or empty data
    if(!userData) return;

    if (userData?.avatar) await deleteToCloudinary(userData.avatar);
    await Product.destroy({ where: { categoryId: Category['deleteItem']['id'] } });
  }

  /**
   * Lifecycle hook executed before a bulk update operation.
   * 
   * @param options - The options used for the update operation.
   * @remarks Saves the previous state of the item being updated.
   */
  @BeforeBulkUpdate
  static async beforeUpdateHook(options): Promise<void> {
    const user = await Category.findOne({ where: options.where });
    Category['prevUpdate'] = user?.dataValues;
  }

  /**
   * Lifecycle hook executed after a bulk update operation.
   * 
   * @param options - The options used for the update operation.
   * @remarks Handles file deletions and recalculates discounts for related products.
   */
  @AfterBulkUpdate
  static async afterUpdateHook(options): Promise<void> {
    if (options.fields.includes('avatar')) {
      await deleteToCloudinary(Category['prevUpdate']['avatar']);
    }

    if (options.fields.includes('discount')) {
      const discountPercentage = options.attributes.discount;
      const categoryId = options.where.id;
      const products = await Product.findAll({ where: { categoryId } });

      products.forEach(async (product) => {
        const sellPrice = product.sellPrice;
        const discountValue = Math.floor(sellPrice * (discountPercentage / 100));
        await Product.update({ discount: discountValue }, { where: { id: product.id } });
      });
    }
  }
}
