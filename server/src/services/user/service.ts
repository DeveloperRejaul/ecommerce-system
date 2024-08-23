import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from './schema';
import { IUserTypes, LoginUserType } from './dto';
import type { AuthBody, IFileType } from 'src/types/types';
import * as bcrypt from 'bcrypt';
import { roleAvailable } from 'src/utils/role';
import { saveFile } from 'src/utils/file';
import { JwtService } from '@nestjs/jwt';
import { Shop } from '../shop/schema';

const { ADMIN, USER, MODERATOR, SUPPER_ADMIN, OWNER } = UserRole;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private jwtService: JwtService
  ) {}

  /**
   * @description this function using for create user
   * @returns create user object
   */
  async create(user: IUserTypes, file: IFileType) {
    if (roleAvailable([USER], user.role)) {
      user.password = await bcrypt.hash(user.password, 10);
      if (file) {user.avatar = await saveFile(file);}
      return await this.model.create(user);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for login user
   * @returns user object
   */
  async login(body: LoginUserType) {
    const user = await this.model.findOne({ email: body.email });
    if (!user) {
      throw new HttpException('Password or Email invalid',HttpStatus.BAD_REQUEST);
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      throw new HttpException('Password or Email invalid', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({ email: user.email, id: user._id, role: user.role, shopId:user.shopId });
    return { ...user.toJSON(), token };
  }

  /**
   * @description this function using for create vip user
   * @returns create user object
   */
  async Vip(user: IUserTypes, file: IFileType, auth: AuthBody) {
    user.password = await bcrypt.hash(user.password, 10);

    if (user.role === OWNER && auth.role === OWNER) {
      if (file) {user.avatar = await saveFile(file);}
      return await this.model.create(user);
    }

    if (user.role === SUPPER_ADMIN && auth.role === OWNER) {
      if (file) { user.avatar = await saveFile(file); }
      const newUser =  await this.model.create(user);
      await this.shopModel.findByIdAndUpdate(user.shopId, {userId: newUser._id}, {new:true}).exec();
      return newUser;
    }

    if (user.role === ADMIN && roleAvailable([OWNER, SUPPER_ADMIN], auth.role)) {
      if (file) {user.avatar = await saveFile(file);}
      return await this.model.create(user);
    }


    if (user.role === MODERATOR && roleAvailable([OWNER, SUPPER_ADMIN, ADMIN], auth.role)) {
      if (file) {user.avatar = await saveFile(file);}
      return await this.model.create(user);
    }

    if (user.role === USER) {throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);}
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
  * @description this function using for get all users
  * @returns  user array 
  */

  async getAll(role: string, shopId:string) { 
    if (role === UserRole.OWNER) { 
      return await this.model.find();
    }

    if (roleAvailable([SUPPER_ADMIN, ADMIN, MODERATOR], role)) { 
      return await this.model.find({shopId});
    }
  }


  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
  async findById(id: string) {
    return await this.model.findById({_id: id});
  }


  /**
   * @description this function using for update user using user id
   * @returns  user object
  */
  async update(id: string, body: IUserTypes, file:IFileType) {
    if (body.password) { 
      body.password = await bcrypt.hash(body.password, 10);
    }
    if (file) { 
       body.avatar = await saveFile(file); 
    }

    // TODO:we need authentication with email pass code
    return this.model.findByIdAndUpdate(id, body, {new:true}).exec();
  }


  /**
   * @description this function using for delete user using user id
   * @returns  user object
  */
  async delete(id: string) {
    // TODO:we need authentication with email pass code
    return this.model.findByIdAndDelete(id);
  }

}
