import { UUIDV4 } from 'sequelize';
import { Column, Model, Table, ForeignKey, PrimaryKey, DataType, BelongsTo, Index} from 'sequelize-typescript';
import { Shop } from '../shop/model';

@Table
export class Coupon extends Model<Coupon> {
  @PrimaryKey
  @Column({ defaultValue: UUIDV4() })
  id: string;

  @Column({ allowNull: false })
  @Index({ name: 'coupon_name_shopId_unique', unique: true })
  name: string;

  @Column({ allowNull: false , values:['FIX', 'PERCENT'], defaultValue:'FIX'})
  type: string;

  @Column({ allowNull: false })
  value: number;

  @Column({ allowNull: false })
  quantity: number;

  @Column({ type: DataType.JSON, allowNull: false })
  time: {
    from: string;
    to: string;
  };


  @ForeignKey(() => Shop)
  @Index({ name: 'coupon_name_shopId_unique', unique: true })
  @Column({ allowNull: false })
  shopId: string;

  // Belongs-To Relationship
  @BelongsTo(() => Shop)
  shop: Shop;

  // Define usersId, categorysId, and productIds as arrays of strings
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  usersId: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true ,})
  categorysId: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  productsId: string[];
}
