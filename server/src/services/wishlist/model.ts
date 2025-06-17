import { Table, Column, Model, IsUUID, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { User } from '../user/model';
import { Product } from '../products/model';


@Table
export class Wishlist extends Model<Wishlist> {
  @IsUUID(4)
  @PrimaryKey
  @Column({defaultValue: UUIDV4()})
  id: string;

  // Product relationship
  @ForeignKey(() => Product)
  // @Index({ name: 'product_id_userId_unique', unique: true })
  @Column({ allowNull: false  })
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  // User relationship
  @ForeignKey(() => User)
  // @Index({ name: 'product_id_userId_unique', unique: true })
  @Column({ allowNull: false })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}



