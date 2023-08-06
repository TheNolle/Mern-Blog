import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaRegEdit } from 'react-icons/fa'
import { format } from 'date-fns'
import HtmlReactParser from 'html-react-parser'
import DOMPurify from 'dompurify'

import './post.scss'

// Contexts
import { UserContext } from '../../contexts/user'

export default function PostPage() {
    const [post, setPost] = useState({})
    const { userInfo } = useContext(UserContext)

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        axios.get(`http://localhost:26001/post/${id}`)
            .then(response => {
                if (response.data.ok) return setPost(response.data.postDocument)
                toast.error("The post you are trying to access does not exist.")
                navigate("/")
            })
            .catch(error => toast.error("An error occurred while loading the post. Please try again later."))
    }, [])

    function formatDate(date) {
        return format(new Date(date), "MMMM dd, yyyy 'at' HH:mm")
    }

    return (
        <>
            {post.createdAt && (
                <div className="post-page">
                    <h1 className="title">{post.title}</h1>
                    <time title={`Published on ${formatDate(post.createdAt)}\nLast updated on ${formatDate(post.updatedAt)}`}>
                        {post.createdAt === post.updatedAt ? "Published on " : "Last updated on "}
                        {format(new Date(post.updatedAt), "MMMM dd, yyyy 'at' HH:mm")}
                    </time>
                    <span className="author">by @{post.author.username}</span>
                    {userInfo && userInfo.username === post.author.username && (
                        <div className="edit">
                            <Link to={`/post/${id}/edit`}>
                                <FaRegEdit />
                                Edit this post
                            </Link>
                        </div>
                    )}
                    <div className="image"><img src={post.cover} alt={post.title} /></div>
                    <div className="content">{HtmlReactParser(DOMPurify.sanitize(post.content))}</div>
                </div>
            )}
        </>
    )
}
