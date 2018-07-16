import fs from 'fs'
import path from 'path'
import morgan from 'morgan'
import rfs from 'rotating-file-stream'

const logDirectory = path.join(__dirname, 'log')

// Make sure folder exists or create one folder
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// Creating rotating log files which change after 1 day
const logStream = rfs('access.log', {
  interval: '1d', // rotate per day
  path: logDirectory
})

const logs = app => {
  process.env.NODE_ENV // Boolean
    ? app.use(morgan('dev'))
    : app.use(morgan('common', { stream: logStream}))
}

// {skip: function (req, res) { return res.statusCode < 400 || res.statusCode >= 500 }}
export default logs
