import express from 'express'
import passport from 'passport'
const router = express.Router()
import UserModel from '../../models/user.model'
import { generateToken, sendToken } from '../../config/token.utils'

/**
* @route POST /auth/facebook
* @group authentication - Operations on user authentication
* @param {string} access_token.query.required - username or email
* @returns {string} User creation Object
* @returns {string} 401 - Bad Request or User alreay exists
*/
router.route('/auth/facebook')
	.post(passport.authenticate('facebook-token', { session: false }), async (req, res, next) => {
		if(!req.user) {
			return await res.status(401).send({ message: 'User not authenticated'})
		}
		req.auth = {
			id: req.user.id
		}
		next()
	}, generateToken, sendToken)

export default router
