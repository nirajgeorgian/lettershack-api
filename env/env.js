import path from 'path'

const env = app => {
  app.get('env') == 'development'
  ? require('dotenv').config({ path: path.resolve(process.cwd(), 'env/.env.dev')})
  : require('dotenv').config({ path: path.resolve(process.cwd(), 'env/.env')})
}

export default env
