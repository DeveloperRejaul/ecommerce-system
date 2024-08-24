import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private model: Model<User>,
    ) { }

    async findById(id: string) {
        return await this.model.findById({ _id: id });
    }
}
