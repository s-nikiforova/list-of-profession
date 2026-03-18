import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './homepage/HomePage.jsx'
import MenuPage from './menupage/MenuPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/job/:id" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)