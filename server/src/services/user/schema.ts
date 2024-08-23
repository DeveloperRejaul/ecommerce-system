import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export enum UserRole {
  OWNER = 'OWNER',
  SUPPER_ADMIN = 'SUPPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  name?: string;

  @Prop()
  address?: string;

  @Prop()
  avatar?: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'shop' })
  shopId: Types.ObjectId;
}


export const UserSchema = SchemaFactory.createForClass(User);
