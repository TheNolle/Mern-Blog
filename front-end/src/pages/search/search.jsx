import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Components
import SearchComponent from '../../components/search/search'
import PostComponent from '../../components/post/post'

export default function SearchPage() {
    const [filteredPosts, setFilteredPosts] = useState([])
    const [posts, setPosts] = useState([])

    useEffect(() => {
        axios.get('http://localhost:26001/all-posts')
            .then(response => setPosts(response.data.postDocuments))
    }, [])

    useEffect(() => {
        setFilteredPosts(posts)
    }, [posts])

    function handleSearch(searchTerm) {
        const results = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (searchTerm[0] === "@" && post.author.username.toLowerCase().includes(searchTerm.slice(1).toLowerCase()))
        )
        setFilteredPosts(results)
    }

    return (
        <div className="search-page">
            <SearchComponent onSearch={handleSearch} disabled={posts.length === 0} />
            {posts.length > 0 && filteredPosts.length > 0 && filteredPosts.map((post, index) => (
                <PostComponent key={index} data={post} />
            ))}
            {(posts.length === 0 || filteredPosts.length === 0) && (
                <span className="no-post">No post found with your search term(s)</span>
            )}
        </div>
    )
}
