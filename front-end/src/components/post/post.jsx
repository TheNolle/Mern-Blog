import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import './post.scss'

/**
 * @param {{
 *  data: {
 *      _id: string,
 *      author: {
 *          username: string,
 *      },
 *      title: string,
 *      summary: string,
 *      cover: string,
 *      createdAt: string
 *  }
 * }}
 */
export default function PostComponent({ data }) {
    const { _id, author, title, summary, cover, createdAt, updatedAt } = data

    function formatDate(date) {
        return format(new Date(date), "MMMM dd, yyyy 'at' HH:mm")
    }

    return (
        <div className="post-component">
            <Link to={`/post/${_id}`}><img src={cover} alt={title} /></Link>
            <div className="texts">
                <Link to={`/post/${_id}`}><h2 className="title">{title}</h2></Link>
                <p className="infos">
                    <a className="author">{author.username}</a>
                    <time title={`Published on ${formatDate(createdAt)}\nLast updated on ${formatDate(updatedAt)}`}>
                        {format(new Date(updatedAt), 'cccc dd MMMM yyyy, HH:mm')}
                    </time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    )
}   
