import Joi from 'joi';
import prisma from '../../../prisma';
import { userRole } from '../../constants/constants';
import { deleteUploadFile } from '../../utils/file';

const { product: Product } = prisma;

const { ADMIN, MODERATOR, SUPER_ADMIN } = userRole;
const sportedUser = [ADMIN, MODERATOR, SUPER_ADMIN];
/**
 * @description this function for creating product
 * @returns
 */

const createProductSchema = Joi.object().keys({
  name: Joi.string().min(5).max(30).required(),
  title: Joi.string().min(20).max(100),
  images: Joi.array().items(Joi.object().keys({ name: Joi.string(), uri: Joi.string() })).min(1).max(5).required(),
  buyPrice: Joi.number().min(0).required(),
  sellPrice: Joi.number().min(0).greater(Joi.ref('buyPrice')).required(),
  discount: Joi.number().less(Joi.ref('sellPrice')),
  size: Joi.array().items(Joi.string().required().valid('sm', 'md', 'lg', 'xl', '2xl')).min(1).max(5).required(),
  description: Joi.string().min(50).max(1000).required(),
  quantity: Joi.number().min(0).required(),
  catagoryId: Joi.string().id().required(),
  couponId: Joi.array().items(Joi.string().id()),
});

export const createProduct = () => async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data || '{}');
    if (req.files) req.body.images = req.files.map((img) => ({ name: img.fieldname, uri: img.filename }));

    // clean without  fields objects property
    const fields = Object.keys(createProductSchema.describe().keys);
    Object.keys(req.body).forEach((k) => { if (!fields.includes(k)) delete req.body[k]; });

    // check all filed data type
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      if (req.files) req.files.forEach((img) => deleteUploadFile(img.filename));
      return res.status(202).send(`Invalid request: ${error.details[0].message}`);
    }

    if (sportedUser.includes(req.role)) {
      const product = await Product.create({ data: { ...req.body, userId: req.id } });
      return res.status(200).send(product);
    }
    if (req.files) req.files.forEach((img) => deleteUploadFile(img.filename));
    res.status(401).send('Unauthenticated request');
  } catch (err) {
    if (req.files) req.files.forEach((img) => deleteUploadFile(img.filename));
    res.status(400).send('something wrong');
    console.log(err);
  }
};

/**
 * @description this function for get product
 * @returns
*/

export const getProduct = () => async (req, res) => {
  try {
    const product = await Product.findMany();
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send('something wrong');
    console.log(err);
  }
};

/**
 * @description this function for get single product
 * @returns
 */
export const getSingleProduct = () => async (req, res) => {
  try {
    const product = await Product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(400).send('Product not found');
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send('something wrong');
    console.log(err);
  }
};

/**
 * @description this function for update product
 * @returns
 */

const updateProductSchema = Joi.object().keys({
  name: Joi.string().min(5).max(30),
  title: Joi.string().min(20).max(100),
  images: Joi.array().items(Joi.object().keys({ name: Joi.string(), uri: Joi.string() })).max(5),
  buyPrice: Joi.number().min(0),
  sellPrice: Joi.number().min(0).greater(Joi.ref('buyPrice')),
  discount: Joi.number().less(Joi.ref('sellPrice')),
  size: Joi.array().items(Joi.string().required().valid('sm', 'md', 'lg', 'xl', '2xl')).min(1).max(5),
  description: Joi.string().min(50).max(1000),
  quantity: Joi.number().min(0),
  catagoryId: Joi.string().id(),
  couponId: Joi.array().items(Joi.string().id()),
});
export const updateProduct = () => async (req, res) => {
  try {
    req.body = JSON.parse(req.body.data || '{}');
    if (req.files) req.body.images = req.files.map((img) => ({ name: img.fieldname, uri: img.filename }));

    // clean without  fields objects property
    const fields = Object.keys(updateProductSchema.describe().keys);
    Object.keys(req.body).forEach((k) => { if (!fields.includes(k)) delete req.body[k]; });

    // check all filed data type
    const { error } = updateProductSchema.validate(req.body);

    if (error) {
      if (req.files) req.files.forEach((img) => deleteUploadFile(img.filename));
      return res.status(202).send(`Invalid request: ${error.details[0].message}`);
    }

    if (sportedUser.includes(req.role)) {
      const product = await Product.update({ data: req.body, where: { id: req.params.id } });
      return res.status(200).send(product);
    }
    if (req.files) req.files.forEach((img) => deleteUploadFile(img.filename));
    res.status(401).send('Unauthenticated request');
  } catch (err) {
    res.status(400).send('something wrong');
    console.log(err);
  }
};

/**
 * @description this function for delete product
 * @returns
 */
export const deleteProduct = () => async (req, res) => {
  try {
    const product = await Product.delete({ where: { id: req.params.id } });
    if (!product) return res.status(400).send('Product not found');
    res.status(200).send(product);
  } catch (err) {
    res.status(400).send('something wrong');
    console.log(err);
  }
};
