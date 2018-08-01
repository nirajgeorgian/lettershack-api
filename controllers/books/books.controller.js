import UserModel from '../../models/user.model'
import NoteModel from '../../models/note.model'
import BookModel from '../../models/books.model'
import { error } from '../../config/response'

export const create = async (req, res) => {
	const data = req.body
	if(!data.title) {
		return error(res, 'Please give a title')
	}
	if(!data.description) {
		return error(res, 'Please give a description')
	}
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
		book.description = data.description ? data.description : book.description
		book.coverImage = data.coverImage ? data.coverImage : book.coverImage
		book.tagList = data.tagList ?  book.addTagList(data.tagList) : data.tagList
		book.genre = data.genre ? data.genre : book.genre
		book.favouriteCount = data.favouriteCount ? data.favouriteCount : book.favouriteCount
		book.ratings = data.rating ? book.addRating(data.rating) : book.rating
		book.isbn = data.isbn ? data.isbn : book.isbn
		book.chapters = data.noteId ? book.addChapter(data.noteId) : book.chapters
		book.price = data.price ? data.price : book.price
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
	const books = await BookModel.find({}).populate('chapters')
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
	console.log(title);
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

export const updateBook = async (req, res) => {
	const book = await BookModel.findById(req.params.id)
	if(!book) {
		return error(res, 'No book find with this title')
	} else {
		const data = req.body
		book.description = data.description ? data.description : book.description
		book.coverImage = data.coverImage ? data.coverImage : book.coverImage
		book.tagList = data.tagList ?  book.addTagList(data.tagList) : data.tagList
		book.genre = data.genre ? data.genre : book.genre
		book.favouriteCount = data.favouriteCount ? data.favouriteCount : book.favouriteCount
		book.ratings = data.rating ? book.addRating(data.rating) : book.rating
		book.isbn = data.isbn ? data.isbn : book.isbn
		book.chapters = data.noteId ? book.addChapter(data.noteId) : book.chapters
		book.price = data.price ? data.price : book.price
		book.save()
			.then(x => res.send({
				status: true,
				book: x
			}))
			.catch(err => (error(res, err)))
	}
}
