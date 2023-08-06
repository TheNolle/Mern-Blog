import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

// Components
import PostComponent from '../../components/post/post'
import PaginationComponent from '../../components/pagination/pagination'

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)

    useEffect(() => {
        axios.get(`http://localhost:26001/posts?page=${page}`)
            .then(response => {
                setPosts(response.data.postDocuments)
                setPageCount(response.data.totalPages)
            })
            .catch(error => toast.error(error.message))
    }, [page])

    function handlePageChange(page) {
        setPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="home-page">
            {posts.length > 0 && posts.map((post, index) => (
                <PostComponent key={index} data={post} />
            ))}
            {pageCount > 1 && (
                <PaginationComponent
                    pageCount={pageCount}
                    currentPage={page}
                    onPageChange={(page) => handlePageChange(page)}
                />
            )}
            {posts.length === 0 && (
                <span className="no-post">There are no posts at the moment.</span>
            )}
        </div>
    )
}
