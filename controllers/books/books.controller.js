import UserModel from '../../models/user.model'
import NoteModel from '../../models/note.model'
import BookModel from '../../models/books.model'
import { error } from '../../config/response'

export const create = async (req, res) => {
	const data = req.body
	// validate the above data with the url
	const book = new BookModel(data)
	const profile = await UserModel.findById(res.id)
	book.author = profile._id
	// book title should be different
	const isBook = await BookModel.getTitle(data.title)
	if(!isBook) {
		// already book is created with this title
		error(res, 'Sorry, Book title already exists')
	} else {
		book.save()
		.then(currBook => {
			return res.send({
				status: true,
				book: currBook
			})
		})
	}
}

export const get = async (req, res) => {
	const books = await BookModel.find({})
	if(!books) {
		error(res, 'No books are created')
	} else {
		res.send({
			status: true,
			books: books
		})
	}
}

export const getOneBook = async (req, res) => {
	BookModel.findById(req.params.id)
		.populate('author')
		.exec(function (err, book) {
			if(book) {
				res.send({
					status: true,
					book: book
				})
			} else {
				error(res, 'No Book exists')
			}
			if(err) {
				error(res, err)
			}
		})
}


export const checkTitle = async (req, res) => {
	const title = req.params.title
	const confirmTitle = await BookModel.getTitle(title)
	if(confirmTitle) {
		// true means he can use given book title or else change the title
		return res.send({
			status: true,
			message: 'Go ahead with this title'
		})
	} else {
		error(res, 'Sorry, Book title already exists')
	}
}
