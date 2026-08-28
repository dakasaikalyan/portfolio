import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.onerror = function (message, source, lineno, colno, error) {
  const container = document.getElementById('root')
  if (container) {
    container.innerHTML = `
      <div style="background: #110708; color: #ff5560; padding: 30px; font-family: monospace; border: 2px solid #ff4d57; margin: 20px; border-radius: 6px;">
        <h2 style="margin-top: 0;">React Runtime Crash Detected</h2>
        <p><strong>Error:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
        <p><strong>Stack Trace:</strong></p>
        <pre style="background: #1c0f10; padding: 15px; border-radius: 4px; overflow-x: auto; color: #ff999f;">${error ? error.stack : 'No stack trace available'}</pre>
      </div>
    `
  }
  return false
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
