import jwt from 'jsonwebtoken'
import constants from './constants'

/*
const authMiddleWare = app => {
	return app.use('/api', async (req, res, next) => {
		const token = req.headers['x-auth-token']
		try {
			const { user: { id } } = await jwt.verify(token, constants.SECRET_KEY)
			if(id) {
				res.id = id
				return next()
			} else {
				res.send({
					status: false,
					'message': 'Please login and then access it.'
				})
			}
		}	catch(e) {
			res.send({
				'status': false,
				'message': 'Unauthorizd access',
				'error': e
			})
			return next()
		}
	})
}
*/

const authMiddleWare = async (req, res, next) => {
	const token = req.headers['x-auth-token']
	try {
		const { user: { id } } = await jwt.verify(token, constants.SECRET_KEY)
		if(id) {
			res.id = id
			return next()
		} else {
			res.send({
				status: false,
				'message': 'Please login and then access it.'
			})
		}
	}	catch(e) {
		res.send({
			'status': false,
			'message': 'Unauthorizd access',
			'error': e
		})
		return next()
	}
}

global.authMiddleWare = authMiddleWare

// export default authMiddleWare
