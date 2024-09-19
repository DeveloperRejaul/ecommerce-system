/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) { }

  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type === 'body') {

      if (value?.size) value.size = JSON.parse(value.size);
      const { error } = this.schema.validate(value, { abortEarly: false });

      if (error) {
        throw new BadRequestException('Validation failed', error.message);
      }
    }
    return value;
  }
}
