import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';


type SizeType = {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
  '3xl'?: number;
};

export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Number, required: true })
  buyPrice: number;

  @Prop({ type: Number, required: true })
  sellPrice: number;

  @Prop({ type: Map, of: Number, enum: ['s', 'm', 'l', 'xl', '2xl', '3xl'], required: true, default: {} })
  size: SizeType;

  @Prop({ type: [String], required: true, default: [] })
  color: string[];

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number })
  rating: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Coupon' })
  couponId: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' }) // this field for buyers
  userId: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Shop' }) // this field for buyers
  shopId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand' }) // this field for buyers
  brandId: Types.ObjectId;

}

export const ProductSchema = SchemaFactory.createForClass(Product);