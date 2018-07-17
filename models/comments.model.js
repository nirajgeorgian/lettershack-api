import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CommentSchema = new Schema({
	body: { type: String },
	author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true},
	note: { type: Schema.Types.ObjectId, ref: 'NoteModel', required: true}
})

export default mongoose.model('CommentModel', CommentSchema)
