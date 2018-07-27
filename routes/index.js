import homeRoute from './home.route'
import usersRoute from './users/users.route'
import bookRoute from './books/books.routes'
import notesRoute from './notes/notes.route'

const appRoutes = app => {
	// Set up routes
	app.use('', usersRoute)
	app.use('', homeRoute)
	app.use('', bookRoute)
	app.use('', notesRoute)
}

export default appRoutes
