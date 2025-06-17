import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import type { AuthBody, IMailBody } from 'src/types';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from './model';
import { roleAvailable } from 'src/utils/role';
import * as bcrypt from 'bcrypt';
import { getResetPasswordHtml } from 'src/html/reset-password-mail';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import { LoginUserDto } from './dto';
import { Shop } from '../shop/model';

const {ADMIN ,MODERATOR, OWNER, SUPER_ADMIN, USER} = UserRole;
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly model: typeof User,
    @InjectModel(Shop) private readonly shopModel: typeof Shop,
    private readonly mailService: MailerService,
    private jwtService: JwtService
  ) { }

  /**
   * @description this function using for create user
   * only can create user role available USER
   * @returns create user object
   */
  async create(user) {
    // checking user role
    if (!roleAvailable([USER], user.role)) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    
    user.password = await bcrypt.hash(user.password, 10);
    return await this.model.create(user);
  }


  /**
   * @description this function using for check valid user
   * @returns
   */

  async checkValidUser(req: Request) {
    const COOKIE_KEY = process.env.COOKIE_KEY;
    const cookies = req.cookies;

    const ourCookie = cookies[COOKIE_KEY];

    if (!ourCookie) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);

    // decode token
    const decoded = this.jwtService.decode(ourCookie);
    if (!decoded) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);


    const id = decoded.id;
    /**
     * @description this function using for find user using user id
     * @returns  user object
     */
    const user = await this.model.findOne({where: {id}});


    if (!user) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
    return user;
  }


  /**
   * @description this function using for login user
   * @returns user object
   * TODO: need to check user type
   */
  async dashboardLogin(body:LoginUserDto, res: Response) {
    const user = await this.model.findOne({  where :{email: body.email}, include:[{model:Shop}]});
    
    if (!user) throw new HttpException('Email or password is  invalid', HttpStatus.BAD_REQUEST);

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) throw new HttpException('Email or password is  invalid', HttpStatus.BAD_REQUEST);
    
    // check user role
    if(!roleAvailable(['ADMIN', 'MODERATOR','SUPER_ADMIN','OWNER'], user.role))  throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);

    // check shop expire date
    if(user.role !=='OWNER' && user.shopId && user.shop.expireDate < new Date()){
      throw new HttpException(
        'Your shop subscription has expired. Please make a payment to continue. For assistance, contact 01857735471.', 
        HttpStatus.FORBIDDEN
      );
    }

    // create jwt token
    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      role: user.role,
      shopId: user.shopId,
    }, {expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) * 24 * 365  /*1 year */});
    res.cookie(process.env.COOKIE_KEY, token);
    return { ...user.toJSON(),token };
  }


  async clientLogin(body:LoginUserDto, res: Response) {
    const user = await this.model.findOne({  where :{email: body.email}});
    
    if (!user) throw new HttpException('Email is  invalid', HttpStatus.BAD_REQUEST);

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) throw new HttpException('Password is invalid', HttpStatus.BAD_REQUEST);


    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      role: user.role,
      shopId: user.shopId,
    }, {expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) * 24 * 365  /*1 year */});
    res.cookie(process.env.COOKIE_KEY, token);
    return { ...user.toJSON(), token };
  }

  async logout (res: Response) {
    res.clearCookie(process.env.COOKIE_KEY, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now())
    });
    return 'Logout successful';
  }


  /**
   * @description this function using for create vip user
   * @returns create user object
   */
  async Vip(user, auth: AuthBody) {
    user.password = await bcrypt.hash(user.password, 10);
    // return await this.model.create(user);
    // handle owner role
    if (auth.role === OWNER) return await this.model.create(user);
    
    // handle super admin activity
    if (auth.role === SUPER_ADMIN && roleAvailable([ADMIN, MODERATOR, USER], user.role) && user.shopId === user.shopId) return await this.model.create(user);

    // handle admin activity
    if (auth.role === ADMIN && roleAvailable([MODERATOR, USER], user.role) && user.shopId === user.shopId) return await this.model.create(user);

    // Handle moderator role
    if (auth.role === MODERATOR && roleAvailable([USER], user.role) && user.shopId === user.shopId) return await this.model.create(user);
      
    // handle user role
    if (auth.role === USER) throw new HttpException('Bad request ', HttpStatus.BAD_REQUEST);
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for get all users
   * If role is owner we return all of users
   * If shop user we return only shop related user
   * If role is USER we throw error message 
   * @returns  Array of users
   */
  @PaginatedQueryDecorator()
  async getAll(auth: AuthBody,  query , option? ) {
    if (auth.role === UserRole.OWNER) return await this.model.findAll({...option, where:{role:UserRole.SUPER_ADMIN}});

    if(auth.shopId && roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR], auth.role)) {
      return await this.model.findAll({...option, where:{shopId: auth.shopId} });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for update user using user id
   * @returns  user object
   */
  async update(id: string, body, auth: AuthBody) {  
   
    if (body?.password) throw new HttpException('Password not allow in here', HttpStatus.BAD_REQUEST);

    const userExists = await this.model.findOne({where:{id}});
    if(!userExists) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);


    // handle owner
    if (auth.role === OWNER) return this.model.update(body, { where: {id} });
    
    // owner can update any ware but any body can't update owner
    if (body.role === OWNER) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // checking this user shop
    const user = await this.model.findOne({where:{ id} });
    if (auth.shopId !== user.shopId.toString()) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // handle super admin
    if (auth.role === SUPER_ADMIN) {
      // self update 
      if (user.role === SUPER_ADMIN && user.id === auth.id) return this.model.update(body, { where:{id}});
      // update self shop member 
      if (roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR, USER], user.role)) return this.model.update(body, { where:{id} });
    }

    // handle admin
    if (auth.role === ADMIN) {
      // self update 
      if (user.role === ADMIN && user.id === auth.id) return this.model.update( body, { where:{id} });
      
      // update self shop member 
      if (roleAvailable([MODERATOR, USER], user.role)) return this.model.update(body, {where:{id} });
    }

    // handle Moderator
    if (auth.role === MODERATOR) {
     
      // self update 
      if (user.role === MODERATOR && user.id === auth.id)  return this.model.update(body, {where:{id}});

      // update self shop member 
      if (user.role === USER) return this.model.update(body, {where:{id}});
    }

    // handle Moderator
    if (auth.role === USER && auth.id === user.id && roleAvailable([USER], user.role)) return this.model.update(body, {where:{id}});
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for delete user using user id
   * @returns  user object
   */
  async delete(id: string, auth: AuthBody) {
    const user = await this.model.findOne({where: {id} });
    
    if (auth.role === OWNER) return this.model.destroy({where:{id}});

    // checking same shop member
    if (auth.shopId !== user.shopId.toString()) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // owner not allowed to delete , only can delete owner
    if (user.role === OWNER) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // handle super admin
    if (auth.role === SUPER_ADMIN) {
      // self delete
      if (user.role === SUPER_ADMIN && user.id === auth.id) return this.model.destroy({where:{id}});

      // delete under shop employee
      if (roleAvailable([ADMIN, MODERATOR, USER], user.role)) return this.model.destroy({where:{id}});
    }

    // handle admin
    if (auth.role === ADMIN) {
      if (user.role === ADMIN && user.id === auth.id) return this.model.destroy({where:{id}});
      if (roleAvailable([MODERATOR, USER], user.role)) return this.model.destroy({where:{id}});
    }

    // handle Moderator
    if (auth.role === MODERATOR) {
      if (user.role === MODERATOR && user.id === auth.id) return this.model.destroy({where:{id}});
      if (roleAvailable([USER], user.role)) return this.model.destroy({where:{id}});
    }

    // handle Moderator
    if (auth.role === USER && user.id === auth.id) return this.model.destroy({where:{id}});

    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
  async findById(id: string) {
    return await this.model.findOne({where:{ id} });
  }



  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
  async checkMailExists (email:string) {
    // checking mail exists
    const user = await this.model.findOne({where:{ email: email}});
    if(!user) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // generate verification token
    const createdAt = new Date().toISOString();
    const str = '0123456789';
    const otp1= Math.abs((Math.random() * (str.length-1))).toFixed();
    const otp2= Math.abs((Math.random() * (str.length-1))).toFixed();
    const otp3= Math.abs((Math.random() * (str.length-1))).toFixed();
    const otp4= Math.abs((Math.random() * (str.length-1))).toFixed();
    const token = this.jwtService.sign({id: user.id, email: user.email,createdAt, otp:`${otp1}${otp2}${otp3}${otp4}`},{secret: process.env.JWT_SECRET,  expiresIn: 60000*5});

    await this.sendMail({
      from: 'devrejaul.official@gmail.com',
      to: email,
      subject: 'Password Validation',
      html: getResetPasswordHtml({name: user.name, otp: `${otp1}${otp2}${otp3}${otp4}`})
    });

    return {token};
  }


  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
 async checkOtp (body) {
  try {
    const {token, otp} = body;

    const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    const serverOtp = decoded.otp;
    if(serverOtp.toString() !== otp) throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    return {token};
  } catch {
    throw new HttpException('Validation date expire', HttpStatus.BAD_REQUEST);
  }
 }



  /**
   * @description this function using for find user using user id
   * @returns  user object
   */
 async resetPassword (body)  {
    try {
      const decoded = this.jwtService.verify(body.token, { secret: process.env.JWT_SECRET });
      if (body.password) body.password = await bcrypt.hash(body.password, 10);
      return this.model.update({password: body.password}, {where: {email: decoded.email}});
    } catch  {
      throw new HttpException('Validation date expire', HttpStatus.BAD_REQUEST);
    }
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
