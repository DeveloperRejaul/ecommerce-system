import Joi from 'joi';
import util from 'util';
import jwt from 'jsonwebtoken';
import prisma from '../../../prisma';
import { userRole } from '../../constants/constants';

const { coupon: Coupon } = prisma;
const { ADMIN, MODERATOR, SUPER_ADMIN } = userRole;
const verifyTokenAsync = util.promisify(jwt.verify);

/**
 * @description this function for creating coupon
 * @returns
 */
const createCouponSchema = Joi.object().keys({
  type: Joi.string().valid('PRESENT', 'FIX').required(),
  time: Joi.string().required(),
  name: Joi.string().min(5).max(20).required(),
  amount: Joi.alternatives().conditional('type', { is: 'PRESENT', then: Joi.number().required().min(0).max(100) }).conditional('type', { is: 'FIX', then: Joi.number().required() }).required(),
});
export const createCoupon = () => async (req, res) => {
  try {
    // check valid user
    if (![ADMIN, MODERATOR, SUPER_ADMIN].includes(req.role)) return res.status(401).send('Invalid credentials');

    // check valid data in body
    const { error } = createCouponSchema.validate(req.body);
    if (error) return res.status(401).send(`Invalid request: ${error.message}`);

    req.body.token = jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: `${req.body.time}ms` });
    const coupon = await Coupon.create({ data: { ...req.body, userId: req.id } });
    res.status(200).send(coupon);
  } catch (err) {
    res.status(400).send('Something wrong');
    console.log(err);
  }
};

/**
 * @description this function for deleting coupon
 * @returns
 */
export const deleteCoupon = () => async (req, res) => {
  try {
    // check valid user
    if (![ADMIN, MODERATOR, SUPER_ADMIN].includes(req.role)) return res.status(401).send('Invalid credentials');
    const coupon = await Coupon.delete({ where: { id: req.params.id } });
    res.status(200).send(coupon);
  } catch (err) {
    res.status(400).send('Something wrong');
    console.log(err);
  }
};

/**
 * @description this function for deleting coupon
 * @returns
 */
const updateCouponSchema = Joi.object().keys({
  type: Joi.string().valid('PRESENT', 'FIX'),
  time: Joi.string(),
  name: Joi.string().min(5).max(20),
  amount: Joi.alternatives().conditional('type', { is: 'PRESENT', then: Joi.number().required().min(0).max(100) }).conditional('type', { is: 'FIX', then: Joi.number().required() }),
});
export const updateCoupon = () => async (req, res) => {
  try {
    // check valid user
    if (![ADMIN, MODERATOR, SUPER_ADMIN].includes(req.role)) return res.status(401).send('Invalid credentials');

    // check valid data in body
    const { error } = updateCouponSchema.validate(req.body);
    if (error) return res.status(401).send(`Invalid request: ${error.message}`);

    const coupon = await Coupon.update({ where: { id: req.params.id }, data: req.body });
    res.status(200).send(coupon);
  } catch (err) {
    res.status(400).send('Something wrong');
    console.log(err);
  }
};

/**
 * @description this function for deleting coupon
 * @returns
 */
export const getCoupon = () => async (req, res) => {
  try {
    // check valid user
    if (![ADMIN, MODERATOR, SUPER_ADMIN].includes(req.role)) return res.status(401).send('Invalid credentials');

    const coupons = await Coupon.findMany();

    if (coupons.length <= 0) return res.status(202).send('coupon not found');

    const updatedCoupon = await Promise.all(coupons.map(async ({ token, name, id }) => {
      try {
        await verifyTokenAsync(token, process.env.JWT_SECRET);
        return { name, id, expire: false };
      } catch (err) {
        return { name, id, expire: true };
      }
    }));
    res.status(200).send(updatedCoupon);
  } catch (err) {
    res.status(400).send('Something wrong');
    console.log(err);
  }
};
