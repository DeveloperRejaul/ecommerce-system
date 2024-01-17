import jwt from 'jsonwebtoken';
import prisma from '../../prisma';

const { user: User } = prisma;
/**
 * This function is used for decoding auth token.
 * @param {String} token The token to decode.
 * @returns returns the decoded user found in database.
 */
export const decodeAuthToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return null;
    if (decoded?.email) return await User.findUnique({ where: { email: decoded?.email } });
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
