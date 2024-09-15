import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  avatar: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  shopId: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.index({ name: 1, shopId: 1 }, { unique: true });