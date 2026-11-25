import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
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
  const { patients } = useOutletContext()
  const now = useNow()
  const [filter, setFilter] = useState('All')

  const sorted = [...patients].sort(byAcuity)
  const rows = filter === 'All' ? sorted : sorted.filter((p) => p.status === filter)
  const countFor = (name) => (name === 'All' ? sorted.length : sorted.filter((p) => p.status === name).length)

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">Patient Intake</h1>
        <Link to="/patient-intake/new" className="btn btn--primary">
          New Intake
        </Link>
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
              <th scope="col" className="table__right">
                Arrived
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="table__empty">
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
                  <td className="table__right num">{formatTime(patient.arrivedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
