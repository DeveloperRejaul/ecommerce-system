const  jwt  = require('jsonwebtoken');
const {user:User} = require('../../prisma/index');

/**
 * This function is used for decoding auth token.
 * @param {String} token The token to decode.
 * @returns returns the decoded user found in database.
 */
module.exports.decodeAuthToken = async function (token) {
	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		if(!decoded) return null;
		if(decoded?.email) return await User.findUnique({where:{email:decoded?.email}});
		return null;
	}
	catch (e) {
		console.log(e);
		return null;
	}
};