import { UUIDV4 } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from '../products/model';
import { User } from '../user/model';
import { Shop } from '../shop/model';

@Table
export class Rating extends Model<Rating> {
  @Column({defaultValue:UUIDV4(), primaryKey:true})
  id: string;

  @Column({allowNull: false})
  rating: number;

  @Column({allowNull: false})
  text: string;

  // Product relationship
  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  // User relationship
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  // Shop relationship
  @ForeignKey(() => Shop)
  @Column({ allowNull: false })
  shopId: string;

  @BelongsTo(() => Shop)
  shop: Shop;
}
