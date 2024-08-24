import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [String] })
  image: string[];

  @Prop({ type: Number, required: true })
  buyPrice: number;

  @Prop({ type: Number, required: true })
  sellPrice: number;

  @Prop({ type: String, enum: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'], required: true })
  size: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'category' })
  categoryId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'coupon' })
  couponId: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'user' }) // this field for buyers
  userId: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);