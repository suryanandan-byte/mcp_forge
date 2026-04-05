import { StrictMode } from 'react'
import '@fontsource/geist-sans';
import '@fontsource/space-grotesk';
import '@fontsource/jetbrains-mono';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
