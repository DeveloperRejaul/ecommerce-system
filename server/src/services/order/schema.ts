import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: String, enum: ['PADDING', 'SHIPPING', 'CANCELED', 'COMPLETED'] })
  status: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String, enum: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'], required: true })
  size: string;

  @Prop({ type: Types.ObjectId, ref: 'coupon' })
  coupon: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'user' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'product' })
  productId: Types.ObjectId;

}

export const OrderSchema = SchemaFactory.createForClass(Order);
