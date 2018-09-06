import express from 'express'
const router = express.Router()
import { create, get, getOneBook, checkTitle, updateBook, likeBook } from '../../controllers/books/books.controller'

router.route('/books')
	.post(authMiddleWare, create)
	.get(get)

router.route('/book/:id')
	.get(getOneBook)
	.put(authMiddleWare, updateBook)

router.route('/book/like/:id')
	.put(authMiddleWare, likeBook)

// helper's routes for ui better development
router.route('/books/:title')
	.get(authMiddleWare, checkTitle)


export default router
