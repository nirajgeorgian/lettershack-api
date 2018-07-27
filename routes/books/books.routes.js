import express from 'express'
const router = express.Router()
import { create, get, getOneBook, checkTitle, updateBook } from '../../controllers/books/books.controller'

router.route('/books')
	.post(authMiddleWare, create)
	.get(get)

router.route('/book/:id')
	.get(authMiddleWare, getOneBook)
	.put(authMiddleWare, updateBook)

// helper's routes for ui better development
router.route('/books/:title')
	.get(authMiddleWare, checkTitle)


export default router
