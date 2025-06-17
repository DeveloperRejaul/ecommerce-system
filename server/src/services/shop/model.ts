/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterBulkDestroy, AfterBulkUpdate, BeforeBulkDestroy, BeforeBulkUpdate, BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from '../user/model';
import { deleteToCloudinary } from 'src/utils/file';
import { UUIDV4 } from 'sequelize';

@Table
export class Shop extends Model<Shop> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: UUIDV4() })
  id: string;

  @Column({ allowNull: false, unique: true })
  name: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  address: string;

  @Column({ allowNull: false })
  avatar: string;

  @Column({ allowNull: false, type: DataType.ARRAY(DataType.STRING) })
  banner: string[];

  @Column({ allowNull: true, type: DataType.DATE })
  expireDate: Date;

  @Column({ allowNull: true, type: DataType.FLOAT, defaultValue: 1000 })
  price: number;

  // relation with user
  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User, {onDelete:'CASCADE'})
  user: User;

  // handle delete operation with hook
  @BeforeBulkDestroy
  static async beforeDestroyHook(options: any): Promise<void> {
    const shop = await Shop.findOne({ where: options.where });
    if(shop?.dataValues) {
      Shop['deleteShop'] = shop.dataValues;
    }
  }

  @AfterBulkDestroy
  static async afterDestroyHook(): Promise<void> {
    const shopData = Shop['deleteShop'];
    if (shopData) {
      if (shopData.avatar) await deleteToCloudinary(shopData.avatar);
      const banner = shopData?.banner as string[];
      if (banner?.length) banner.forEach(async (id) => await deleteToCloudinary(id));
    }
  }

  // handle update operation with hook
  @BeforeBulkUpdate
  static async beforeUpdateHook(options: any): Promise<void> {
    const shop = await Shop.findOne({ where: options.where });
    if(shop?.dataValues) {
      Shop['prevUpdate'] = shop.dataValues;
    }
  }

  @AfterBulkUpdate
  static async afterUpdateHook(options: any): Promise<void> {
    const fields = options.fields as string[];
    const prevuesShop = Shop['prevUpdate'] as Shop;
    const currentShop = await Shop.findOne({ where: options.where });

    if (fields.includes('avatar')) await deleteToCloudinary(prevuesShop.avatar);

    if (fields.includes('banner') && prevuesShop.banner.length) {
      prevuesShop.banner.forEach(async (ele) => {
        if (!currentShop.banner.includes(ele)) await deleteToCloudinary(ele);
      });
    }
  }
}
