import path from 'path'
import express from 'express'
import passport from 'passport'
import multer from 'multer'
const router = express.Router()
import { generateToken, sendToken } from '../../config/token.utils'
import {
	signup, login, googleLogin, fbLogin, getUser, updateUser, setUsername, follow, unfollow, uploadPhoto, getUsers
} from '../../controllers/users/users.controller'
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '/lettershack/server/uploads')
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1]
		const filename = file.fieldname
		cb(null, `${filename}-${Date.now()}.${ext}`)
	}
})
const upload = multer({ storage: storage })

router.route('/user/signup')
	.post(signup)

router.route('/users')
	.get(getUsers)

router.route('/user/login')
	.post(login)

router.route('/auth/google')
	.post(
		passport.authenticate('google-token', { session: false }),
		googleLogin,
		generateToken,
		sendToken
	)

router.route('/auth/facebook')
	.post(
		passport.authenticate('facebook-token', { session: false }),
		fbLogin,
		generateToken,
		sendToken
	)

router.route('/users/:username')
	.get(getUser)
	.put(authMiddleWare, updateUser)

router.route('/users/:username/uploadProfile')
	.put(authMiddleWare, upload.single('avatar'), uploadPhoto)

router.route('/users/username')
	.post(setUsername)

router.route('/users/:username/follow')
	.post(authMiddleWare, follow)
	.delete(authMiddleWare, unfollow)

export default router
