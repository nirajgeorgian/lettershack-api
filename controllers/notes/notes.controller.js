import UserModel from '../../models/user.model'
import NoteModel from '../../models/note.model'
import BookModel from '../../models/books.model'

export const create = async (req, res) => {
	// case on content
	if((req.body.content).trim().length === 0) {
		return res.send({
			status: false,
			message: 'Content can\'t be empty'
		})
	}
	const note = new NoteModel(...req.body)
	const user = await UserModel.findById(res.id)
	if(user) {
		note.author = user
		// TODO: Push notifications to be sent
		note.save() // allow puh notifications to be sent here
			.then(updatedUser => {
				// update the book chapter
				// BookModel.findOne({ slug: req.params.})
				// TODO: Add notes to chapters
				return res.send({
					status: true,
					user: updatedUser
				})
			})
			.catch(err => res.send({
				status: false,
				message: err
			}))
	}
}

export const findAll = async (req, res) => {
	
}
