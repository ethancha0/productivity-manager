import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DotGrid from './DotGrid.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>

</div>
    <App />
  </StrictMode>,
)
