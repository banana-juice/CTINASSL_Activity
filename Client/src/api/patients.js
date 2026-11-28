// Talks to the Express server (Server/COMPONENTS/controller/patientController.js)
const BASE = '/api/patients'

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || data.message || 'Request failed')
  return data
}

export const getPatients = () => request('/')

export const createPatient = async (patient) =>
  (await request('/create', { method: 'POST', body: JSON.stringify(patient) })).patient

export const updatePatient = async (id, changes) =>
  (await request(`/update/${id}`, { method: 'PUT', body: JSON.stringify(changes) })).patient

export const deletePatient = (id) => request(`/${id}`, { method: 'DELETE' })
