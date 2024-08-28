/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Joi from 'joi';

export const createProductSchema = Joi.object().keys({
  categoryId: Joi.string().id().required(),
  name: Joi.string().min(5).max(30).required(),
  images: Joi.array().items(Joi.object().keys({ name: Joi.string(), uri: Joi.string() })).min(1).max(5),
  title: Joi.string().min(20).max(100),
  description: Joi.string().min(50).max(1000).required(),
  buyPrice: Joi.number().min(0).required(),
  sellPrice: Joi.number().min(0).greater(Joi.ref('buyPrice')).required(),
  quantity: Joi.number().min(0).required(),
  size: Joi.object().keys({ sm: Joi.number(), md: Joi.number(), lg: Joi.number(), xl: Joi.number(), '2xl': Joi.number(), '3xl': Joi.number(), '4xl': Joi.number() }).required()
    .custom((value, helpers) => {
      const totalSize = (value.sm || 0) + (value.md || 0) + (value.lg || 0) + (value.xl || 0) + (value['2xl'] || 0) + (value['3xl'] || 0) + (value['4xl'] || 0);
      if (totalSize !== helpers.state.ancestors[0].quantity) {
        //@ts-ignore
        return helpers.message(`The total of sizes of number must equal the quantity ${helpers.state.ancestors[0].quantity}`);
      }
      return value;
    }, 'Total size validation'),
  color: Joi.string().required(),
  discount: Joi.number().less(Joi.ref('sellPrice')),
  couponId: Joi.string().id(),
  shopId: Joi.string().id().required()
});


export const updateProductSchema = Joi.object().keys({
  name: Joi.string().min(5).max(30),
  title: Joi.string().min(20).max(100),
  images: Joi.array().items(Joi.object().keys({ name: Joi.string(), uri: Joi.string() })).max(5),
  buyPrice: Joi.number().min(0),
  sellPrice: Joi.number().min(0).greater(Joi.ref('buyPrice')),
  discount: Joi.number().less(Joi.ref('sellPrice')),
  size: Joi.object().keys({ sm: Joi.number(), md: Joi.number(), lg: Joi.number(), xl: Joi.number(), '2xl': Joi.number(), '3xl': Joi.number(), '4xl': Joi.number() })
    .custom((value, helpers) => {
      const totalSize = (value.sm || 0) + (value.md || 0) + (value.lg || 0) + (value.xl || 0) + (value['2xl'] || 0) + (value['3xl'] || 0) + (value['4xl'] || 0);
      if (totalSize !== helpers.state.ancestors[0].quantity) {
        //@ts-ignore
        return helpers.message(`The total of sizes of number must equal the quantity ${helpers.state.ancestors[0].quantity}`);
      }
      return value;
    }, 'Total size validation'),
  description: Joi.string().min(50).max(1000),
  quantity: Joi.number().min(0),
  color: Joi.string(),
  categoryId: Joi.string().id(),
  couponId: Joi.string().id(),
  shopId: Joi.string().id(),
  userId: Joi.string().id(),
});