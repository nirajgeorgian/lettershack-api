import express from 'express'
import passport from 'passport'
const router = express.Router()
import jwt from 'jsonwebtoken'
import constants from '../../config/constants'
import UserModel from '../../models/user.model'

/**
* @route POST /signup
* @group authentication - Operations on user authentication
* @param {string} email.query.required - username or email
* @param {string} password.query.required - user's password.
* @returns {string} 200 - User creation Object
* @returns {string} 401 - Bad Request or User alreay exists
*/
router.route("/signup")
  .post((req, res, next) => {
    passport.authenticate('signup', { session: false }, async (err, user, info) => {
      if(err) {
        return await res.status(401).send({
          message: "Bad Request"
        })
      }
      if(!user) {
        return await res.status(401).send({
          message: "User already exists"
        })
      }
      res.status(200).send({
        user: user
      })
  })(req, res, next)
})

/**
* @route POST /login
* @group authentication - Operations on user authentication
* @param {string} email.query.required - username or email
* @param {string} password.query.required - user's password.
* @returns {string} 200 - User creation Object token
* @returns {string} 401 - Bad Request or User alreay exists
*/
router.route("/login")
  .post((req, res, next) => {
    passport.authenticate("login", { session: false }, async (err, user) => {
      if(err) {
        return await res.status(400).send({
          message: 'Something is not right, Try google or facebook login',

        });
      }
      if(Object.keys(user).length === 0) {
        return await res.status(401).send({
          message: "Password donot match"
        })
      }
      if(!user) {
        return await res.status(400).json({
          message: 'User does not exists'
        });
      }
      req.login(user, { session: false }, async (error) => {
        if( error ) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { id : user._id };
        // Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user : body }, constants.SECRET_KEY, { expiresIn: 60 * 120 });
        //Send back the token to the user
        res.setHeader('x-auth-token', token)
        return await res.json({ token });
        // next()
      })
  })(req, res, next)
})


export default router
