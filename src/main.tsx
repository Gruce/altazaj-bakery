import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App'
import { AppProvider } from './context/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every motion component honor prefers-reduced-motion */}
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <App />
      </AppProvider>
    </MotionConfig>
  </StrictMode>,
)
