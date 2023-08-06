import React from 'react'
import { Outlet } from 'react-router-dom'

// Components
import HeaderComponent from './components/header/header'

export default function layout() {
    return (
        <main>
            <HeaderComponent />
            <Outlet />
        </main>
    )
}
