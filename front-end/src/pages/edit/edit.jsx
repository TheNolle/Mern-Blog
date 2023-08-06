import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'

import './edit.scss'

// Contexts
import { UserContext } from '../../contexts/user'

export default function EditPage() {
    const { id } = useParams()
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

    useEffect(() => {
        axios.get(`http://localhost:26001/post/${id}`)
            .then(response => {
                if (response.data.ok) {
                    const post = response.data.postDocument
                    setTitle(post.title)
                    setSummary(post.summary)
                    setCover(post.cover)
                    return setContent(post.content)
                }
                toast.error("The post you are trying to access does not exist.")
                navigate("/")
            })
            .catch(error => toast.error("An error occurred while loading the post. Please try again later."))
    }, [])

    async function ImgToBase64(file) {
        if (!file.type || !file.type.includes("image")) return file
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

    async function updatePost(event) {
        event.preventDefault()
        setDisabled(true)
        axios.put(`http://localhost:26001/post/${id}`, { title, summary, cover: await ImgToBase64(cover), content }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
            .then(response => { if (response.data.ok) return navigate(`/post/${id}`) })
            .catch(error => toast.error(error.response.data.message))
    }

    function deletePostDialog(event) {
        event.preventDefault()
        const dialog = document.querySelector('.confirmation-dialog')
        dialog.classList.toggle('open')
    }

    function deletePost(event) {
        event.preventDefault()
        setDisabled(true)
        axios.delete(`http://localhost:26001/post/${id}`, { withCredentials: true })
            .then(response => { if (response.data.ok) return navigate("/") })
            .catch(error => toast.error(error.response.data.message))
    }

    return (
        <form className="edit-page" onSubmit={updatePost}>
            <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} required />
            <input type="text" placeholder="Summary" value={summary} onChange={event => setSummary(event.target.value)} required />
            <input type="file" placeholder="Cover" onChange={event => setCover(event.target.files[0])} />
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
            <div className="buttons">
                <button className="edit" type="submit" disabled={disabled}>Update post</button>
                <button className="remove" onClick={deletePostDialog}>Delete post</button>
                <dialog className="confirmation-dialog">
                    <div className="modal">
                        <h1>Are you sure?</h1>
                        <div className="buttons">
                            <button onClick={deletePost} disabled={disabled}>Yes, confirm</button>
                            <button onClick={deletePostDialog}>No, cancel</button>
                        </div>
                    </div>
                </dialog>
            </div>
        </form>
    )
}
