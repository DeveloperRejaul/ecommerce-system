import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, required: true, enum: ['FIX', 'PERCENT'] })
  type: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number, required: true })
  time: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: [Types.ObjectId], ref: 'user' })
  userId: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, required: true, ref: 'shop' })
  shopId: Types.ObjectId;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.index({ name: 1, shopId: 1 }, { unique: true });