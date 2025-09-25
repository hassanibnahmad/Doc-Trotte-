import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'aos/dist/aos.css';
import App from './App.jsx'
import AOS from 'aos';

// Initialize AOS library
AOS.init({ once: true, duration: 800 });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
