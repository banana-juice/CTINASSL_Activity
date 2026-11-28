import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { createPatient, deletePatient, getPatients, updatePatient } from '../api/patients.js'

export default function AppLayout() {
  // Held here so every page shares the same list. Saved in MongoDB through the server.
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((err) => setError(`Could not load patients: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const replace = (saved) => setPatients((list) => list.map((p) => (p.id === saved.id ? saved : p)))

  // Create
  const addPatient = async (data) => {
    const saved = await createPatient(data)
    setPatients((list) => [...list, saved])
    return saved
  }

  // Update
  const editPatient = async (id, changes) => {
    const saved = await updatePatient(id, changes)
    replace(saved)
    return saved
  }

  const callPatient = (id) =>
    editPatient(id, { status: 'In assessment' }).catch((err) => setError(`Could not call patient: ${err.message}`))

  // Delete
  const removePatient = async (id) => {
    await deletePatient(id)
    setPatients((list) => list.filter((p) => p.id !== id))
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="app__main">
        {error && (
          <p className="alert" role="alert">
            {error}{' '}
            <button type="button" className="text-link" onClick={() => setError('')}>
              Dismiss
            </button>
          </p>
        )}
        {loading ? (
          <p className="page">Loading patients…</p>
        ) : (
          <Outlet context={{ patients, callPatient, addPatient, editPatient, removePatient, setError }} />
        )}
      </main>
    </div>
  )
}
