import express from 'express'
const router = express.Router()
import { create, findAll, findOne, updateNote } from '../../controllers/notes/notes.controller'

router.route('/notes')
	.get(authMiddleWare, findAll)
	.post(authMiddleWare, create)

router.route('/notes/:id')
	.get(authMiddleWare, findOne)
	.put(authMiddleWare, updateNote)

export default router
