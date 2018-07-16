const credentials = {
  google: {
    'clientID': '931728103562-kivlmr53i8ckklnb9lj2nrtthv38qk9a.apps.googleusercontent.com',
    'clientSecret': 'lfxJPeW6CwfZ98_TiHW7sWI5',
    'callbackUrl': `${process.env.HOST}:${process.env.PORT}/auth/google/callback`
  },
  facebook: {
    'clientID': '517391568694969',
    'clientSecret': '009b3fbafe902488b2e09b1d1524a8ee',
    'callbackUrl': `${process.env.HOST}:${process.env.PORT}/api/auth/facebook/callback`
  }
}

export default credentials
