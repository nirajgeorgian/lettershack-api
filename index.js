import http from 'http'
import express from 'express'
// import socket from 'socket.io'
import mongoose from 'mongoose'
import passport from 'passport'
import cors from 'cors'
import bodyParser from 'body-parser'
const app = express()
import './config/authMiddleware'

env(app)  //Setting up env as early as possible
logs(app)  // Setting Up Logger to log to files

// Custom self made module
import env from './env/env'
import logs from './logs/logs'
import ignReq from './utils/ignoreRequest'
import AuthConfig from './config/passport.config'
import appRoutes from './routes/index'

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
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }))
appRoutes(app)

/* eslint-disable */
db.once('open', () => {
	console.info(`Connected to ${process.env.MONGO_HOST}/lettershack`);
  server.listen(port, err => {
    if(err) {
      console.log("Error occured " + err.message());
      process.exit()
    }
    console.log(`Running on ${process.env.HOST}:${port} on ${process.env.NODE_ENV} mode`);
  })
})
