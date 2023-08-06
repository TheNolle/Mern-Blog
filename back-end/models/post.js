const { model, Schema } = require('mongoose')

module.exports = model('Post', new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    cover: { type: String, required: true },
    content: { type: String, required: true },
}, {
    timestamps: true
}))