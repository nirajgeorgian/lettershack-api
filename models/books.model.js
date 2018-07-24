import mongoose from 'mongoose'
import slug from '../config/slugify'
const Schema = mongoose.Schema

const BookSchema = new Schema({
	slug: { type: String },
	title: { type: String, required: true},
	description: { type: String, required: true },
	coverImage: String,
	tagList: [{ type: String }],
	genre: { type: String },
	favouriteCount: { type: Number, default: 0},
	views: { type: Number, default: 0},
	rating: { type: Number, default: 0},
	isbn: { type: String, lowercase: true },
	chapters: [ { type: Schema.Types.ObjectId, ref: 'NoteModel' }],
	noOfPages: Number,
	price: { type: String },
	published: { type: Boolean },
	author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true}
}, { timestamps: true })

/*
class BookClass {

}
*/

BookSchema.pre('validate', function(next) {
	if(!this.slug) {
		this.slugify()
		next()
	}
	next()
})

BookSchema.methods.slugify = function() {
	this.slug = slug(this.title)
}

// method to check weather he can get the book or not
BookSchema.statics.getTitle = async function(title) {
	const book = await this.findOne({ title: title})
	// if no book with this title exists create one book
	if(!book) {
		return true
	} else {
		return false
	}
}



export default mongoose.model('BookModel', BookSchema)
