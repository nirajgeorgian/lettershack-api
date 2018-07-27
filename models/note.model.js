import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import slug from '../config/slugify'
const Schema = mongoose.Schema
import UserModel from '../models/user.model'

const NoteSchema = new Schema({
	slug: { type: String, unique: true },
	title: { type: String, required: true, unique: true},
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

NoteSchema.methods.addTagList = function(list) {
	if(Array.isArray(list)) {
		list.forEach((x) => {
			if(!this.tagList.includes(x)) {
				this.tagList.push(x)
			}
		})
		return this.tagList
	}
	return this.tagList
}

NoteSchema.pre('validate', function(next) {
	if(!this.slug) {
		this.slugify()
	}
	next()
})

NoteSchema.methods.slugify = function() {
	this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}

NoteSchema.plugin(mongoosePaginate)
export default mongoose.model('NoteModel', NoteSchema)
