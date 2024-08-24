import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: Number, required: true, MAX_VALUE: 5, MIN_VALUE: 1 })
  rating: number;

  @Prop({ type: String })
  text: string;

  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
