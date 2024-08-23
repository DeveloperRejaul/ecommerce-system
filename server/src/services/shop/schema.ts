import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ timestamps: true })
export class Shop extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;
  
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  userId: Types.ObjectId;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
