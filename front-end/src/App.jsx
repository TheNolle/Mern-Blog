import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout'

import './App.scss'

// Contexts
import { UserContextProvider } from './contexts/user'

// Pages
import HomePage from './pages/home/home'
import LoginPage from './pages/login/login'
import CreatePage from './pages/create/create'
import PostPage from './pages/post/post'
import EditPage from './pages/edit/edit'
import SearchPage from './pages/search/search'

export default function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/post/:id" element={<PostPage />} />
                    <Route path="/post/:id/edit" element={<EditPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Routes>
        </UserContextProvider>
    )
}
