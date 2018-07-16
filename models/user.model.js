import mongoose from 'mongoose'
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, lowercase: true },
  email: { type: String, lowercase: true, trim: true },
  username: { type: String, lowercase: true, trim: true },
  password: String,
  googleUserId: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  facebookUserId: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  token: String,
  authType: String
})

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  if(user.password) {
    //Hashes the password sent by the user for login and checks if the hashed password stored in the
    //database matches the one sent. Returns true if it does else false.
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  }
}

/*
  Utility methods for user creation
*/
async function findEmail(email) {
  return await this.findOne({ email })
}

async function createNewUser(profile, accessToken, id) {
  // no user exist's with this id for google, facebook or simple
  let newUser = new this({
    name: profile.displayName,
    email: profile.emails[0].value,
    [id]: {
      id: profile.id,
      token: accessToken
    },
    authType: id === 'facebookUserId' ? 'facebook' : id === 'googleUserId' ? 'google' : 'local'
  })
  const savedUser = await newUser.save()
  return savedUser
}

async function updateUser(user, profile, accessToken, id) {
  // no user exist's with this id for google, facebook or simple
  user.name = profile.displayName
  user[id] = {
    id: profile.id,
    token: accessToken
  }
  user.authType = (id === 'facebookUserId' ? 'facebook' : id === 'googleUserId' ? 'google' : 'local')
  const savedUser = await user.save()
  return savedUser
}

UserSchema.statics.createFbUser = async function(accessToken, refreshToken, profile, cb)  {
  let that = this
  let user = await findEmail.call(this, profile.emails[0].value)
  if(user === null) {
    // no user exist's with this id for google, facebook or simple
    const savedUser = await createNewUser.call(that, profile, accessToken, 'facebookUserId')
    return await cb(null, savedUser)
  } else {
    const savedUser = await updateUser(user, profile, accessToken, "facebookUserId")
    return await cb(null, savedUser)
  }
}

UserSchema.statics.loginLocalUser = async function(email, password, cb) {
  let that = this
  let user = await findEmail.call(this, email)
  if(user === null) {
    // No user exist for this user
    return cb(null, false, { message: "User not found" })
  } else  {
    // User already exists
    // Checl for google or facebook user existance
    if(user.password !== undefined) {
      const validate = await user.isValidPassword(password) // Validate password

      if(validate === false) {
        return cb(null, {}, { message: "Wrong Password" })
      } else {
        return await cb(null, user)
      }
    } else {
      const error = new Error("Try something else")
      return cb(error, false, { message: "Wrong Password" })
    }
  }
}

UserSchema.statics.createGoogleUser = async function(accessToken, refreshToken, profile, cb) {
  let that = this
  let user = await findEmail.call(this, profile.emails[0].value)
  console.log(user);
  if(user === null) {
    console.log("if ===");
    // no user exist's with this id for google, facebook or simple
    const savedUser = await createNewUser.call(that, profile, accessToken, 'googleUserId')
    return await cb(null, savedUser)
  } else {
    console.log("else ===");
    const savedUser = await updateUser(user, profile, accessToken, "googleUserId")
    return await cb(null, savedUser)
  }
  // console.log(accessToken)
  // console.log(refreshToken);
  // console.log(profile);
}


export default mongoose.model('UserModel', UserSchema)