const GoogleTokenStrategy = require('passport-google-token').Strategy
const LocalStrategy = require('passport-local').Strategy
import bcrypt from 'bcrypt'
import FacebookTokenStrategy from 'passport-facebook-token'
import credentials from './credentials'
import UserModel from '../models/user.model'

const AuthConfig = passport => {
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    UserModel.findById(id, function(err, user) {
      done(err, user)
    })
  })

  passport.use(new GoogleTokenStrategy({
    clientID: credentials.google.clientID,
    clientSecret: credentials.google.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    UserModel.createGoogleUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user)
    })
  })),

  passport.use(new FacebookTokenStrategy({
    clientID: credentials.facebook.clientID,
    clientSecret: credentials.facebook.clientSecret
  },
  function (accessToken, refreshToken, profile, done) {
    UserModel.createFbUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    })
  })),

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      const user = await UserModel.findOne({ email })
      if(user) {
        return done(null, false, { message: "User already exists" })
      } else {
        const newUser = await new UserModel({ email, password })
        newUser.password = await bcrypt.hash(password, 10)
        newUser.authType = 'local'
        newUser.save()
        .then(info => done(null, info))
      }
    } catch (error) {
      done(error)
    }
  })),

  function findEmail(email) {
    return this.findOne({ email })
  }

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    UserModel.loginLocalUser(email, password, function(err, user) {
      return done(err, user)
    })
  }))
}

export default AuthConfig
