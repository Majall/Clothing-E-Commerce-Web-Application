import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ShopProvider } from './context/ShopContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
