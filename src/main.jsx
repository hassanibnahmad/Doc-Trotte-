import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'aos/dist/aos.css';
import App from './App.jsx'
import AOS from 'aos';

function AOSInitWrapper({ children }) {
  useEffect(() => {
    AOS.init({ once: true, duration: 800 });
  }, []);
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AOSInitWrapper>
      <App />
    </AOSInitWrapper>
  </StrictMode>,
)
