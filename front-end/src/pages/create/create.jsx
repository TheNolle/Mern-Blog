import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageCompression from 'browser-image-compression'
import axios from 'axios'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'

import './create.scss'
import 'react-quill/dist/quill.snow.css'

// Contexts
import { UserContext } from '../../contexts/user'

export default function CreatePage() {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [cover, setCover] = useState('')
    const [content, setContent] = useState('')
    const { userInfo } = useContext(UserContext)
    const [disabled, setDisabled] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) navigate('/login')
    }, [userInfo])

    useEffect(() => {
        axios.get('http://localhost:26001/profile', { withCredentials: true })
            .then(response => { if (!response.data.ok) return navigate('/login') })
    }, [])

    async function ImgToBase64(file) {
        try {
            const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, convertSize: 0 })
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(compressedFile)
                reader.onload = () => resolve(reader.result)
                reader.onerror = error => reject(error)
            })
        } catch (error) {
            toast.error('An error occurred while compressing the image. Please try again later.')
        }
    }

    async function createNewPost(event) {
        event.preventDefault()
        setDisabled(true)
        axios.post('http://localhost:26001/create', { title, summary, cover: await ImgToBase64(cover), content }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
            .then(response => { if (response.data.ok) return navigate('/') })
            .catch(error => toast.error(error.response.data.message))
    }

    return (
        <form className="create-page" onSubmit={createNewPost}>
            <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} required />
            <input type="text" placeholder="Summary" value={summary} onChange={event => setSummary(event.target.value)} required />
            <input type="file" placeholder="Cover" onChange={event => setCover(event.target.files[0])} required />
            <ReactQuill
                value={content}
                onChange={value => setContent(value)}
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': -1 }, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                }}
                formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
                    'list', 'bullet', 'indent',
                    'link', 'image'
                ]}
            />
            <button className="create" type="submit" disabled={disabled}>Create post</button>
        </form>
    )
}
