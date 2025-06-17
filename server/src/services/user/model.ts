import { Table, Column, Model, ForeignKey, BelongsTo, BeforeBulkDestroy, AfterBulkDestroy, BeforeBulkUpdate, AfterBulkUpdate, IsUUID, PrimaryKey } from 'sequelize-typescript';
import { Shop } from '../shop/model';
import {  deleteToCloudinary } from 'src/utils/file';
import { UUIDV4 } from 'sequelize';


export type UserRoleType  = 'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER' | 'SELLER'

export enum UserRole {
 OWNER = 'OWNER', SUPER_ADMIN='SUPER_ADMIN',ADMIN='ADMIN',MODERATOR='MODERATOR',USER='USER', SELLER = 'SELLER',
}

@Table
export class User extends Model<User> {
  @IsUUID(4)
  @PrimaryKey
  @Column({defaultValue: UUIDV4()})
  id: string;
  
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, unique: true})
  email: string;

  @Column({allowNull: true})
  phone: string;

  @Column({ allowNull: false })
  password: string;
  
  @Column({ allowNull: false })
  address: string;
  
  @Column({ allowNull: true })
  avatar: string;

  @Column({ allowNull: false , values:[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.MODERATOR, UserRole.USER, UserRole.SELLER]})
  role: string;

  // relation with Shop
  @ForeignKey(() => Shop)
  @Column({ allowNull: true })
  shopId?: string;

  @BelongsTo(()=> Shop)
  shop?: Shop;


  // handle delete operation with hook
  @BeforeBulkDestroy
  static async beforeDestroyHook(options): Promise<void> {
   const user = await User.findOne({where: options.where});
   User['deleteUser'] = user?.dataValues;
  }

  @AfterBulkDestroy
  static async afterDestroyHook(): Promise<void> {
    const userData = User['deleteUser'];
    if(!userData) return;
    if(userData?.avatar) await deleteToCloudinary(userData.avatar);
  }


  // handle update operation with hook
  @BeforeBulkUpdate
  static async beforeUpdateHook(options): Promise<void> {
   const user =  await User.findOne({where:options.where});
   User['prevUpdate'] = user.dataValues;
  }


   @AfterBulkUpdate
   static async afterUpdateHook(options): Promise<void> {
    if(options.fields.includes('avatar')){
      await deleteToCloudinary(User['prevUpdate']['avatar']); 
    } 
  }
}





