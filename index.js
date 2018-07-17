import http from 'http'
import express from 'express'
// import socket from 'socket.io'
import mongoose from 'mongoose'
import passport from 'passport'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
const expressSwagger = require('express-swagger-generator')(app)
import authMiddleWare from './config/authMiddleware'

env(app)  //Setting up env as early as possible
logs(app)  // Setting Up Logger to log to files

let options = {
	swaggerDefinition: {
		info: {
			description: 'REST api for lettershack',
			title: 'lettershack',
			version: '0.0.1',
		},
		host: 'localhost:8080',
		basePath: '/',
		produces: [
			'application/json',
			'application/xml'
		],
		schemes: ['http', 'https'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'x-auth-token',
				description: 'login and pass the auth token to access protected routes',
			}
		}
	},
	basedir: __dirname, //app absolute path
	files: ['./routes/**/*.js'] //Path to the API handle folder
}
expressSwagger(options)

// Custom self made module
import env from './env/env'
import logs from './logs/logs'
import ignReq from './utils/ignoreRequest'
import AuthConfig from './config/passport.config'
import homeRoute from './routes/home.route'
import googleAuthRoute from './routes/auth/auth.google.route'
import facebookAuthRoute from './routes/auth/auth.facebook.route'
import localAuthRoute from './routes/auth/auth.local'

// CORS options
let corsOption = {
	origin: true,
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
	credentials: true,
	exposedHeaders: ['x-auth-token']
}

const server = http.Server(app)
// const io = socket(server)
const port = process.env.PORT || 8000
const mongoUri = `${process.env.MONGO_HOST}/lettershack`

// Connect to mongodb
mongoose.connect(mongoUri, { autoReconnect: true, useNewUrlParser: true })
const db = mongoose.connection

// Setup Passport so that it can use strategy
AuthConfig(passport)
app.use(passport.initialize())
app.use(ignReq.ignoreFavicon)  // Removing requests to /favicon.ico
app.use(ignReq.ignoreRobots)  // Fix for /robots.txt for api's
app.use(cors(corsOption))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
authMiddleWare(app)

// Set up routes
app.use('', googleAuthRoute)
app.use('', facebookAuthRoute)
app.use('/api', homeRoute)
app.use('', localAuthRoute)

/* eslint-disable */
db.once('open', () => {
  console.log("database successfully connected")
  server.listen(port, err => {
    if(err) {
      console.log("Error occured " + err.message());
      process.exit()
    }
    console.log(`Running on ${process.env.HOST}:${port} on ${process.env.NODE_ENV} mode`);
  })
})
