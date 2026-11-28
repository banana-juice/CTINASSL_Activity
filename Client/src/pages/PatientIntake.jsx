import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import IntakeForm from '../components/IntakeForm.jsx'
import TriageLevel from '../components/TriageLevel.jsx'
import { STATUSES } from '../data/patients.js'
import useNow from '../hooks/useNow.js'
import { LONG_WAIT_MINUTES, byAcuity, formatTime, formatWait, minutesSince } from '../utils/patients.js'

const FILTERS = ['All', ...STATUSES]

function StatusLine({ patient, now }) {
  if (patient.status === 'Waiting') {
    const minutes = minutesSince(patient.arrivedAt, now)
    return (
      <span className={minutes >= LONG_WAIT_MINUTES ? 'wait--long' : undefined}>
        Waiting {formatWait(minutes)}
      </span>
    )
  }
  if (patient.status === 'In assessment') return <span className="status--active">In assessment</span>
  return <span>{patient.status}</span>
}

export default function PatientIntake() {
  const { patients, addPatient, editPatient, removePatient, setError } = useOutletContext()
  const now = useNow()
  const [filter, setFilter] = useState('All')
  // null = closed, 'new' = adding, a patient object = editing that patient
  const [formFor, setFormFor] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const editing = formFor && formFor !== 'new' ? formFor : null
  const handleSubmit = (data) => (editing ? editPatient(editing.id, data) : addPatient(data))

  const handleDelete = async (patient) => {
    if (!window.confirm(`Delete ${patient.queueNo} (${patient.name})? This cannot be undone.`)) return
    setDeletingId(patient.id)
    try {
      await removePatient(patient.id)
    } catch (err) {
      setError(`Could not delete patient: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const sorted = [...patients].sort(byAcuity)
  const rows = filter === 'All' ? sorted : sorted.filter((p) => p.status === filter)
  const countFor = (name) => (name === 'All' ? sorted.length : sorted.filter((p) => p.status === name).length)

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">Patient Intake</h1>
        <button type="button" className="btn btn--primary" onClick={() => setFormFor('new')}>
          New Intake
        </button>
      </header>

      <div className="filter" role="group" aria-label="Filter by status">
        {FILTERS.map((name) => (
          <button
            key={name}
            type="button"
            className="filter__button"
            aria-pressed={filter === name}
            onClick={() => setFilter(name)}
          >
            {name} <span className="num">({countFor(name)})</span>
          </button>
        ))}
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <caption className="sr-only">Patients in the ER, most urgent first, then by arrival time</caption>
          <thead>
            <tr>
              <th scope="col">Queue</th>
              <th scope="col">Patient</th>
              <th scope="col">Chief complaint</th>
              <th scope="col">Triage level</th>
              <th scope="col">Status</th>
              <th scope="col">Arrived</th>
              <th scope="col" className="table__right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="table__empty">
                  {filter === 'All' ? 'No patients yet. Select New Intake to add one.' : `No patients with status "${filter}".`}
                </td>
              </tr>
            ) : (
              rows.map((patient) => (
                <tr key={patient.id}>
                  <td className="num">{patient.queueNo}</td>
                  <th scope="row">
                    <span className="patient__name">{patient.name}</span>
                    <span className="patient__meta">
                      {patient.age} · {patient.sex}
                    </span>
                  </th>
                  <td>{patient.complaint}</td>
                  <td>
                    <TriageLevel level={patient.level} />
                  </td>
                  <td>
                    <StatusLine patient={patient} now={now} />
                  </td>
                  <td className="num">{formatTime(patient.arrivedAt)}</td>
                  <td className="table__right">
                    <div className="table__actions">
                      <button type="button" className="btn btn--secondary btn--small" onClick={() => setFormFor(patient)}>
                        Edit<span className="sr-only"> {patient.name}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--small"
                        disabled={deletingId === patient.id}
                        onClick={() => handleDelete(patient)}
                      >
                        {deletingId === patient.id ? 'Deleting…' : 'Delete'}
                        <span className="sr-only"> {patient.name}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formFor && (
        <IntakeForm
          key={editing ? editing.id : 'new'}
          patient={editing}
          onClose={() => setFormFor(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
