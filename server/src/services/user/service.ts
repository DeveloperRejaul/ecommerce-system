import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from './schema';
import { IUserTypes, LoginUserType } from './dto';
import * as bcrypt from 'bcrypt';
import { roleAvailable } from 'src/utils/role';
import { saveFile } from 'src/utils/file';
import { JwtService } from '@nestjs/jwt';
import { Shop } from '../shop/schema';
import { MailerService } from '@nestjs-modules/mailer';
import type { AuthBody, IFileType, IMailBody } from 'src/types/types';
import { Request, Response } from 'express';

const { ADMIN, USER, MODERATOR, SUPER_ADMIN, OWNER } = UserRole;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    @InjectModel(Shop.name) private shopModel: Model<Shop>,
    private readonly mailService: MailerService,
    private jwtService: JwtService
  ) { }

  /**
   * @description this function using for create user
   * @returns create user object
   */
  async create(user: IUserTypes, file: IFileType) {
    if (roleAvailable([USER], user.role)) {
      user.password = await bcrypt.hash(user.password, 10);
      if (file) {
        user.avatar = await saveFile(file);
      }
      return await this.model.create(user);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for check valid user
   * @returns
   */

  async checkValidUser(req: Request) {
    const COOKIE_KEY = process.env.COOKIE_KEY;
    const cookies = req.cookies;

    const ourCookie = cookies[COOKIE_KEY];

    if (!ourCookie)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);

    // decode token
    const decoded = this.jwtService.decode(ourCookie);
    if (!decoded)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);

    const id = decoded.id;
    const user = await this.model.findById(id);
    if (!user)
      throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
    return user;
  }

  /**
   * @description this function using for login user
   * @returns user object
   */
  async login(body: LoginUserType, res: Response) {
    const user = await this.model.findOne({ email: body.email });
    if (!user) {
      throw new HttpException(
        'Password or Email invalid',
        HttpStatus.BAD_REQUEST
      );
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      throw new HttpException(
        'Password or Email invalid',
        HttpStatus.BAD_REQUEST
      );
    }

    const token = this.jwtService.sign({
      email: user.email,
      id: user._id,
      role: user.role,
      shopId: user.shopId,
    });
    res.cookie(process.env.COOKIE_KEY, token);
    return { ...user.toJSON(), token };
  }

  /**
   * @description this function using for create vip user
   * @returns create user object
   */
  async Vip(user: IUserTypes, file: IFileType, auth: AuthBody) {
    console.log(user);
    console.log(file);
    console.log(auth);

    user.password = await bcrypt.hash(user.password, 10);

    // handle owner role
    if (auth.role === OWNER) {
      if (file) user.avatar = await saveFile(file);
      return await this.model.create(user);
    }

    // handle super admin activity
    if (auth.role === SUPER_ADMIN) {
      if (roleAvailable([ADMIN, MODERATOR, USER], user.role) && user.shopId === user.shopId) {
        if (file) user.avatar = await saveFile(file);
        return await this.model.create(user);
      }
    }

    // handle admin activity
    if (auth.role === ADMIN) {
      if (roleAvailable([MODERATOR, USER], user.role) && user.shopId === user.shopId) {
        if (file) user.avatar = await saveFile(file);
        return await this.model.create(user);
      }
    }

    // Handle moderator role
    if (auth.role === MODERATOR) {
      if (roleAvailable([USER], user.role) && user.shopId === user.shopId) {
        if (file) user.avatar = await saveFile(file);
        return await this.model.create(user);
      }
    }

    // handle user role
    if (auth.role === USER) throw new HttpException('Bad request ', HttpStatus.BAD_REQUEST);

    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for get all users
   * @returns  user array
   */

  async getAll(role: string, shopId: string) {
    if (role === UserRole.OWNER) {
      return await this.model.find().select('-password -__v');
    }

    if (roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR], role)) {
      return await this.model.find({ shopId });
    }
  }

  /**
   * @description this function using for update user using user id
   * @returns  user object
   */
  async update(id: string, body: IUserTypes, file: IFileType, auth: AuthBody) {
    if (body.password) body.password = await bcrypt.hash(body.password, 10);

    // handle owner
    if (auth.role === OWNER) {
      if (file) body.avatar = await saveFile(file);
      return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
    }

    if (body.role === OWNER)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    const user = await this.model.findById({ _id: id });
    if (auth.shopId !== user.shopId.toString())
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // handle super admin
    if (auth.role === SUPER_ADMIN) {
      if (user.role === SUPER_ADMIN && user._id === auth.id) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }

      if (roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR, USER], user.role)) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }
    }

    // handle admin
    if (auth.role === ADMIN) {
      if (user.role === ADMIN && user._id === auth.id) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }

      if (roleAvailable([MODERATOR, USER], user.role)) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }
    }

    // handle Moderator
    if (auth.role === MODERATOR) {
      if (user.role === MODERATOR && user._id === auth.id) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }

      if (user.role === USER) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }
    }

    // handle Moderator
    if (auth.role === USER && auth.id === user._id) {
      if (roleAvailable([USER], user.role)) {
        if (file) body.avatar = await saveFile(file);
        return this.model.findByIdAndUpdate(id, body, { new: true }).exec();
      }
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for delete user using user id
   * @returns  user object
   */
  async delete(id: string, auth: AuthBody) {
    if (auth.role === OWNER) return this.model.findByIdAndDelete(id);

    const user = await this.model.findById({ _id: id });

    // checking same shop member
    if (auth.shopId !== user.shopId.toString())
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // owner not allowed to delete , only can delete owner
    if (user.role === OWNER)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // handle super admin
    if (auth.role === SUPER_ADMIN) {
      if (user.role === SUPER_ADMIN && user._id === auth.id)
        return this.model.findByIdAndDelete(id);
      if (roleAvailable([ADMIN, MODERATOR, USER], user.role))
        return this.model.findByIdAndDelete(id);
    }

    // handle admin
    if (auth.role === ADMIN) {
      if (user.role === ADMIN && user._id === auth.id)
        return this.model.findByIdAndDelete(id);
      if (roleAvailable([MODERATOR, USER], user.role))
        return this.model.findByIdAndDelete(id);
    }

    // handle Moderator
    if (auth.role === MODERATOR) {
      if (user.role === MODERATOR && user._id === auth.id)
        return this.model.findByIdAndDelete(id);
      if (roleAvailable([USER], user.role))
        return this.model.findByIdAndDelete(id);
    }

    // handle Moderator
    if (auth.role === USER && user._id === auth.id)
      return this.model.findByIdAndDelete(id);

    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
  async findById(id: string) {
    return await this.model.findById({ _id: id });
  }

  /**
   * @description this function using for send mail to user verification 
   * format email
   * const result = await this.sendMail({
      from: 'devrejaul.official@gmail.com',
      to: 'rejaulkarim.bd.mi4@gmail.com',
      subject: 'Password Validation',
      text:'Hello World 123456'
    });
   * @returns  
  */
  async sendMail({ text, from, to, subject, html }: IMailBody) {
    const result = await this.mailService.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return result;
  }
}
