import jwt from 'jsonwebtoken'
import constants from './constants'

export const authMiddleWare = async (req, res, next) => {
	const token = req.headers['x-auth-token']
	try {
		const { user: { id } } = await jwt.verify(token, constants.SECRET_KEY)
		res.id = id
	}	catch(e) {
		console.log(e)
	}
	return next()
}
