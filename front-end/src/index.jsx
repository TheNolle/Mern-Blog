import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import './index.scss'
import 'react-toastify/dist/ReactToastify.css'

// Components
import App from './App'

ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
                <ToastContainer
                    position="bottom-right"
                    limit={5}
                    newestOnTop
                    closeOnClick={false}
                    theme="dark"
                />
            </BrowserRouter>
        </React.StrictMode>
    )
