import mongoose from 'mongoose'
import slug from '../config/slugify'
const Schema = mongoose.Schema
import UserModel from '../models/user.model'

const NoteSchema = new Schema({
	slug: { type: String },
	title: { type: String, required: true},
	description: { type: String, required: true },
	content: { type: String },
	imageUrl: { type: String },
	tagList: [{ type: String }],
	genre: { type: String },
	favouriteCount: { type: Number, default: 0},
	views: { type: Number, default: 0},
	rating: { type: Number, default: 0},
	comments: [{ type: Schema.Types.ObjectId, ref: 'CommentModel'}],
	author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true}
}, { timestamps: true })

NoteSchema.pre('validate', next => {
	if(!this.slug) {
		this.slugify()
	}
	next()
})

NoteSchema.methods.slugify = function() {
	this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}


export default mongoose.model('NoteModel', NoteSchema)
