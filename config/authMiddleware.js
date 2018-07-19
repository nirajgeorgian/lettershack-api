import jwt from 'jsonwebtoken'
import constants from './constants'

const authMiddleWare = app => {
	return app.use('/api', async (req, res, next) => {
		const token = req.headers['x-auth-token']
		try {
			const { user: { id } } = await jwt.verify(token, constants.SECRET_KEY)
			res.id = id
			return next()
		}	catch(e) {
			res.status(401).send({
				'message': 'Unauthorizd access'
			})
			return next()
		}
	})
}


export default authMiddleWare
