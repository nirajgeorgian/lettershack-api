import express from 'express'
const router = express.Router()
import { error } from '../config/response'
import UserModel from '../models/user.model'

router.route('/profile/:username')
	.post(authMiddleWare, async (req, res) => {
		const data = req.body
		const user = await UserModel.findOne({ username: req.params.username })
		if(!user) {
			// no user exists set up username create it for first time
			UserModel.findByIdAndUpdate(res.id)
				.then(currUser => {
					if(currUser._id === res.id) {
						// it's the same user
						currUser.username = data.username
						currUser.save()
						.then(updatedUser => {
							return res.send({
								status: true,
								user: updatedUser
							})
						})
					} else {
						error(res, `login with account ${req.params.username}`)
					}
				})
				.catch(err => {
					error(res, err)
				})
		} else {
			error(res, 'User already exists. Try to update')
		}
	})
	.get(async (req, res) => {
		const user = await UserModel.findOne({ username: req.params.username })
		if(user) {
			return res.send({
				status: true,
				user: user
			})
		} else {
			error(res, 'go ahead with this username')
		}
	})
	.put(async (req, res) => {
		const data = req.body
		UserModel.findByIdAndUpdate(res.id)
			.then(currUser => {
				currUser.name = data.name
				currUser.bio = data.bio
				currUser.image = data.image
				currUser.isAgent = data.isAgent
				currUser.save()
					.then(updatedUser => {
						return res.send({
							status: true,
							user: updatedUser
						})
					})
			})
			.catch(err => {
				return res.send({
					status: false,
					message: err
				})
			})
	})

export default router
