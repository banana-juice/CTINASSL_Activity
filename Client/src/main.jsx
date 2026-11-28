import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@fontsource/belleza'
import '@fontsource-variable/public-sans'
import './index.css'
import AppLayout from './layouts/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewIntake from './pages/NewIntake.jsx'
import PatientIntake from './pages/PatientIntake.jsx'
import Records from './pages/Records.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-intake" element={<PatientIntake />} />
          <Route path="/patient-intake/new" element={<NewIntake />} />
          <Route path="/patient-intake/:id/edit" element={<NewIntake />} />
          <Route path="/records" element={<Records />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
