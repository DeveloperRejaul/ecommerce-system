import { IsUUID } from 'class-validator';
import { UUIDV4 } from 'sequelize';
import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, DataType, BeforeCreate } from 'sequelize-typescript';
import { User } from '../user/model';
import { Shop } from '../shop/model';
import { Coupon } from '../coupon/model';

@Table
export class Order extends Model<Order> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: UUIDV4() })
  id: string;
  

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    unique: 'unique_shop_order', 
  })
  orderId: string; 

  @Column({type: DataType.JSON,allowNull: false})
  products: { 
    productId: string; 
    quantity: number
   }[];

  @Column({ allowNull: false })
  address: string;

  // User relationship
  @ForeignKey(() => User)
  @Column({ allowNull: false,  unique: 'unique_shop_order',  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  // Shop relationship
  @ForeignKey(() => Shop)
  @Column({ allowNull: false })
  shopId: string;

  @BelongsTo(() => Shop)
  shop: Shop;

  // Coupon relationship (optional)
  @ForeignKey(() => Coupon)
  @Column
  couponId: string;

  @BelongsTo(() => Coupon)
  coupon: Coupon;

  @Column
  status: string;

  @Column
  price: number;

  @BeforeCreate
  static async createOrderIdHandle(instance) {
    // Fetch the last order for the shop
    const lastOrder = await Order.findOne({
      where: { shopId: instance.shopId },
      order: [['orderId', 'DESC']],
    });
  
    // Calculate the next sequential order ID
    const nextOrderId = lastOrder ? Number(lastOrder.orderId) + 1 : 1;
  
    // Format the orderId with leading zeros (e.g., 0000000001)
    instance.orderId = nextOrderId.toString().padStart(10, '0');
  }
}