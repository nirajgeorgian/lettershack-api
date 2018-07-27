import { error } from '../../config/response'
import UserModel from '../../models/user.model'
import NoteModel from '../../models/note.model'
import BookModel from '../../models/books.model'

export const create = async (req, res) => {
	// notes will alway's belong to one book so it must have book id
	// case on content
	const data = req.body
	if(!data.title) {
		return error(res, 'Please give a title')
	}
	if(!data.description) {
		return error(res, 'Please give a description')
	}
	if(!data.content) {
		return error(res, 'Please give a content to this note')
	}
	if(!data.bookId) {
		return error(res, 'Please choose a book to pusblish with')
	}
	const isTitle = await NoteModel.findOne({ title: data.title})
	if(isTitle) {
		return error(res, 'chapter already exists')
	}
	if((req.body.content).trim().length === 0) {
		return res.send({
			status: false,
			message: 'Content can\'t be empty'
		})
	}
	const book = await BookModel.findById(req.body.bookId)
	const note = new NoteModel(data)
	const user = await UserModel.findById(res.id)
	if(user && book) {
		note.author = user._id
		// TODO: Push notifications to be sent
		note.save() // allow puh notifications to be sent here
			.then(updatedUser => {
				// update the book chapter
				// BookModel.findOne({ slug: req.params.})
				// TODO: Add notes to chapters
				// update the book chapter
				// console.log("here");
				book.addChapter(note._id)
				book.save()
					.then(updatedBook => res.send({
						status: true,
						user: updatedUser
					}))
			})
			.catch(err => res.send({
				status: false,
				message: err
			}))
	} else {
		error(res, 'Either user or book not available')
	}
}

export const findAll = async (req, res) => {
	// search by limit, offset, tag author name, genre
	const { query = {}, select = '', page = 1, limit = 20 } = req.query
	let options = {
		select: select,
		page: parseInt(page),
		limit: parseInt(limit)
	}
	// const notes = await NoteModel.find({})
	// return res.send({
	// 	status: true,
	// 	notes: notes
	// })
	NoteModel.paginate(query, options)
		.then(notes => {
			return res.send({
				status: true,
				notes: notes
			})
		})
		.catch(err => error(res, err))
}

export const findOne = async (req, res) => {
	NoteModel.findOne({ _id: req.params.id })
		.populate('author')
		.populate('comments')
		.then(note => {
			if(!note) {
				res.send(error(res, 'No notes available'))
			} else {
				return res.send({
					status: true,
					note: note
				})
			}
		})
}

export const updateNote = async (req, res) => {
	const note = await NoteModel.findOne({ slug: req.params.id }).populate('author')
	if(!note) {
		return error(res, 'no note found with this slug')
	} else {
		const data = req.body
		note.title = data.title ? data.title : note.title
		note.description = data.description ? data.description : note.description
		note.content = data.content ? data.content : note.content
		note.imageUrl = data.imageUrl ? note.addTagList(data.tagList) : data.tagList
		note.genre = data.genre ? data.denre : note.genre
		note.save()
			.then(updatedNode => res.send({
				status: true,
				note: updatedNode
			}))
			.catch(err => error(err))
	}
}
