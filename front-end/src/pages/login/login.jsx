import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

import './login.scss'

// Contexts
import { UserContext } from '../../contexts/user'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUserInfo, userInfo } = useContext(UserContext)

    const navigate = useNavigate()

    function handleLogin(event) {
        event.preventDefault()
        axios.post('http://localhost:26001/login', { email, password }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(response => {
                if (response.data.ok) return setUserInfo({ id: response.data.id, username: response.data.username })
                else if (response.data.message) return toast(response.data.message)
                toast("Wow so easy!")
            })
    }

    useEffect(() => {
        if (userInfo) navigate('/')
    }, [userInfo])

    return (
        <form className="login-page" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="email" placeholder="mail" value={email} onChange={event => setEmail(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button type="submit">Login</button>
        </form>
    )
}
