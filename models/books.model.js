import mongoose from 'mongoose'
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

export default mongoose.model('BookModel', BookSchema)
