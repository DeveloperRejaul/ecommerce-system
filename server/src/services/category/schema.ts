import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';


export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  shopId: string;
}

// Create a compound index to enforce unique 'name' within the same 'shopId'

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 1, shopId: 1 }, { unique: true });