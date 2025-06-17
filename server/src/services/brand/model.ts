import { AfterBulkDestroy, AfterBulkUpdate, BeforeBulkDestroy, BeforeBulkUpdate, BelongsTo, Column, ForeignKey, Index, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Shop } from '../shop/model';
import { deleteToCloudinary } from 'src/utils/file';
import { UUIDV4 } from 'sequelize';

@Table
export class Brand extends Model<Brand> {
  @IsUUID(4)
  @PrimaryKey
  @Column({defaultValue:UUIDV4()})
  id: string;
  
  @Column({ allowNull: true })
  @Index({ name: 'brand_name_shopId_unique', unique: true })
  name: string;

  @Column({ allowNull: true })
  avatar: string;

  // relation with Shop
  @ForeignKey(() => Shop)
  @Index({ name: 'brand_name_shopId_unique', unique: true })
  @Column({ allowNull: true })
  shopId: string;

  @BelongsTo(()=> Shop)
  shop: Shop;


  // handle delete operation with hook
  @BeforeBulkDestroy
  static async beforeDestroyHook(options): Promise<void> {
   const user = await Brand.findOne({where: options.where});
   Brand['deleteItem'] = user?.dataValues;
  }

  @AfterBulkDestroy
  static async afterDestroyHook(): Promise<void> {
    const userData = Brand['deleteItem'];

    if(!userData) return;
    if(userData?.avatar) await deleteToCloudinary(userData.avatar);
  }


  // handle update operation with hook
  @BeforeBulkUpdate
  static async beforeUpdateHook(options): Promise<void> {
   const user =  await Brand.findOne({where:options.where});
   Brand['prevUpdate'] = user.dataValues;
  }


   @AfterBulkUpdate
   static async afterUpdateHook(options): Promise<void> {
    if(options.fields.includes('avatar')){
      await deleteToCloudinary(Brand['prevUpdate']['avatar']); 
    } 
  }
}