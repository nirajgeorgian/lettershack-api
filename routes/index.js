import homeRoute from './home.route'
import googleAuthRoute from './auth/auth.google.route'
import facebookAuthRoute from './auth/auth.facebook.route'
import localAuthRoute from './auth/auth.local'
import profileAuthRoute from './profile.auth'
import bookRoute from './books/books.routes'

const appRoutes = app => {
	// Set up routes
	app.use('', googleAuthRoute)
	app.use('', facebookAuthRoute)
	app.use('', homeRoute)
	app.use('', localAuthRoute)
	app.use('', profileAuthRoute)
	app.use('', bookRoute)
}

export default appRoutes
