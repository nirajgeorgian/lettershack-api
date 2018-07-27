import passport from 'passport'
import jwt from 'jsonwebtoken'
import UserModel from '../../models/user.model'
import { error } from '../../config/response'
import constants from '../../config/constants'

export const signup = (req, res, next) => {
	passport.authenticate('signup', { session: false }, async (err, user) => {
		if(err) {
			return await error(res, 'Bad Request')
		}
		if(!user) {
			return await error(res, 'User already exists')
		}
		res.status(200).send({
			user: user,
			status: true
		})
	})(req, res, next)
}

export const login = (req, res, next) => {
	passport.authenticate('login', { session: false }, async (err, user) => {
		if(err) {
			return await error(res, 'Something is not right, Try google or facebook login')
		}
		if(Object.keys(user).length === 0) {
			return await error(res, 'Password donot match')
		}
		if(!user) {
			return await error(res, 'User does not exists')
		}
		req.login(user, { session: false }, async (error) => {
			if( error ) return next(error)
			//We don't want to store the sensitive information such as the
			//user password in the token so we pick only the email and id
			const body = { id : user._id }
			// Sign the JWT token and populate the payload with the user email and id
			const token = jwt.sign({ user : body }, constants.SECRET_KEY, { expiresIn: 60 * 120 })
			//Send back the token to the user
			res.setHeader('x-auth-token', token)
			return await res.json({
				token,
				status: true
			})
			// next()
		})
	})(req, res, next)
}

export const googleLogin = (req, res, next) => {
	if(!req.user) {
		return error('User not authenticated')
	}
	req.auth = {
		id: req.user.id
	}
	next()
}

export const fbLogin = async (req, res, next) => {
	if(!req.user) {
		return await error('User not authenticated')
	}
	req.auth = {
		id: req.user.id
	}
	next()
}

export const getUser = async (req, res) => {
	const user = await UserModel.findOne({ username: req.params.username })
	if(user) {
		return res.send({
			status: true,
			user: user
		})
	} else {
		error(res, 'go ahead with this username')
	}
}

export const updateUser = (req, res) => {
	const data = req.body
	UserModel.findByIdAndUpdate(res.id)
		.then(currUser => {
			currUser.username = data.username ? data.username : null
			currUser.name = data.name ? data.name : null
			currUser.bio = data.bio ? data.bio : null
			currUser.image = data.image ? data.image : null
			currUser.isAgent = data.isAgent ? data.isAgent : null
			currUser.save()
				.then(updatedUser => {
					return res.send({
						status: true,
						user: updatedUser
					})
				})
		})
		.catch(err => {
			return error(res, err)
		})
}

export const setUsername = async (req, res) => {
	const data = req.body
	const user = await UserModel.findOne({ username: req.params.username })
	if(!user) {
		// no user exists set up username create it for first time
		UserModel.findByIdAndUpdate(res.id)
			.then(currUser => {
				if(currUser.id === res.id) {
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
}


export const follow = async (req, res) => {
	const username = req.params.username
	// this is the user whome the logged in user want to follow
	const user = await UserModel.findOne({ username: username })
	// find the current logged in user who should follow
	const loggedInUser = await UserModel.findById(res.id)
	if(!user || !loggedInUser) {
		// invalid request
		return error(res, 'Whome do you want to follow ??')
	} else {
		// we have both the user now we can follow
		user.addFollower(loggedInUser.id)
		loggedInUser.addFollowing(user.id)
		return res.send({
			status: true,
			user: loggedInUser
		})
	}
}

export const unfollow = async (req, res) => {
	const username = req.params.username
	// this is the user whome the logged in user want to unfollow
	const user = await UserModel.findOne({ username: username })
	// find the current logged in user who should unfollow
	const loggedInUser = await UserModel.findById(res.id)
	if(!user || !loggedInUser) {
		// invalid request
		return error(res, 'Whome do you want to follow ??')
	} else {
		// we have both the user now we can unfollow
		user.removeFollower(loggedInUser._id)
		loggedInUser.addUnfollowing(user._id)
		return res.send({
			status: true,
			user: loggedInUser
		})
	}
}