import jwt from 'jsonwebtoken'

const createToken = auth => {
  return jwt.sign({
    id: auth.id
  }, 'my-super-secret',
  {
    expiresIn: 60 * 120
  })
}

export const generateToken = (req, res, next) => {
  req.token = createToken(req.auth)
  return next()
}

export const sendToken = (req, res, next) => {
  console.log(req.token);
  res.setHeader('x-auth-token', req.token)
  return res.status(200).send(req.user)
}
