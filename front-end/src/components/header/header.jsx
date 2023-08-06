import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './header.scss'

// Contexts
import { UserContext } from '../../contexts/user'

export default function HeaderComponent() {
    const { setUserInfo, userInfo } = useContext(UserContext)

    useEffect(() => {
        axios.get('http://localhost:26001/profile', { withCredentials: true })
            .then(response => setUserInfo(response.data.decoded))
    }, [])

    function logout() {
        axios.post('http://localhost:26001/logout', {}, { withCredentials: true })
            .then(() => setUserInfo(null))
    }

    const username = userInfo?.username

    return (
        <header className="header-component">
            <Link to="/" className="logo">Nolly's Blog</Link>
            <nav className="navbar">
                <Link to="/search">Search</Link>
                {username ? (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    )
}
