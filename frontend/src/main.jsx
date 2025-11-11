import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router'
import router from '@/routes/router.jsx'
import { AuthProvider } from '@/context/AuthContext.jsx'
import '@/index.css'
import '@/App.css'
import "react-tabs/style/react-tabs.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
