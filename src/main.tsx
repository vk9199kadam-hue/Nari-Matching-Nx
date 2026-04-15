import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker
registerSW({ immediate: true })
import { useProductStore } from './store/productStore'

// Initialize data from CockroachDB
useProductStore.getState().fetchProducts()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
