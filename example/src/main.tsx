import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FastStoreProvider } from './store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FastStoreProvider>
      <App />
    </FastStoreProvider>
  </StrictMode>,
)
