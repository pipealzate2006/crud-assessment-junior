import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { setupInterceptors } from './api/interceptors'
import './styles/main.scss'

setupInterceptors()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
