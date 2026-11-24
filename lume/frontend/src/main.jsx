import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
  <UserProvider>
    <App />
    </UserProvider>
  </HashRouter>,
)
