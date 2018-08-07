import jwt from 'jsonwebtoken'
import constants from './constants'

const createToken = auth => {
	return jwt.sign({
		id: auth.id
	}, constants.SECRET_KEY,
	{
		expiresIn: '30d'
	})
}

export const generateToken = (req, res, next) => {
	req.token = createToken(req.auth)
	return next()
}

export const sendToken = (req, res) => {
	res.setHeader('x-auth-token', req.token)
	return res.send({
		user: req.user,
		status: true
	})
}
