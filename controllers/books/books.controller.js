import UserModel from '../../models/user.model'
import NoteModel from '../../models/note.model'
import BookModel from '../../models/books.model'
import { error } from '../../config/response'

export const likeBook = async (req, res) => {
	if(req.body.id !== '' && req.params.id !== '') {
		if(req.body.id === req.params.id) {
			// now eerything is OK
			const BookModelData = await BookModel.findById(req.body.id)
			const UserModelData = await UserModel.findById(res.id)
			let isPresent = false
			BookModelData.likes.forEach(like => {
				if(String(like.userId) === String(res.id)) {
					// never liked it so push the id into it and save it
					isPresent = true
					return true
				}
			})
			if(!isPresent) {
				await BookModel.update(
					{ _id: req.body.id },
					{$push: {
						likes: { userId: res.id }
					}},
					{ upsert: true }
				)
				// BookModelData.likes.userId = res.id
			}
			let isPresentUser = false
			UserModelData.bookLiked.forEach(like => {
				if(String(like.bookId) === String(res.id)) {
					// never liked it so push the id into it and save it
					isPresentUser = true
					return true
				}
			})
			if(!isPresentUser) {
				await UserModel.update(
					{ _id: res.id },
					{$push: {
						bookLiked: { bookId: res.id }
					}},
					{ upsert: true }
				)
				// UserModelData.likes.push({ id: req.body.id })
			}
			await BookModelData.save()
			await UserModelData.save()
			const updatedBookModelData = await BookModel.findById(req.body.id)
			return res.send({
				status: true,
				book: updatedBookModelData
			})
		}
	}
}
// export const likeBook = async (req, res) => {
// 	if(req.body.id !== '' && req.params.id !== '') {
// 		const singleBook = await BookModel.findById(req.body.id)
// 		const currentUser = await UserModel.findById(res.id)
// 		const bookLiked = currentUser.bookLiked
// 		const BookModelLike = singleBook.like
// 		if(BookModelLike.length !== 0) {
// 			const isThereLikeBook = BookModelLike.forEach(x => {
// 				let isThereBook = false
// 				if(x.id === res.id) {
// 					isThereBook = true
// 					return isThereBook
// 				}
// 				return isThereBook
// 			})
// 			if(!isThereLikeBook) {
// 				// no record of it
// 				singleBook.like.push({ id: res.id })
// 				singleBook.save()
// 					.then(updatedBook => {
// 						// check for user entry of
// 					})
// 			}
// 		} else {
// 			// first entry of like
// 			singleBook.like.push({ id: res.id })
// 			singleBook.save()
// 				.then(resBook => {
// 					if(bookLiked.length !== 0) {
// 						const isThereLikeUser = bookLiked.forEach(x => {
// 							let isThereUser = false
// 							if(x.id === req.body.id) {
// 								isThereUser = true
// 								return isThereUser
// 							}
// 							return isThereUser
// 						})
// 						// we have both result
// 						console.log(isThereBook);
// 						console.log(isThereUser);
// 					} else {
// 						// there is no record of the book id
// 						currentUser.bookLiked.push({id: req.body.id})
// 						currentUser.save()
// 							.then(resUser => {
// 								// user added new book id
// 							})
// 					}
// 				})
// 		}
// 		/*
// 		if(bookLiked.length !== 0) {
// 			const isThereLikeUser = bookLiked.forEach(x => {
// 				let isThereUser = false
// 				if(x.id === req.body.id) {
// 					isThereUser = true
// 					return isThereUser
// 				}
// 				return isThereUser
// 			})
// 		} else {
// 			// never liked any book
// 			currentUser.bookLiked.push({id: req.body.id})
// 			currentUser.save()
// 				.then(x => console.log(x))
// 		}
// 		*/
// 		// console.log(currentUser);
// 		// const currentUser = await UserModel.find({ 'bookLiked.id': res.id},
// 		// 	{ bookLiked:
// 		// 		{ $elemMatch:
// 		// 			{
// 		// 				id: res.id
// 		// 			}
// 		// 		}
// 		// 	}, (err, res) => {
// 		// 		if(err) console.log(err);
// 		// 		if(res.length === 0) {
// 		// 			// else there is no user
// 		//
// 		// 		}
// 		// 	}
// 		// )
//
// 		// return res.send({
// 		// 	status: true,
// 		// 	book: singleBook
// 		// })
// 	} else {
// 		return error(res, 'Please pass id of the book')
// 	}
// }

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
	console.log(profile);
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
