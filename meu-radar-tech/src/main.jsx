import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
  )
  
  /* StrictMode detecta problemas em desenvolvimento */
  
  /*createRoot é a API do React 18+ que renderiza */
  
  
  
  