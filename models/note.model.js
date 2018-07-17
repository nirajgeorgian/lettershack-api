import mongoose from 'mongoose'
const Schema = mongoose.Schema

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

export default mongoose.model('NoteModel', NoteSchema)
