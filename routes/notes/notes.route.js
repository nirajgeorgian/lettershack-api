import express from 'express'
const router = express.Router()
import NoteModel from '../../models/note.model'
import UserModel from '../../models/user.model'

router.route('/notes')
	.get(async (req, res) => {
		return "dodo"
	})
	.post(async (req, res) => { // Create a note and check all the possible cases
		
	})
