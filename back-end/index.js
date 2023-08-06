const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// Models
const UserModel = require('./models/user')
const PostModel = require('./models/post')


const app = express()
app.use(cors({ credentials: true, origin: 'http://localhost:25001' }))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))


mongoose.connect('mongodb://localhost:27017/blog-thenolle-com', { appName: 'blog.thenolle.com' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(console.error)


app.post('/login', async (request, response) => {
    const { email, password } = request.body
    const userDocument = await UserModel.findOne({ email })
    if (!userDocument) return response.json({ message: 'invalid credentials' })
    if (!bcrypt.compareSync(password, userDocument.password)) return response.json({ message: 'invalid credentials' })
    jsonwebtoken.sign({ id: userDocument._id, username: userDocument.username }, '27d900f8-124d-5fe3-9e3b-6985ba133f50', async (error, token) => {
        if (error) throw error
        response.cookie('token', token).json({ ok: true, id: userDocument._id, username: userDocument.username })
    })
})

app.get('/profile', (request, response) => {
    const { token } = request.cookies
    if (!token) return response.json({ message: 'No token found' })
    jsonwebtoken.verify(token, '27d900f8-124d-5fe3-9e3b-6985ba133f50', async (error, decoded) => {
        if (error || !decoded) return response.json({ message: 'Invalid token' })
        response.json({ ok: true, decoded })
    })
})

app.post('/logout', (request, response) => {
    response.cookie('token', '').json({ ok: true })
})

app.post('/create', async (request, response) => {
    const { token } = request.cookies
    if (!token) return response.json({ message: 'No token found' })
    jsonwebtoken.verify(token, '27d900f8-124d-5fe3-9e3b-6985ba133f50', async (error, decoded) => {
        if (error || !decoded) return response.json({ message: 'Invalid token' })
        const { title, summary, cover, content } = request.body
        const postDocument = await PostModel.create({ author: decoded.id, title, summary, cover, content })
        response.json({ ok: true, postDocument })
    })
})

app.get('/post/:id', async (request, response) => {
    const { id } = request.params
    try {
        const postDocument = await PostModel.findById(id).populate('author', ['username'])
        response.json({ ok: true, postDocument })
    } catch (error) {
        response.json({ message: 'Post not found' })
    }
})

app.put('/post/:id', async (request, response) => {
    const { token } = request.cookies
    if (!token) return response.json({ message: 'No token found' })
    jsonwebtoken.verify(token, '27d900f8-124d-5fe3-9e3b-6985ba133f50', async (error, decoded) => {
        if (error || !decoded) return response.json({ message: 'Invalid token' })
        const { id } = request.params
        const { title, summary, cover, content } = request.body
        const postDocument = await PostModel.findByIdAndUpdate(id, { author: decoded.id, title, summary, cover, content })
        response.json({ ok: true, postDocument })
    })
})

app.delete('/post/:id', async (request, response) => {
    const { token } = request.cookies
    if (!token) return response.json({ message: 'No token found' })
    jsonwebtoken.verify(token, '27d900f8-124d-5fe3-9e3b-6985ba133f50', async (error, decoded) => {
        if (error || !decoded) return response.json({ message: 'Invalid token' })
        const { id } = request.params
        try {
            await PostModel.findByIdAndDelete(id)
            response.json({ ok: true })
        } catch (error) {
            response.json({ message: 'Post not found' })
        }
    })
})

app.get('/posts', async (request, response) => {
    const page = request.query.page || 1
    const limit = 20
    const skip = (page - 1) * limit
    const totalPosts = await PostModel.countDocuments()
    const totalPages = Math.ceil(totalPosts / limit)
    const postDocuments = await PostModel.find().populate('author', ['username']).sort({ updatedAt: -1 }).skip(skip).limit(limit)
    response.json({ postDocuments, totalPages })
})

app.get('/all-posts', async (request, response) => {
    const postDocuments = await PostModel.find().populate('author', ['username']).sort({ updatedAt: -1 })
    response.json({ postDocuments })
})


try {
    app.listen(26001)
    console.log('Listening on port 26001')
} catch (error) {
    console.error(error)
}