import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'
import useNow from '../hooks/useNow.js'
import { LONG_WAIT_MINUTES, byAcuity, formatTime, formatWait, minutesSince } from '../utils/patients.js'

const TABS = ['Waiting', 'In assessment', 'Referred']

const EMPTY = {
  Waiting: 'No one is waiting right now.',
  'In assessment': 'No one is being assessed right now.',
  Referred: 'No patients have been referred.',
}

const byArrival = (a, b) => new Date(a.arrivedAt) - new Date(b.arrivedAt)

export default function Dashboard() {
  const { patients, callPatient } = useOutletContext()
  const now = useNow()
  const [tab, setTab] = useState('Waiting')

  const inTab = (name) => patients.filter((p) => p.status === name)
  const rows = [...inTab(tab)].sort(tab === 'Waiting' ? byAcuity : byArrival)
  const isWaiting = tab === 'Waiting'
  const columns = isWaiting ? 7 : 5

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">Dashboard</h1>
      </header>

      <div className="filter" role="group" aria-label="Show patients who are">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            className="filter__button"
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
          >
            {name} <span className="num">({inTab(name).length})</span>
          </button>
        ))}
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <caption className="sr-only">
            {isWaiting ? 'Patients waiting to be seen, most urgent first' : `Patients: ${tab.toLowerCase()}`}
          </caption>
          <thead>
            <tr>
              <th scope="col">Queue</th>
              <th scope="col">Patient</th>
              <th scope="col">Chief complaint</th>
              <th scope="col">Triage level</th>
              <th scope="col">Arrived</th>
              {isWaiting && <th scope="col">Waiting</th>}
              {isWaiting && (
                <th scope="col" className="table__right">
                  <span className="sr-only">Action</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns} className="table__empty">
                  {EMPTY[tab]}
                </td>
              </tr>
            ) : (
              rows.map((patient, index) => {
                const minutes = minutesSince(patient.arrivedAt, now)
                return (
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
                    <td className="num">{formatTime(patient.arrivedAt)}</td>
                    {isWaiting && (
                      <td className={`num${minutes >= LONG_WAIT_MINUTES ? ' wait--long' : ''}`}>
                        {formatWait(minutes)}
                      </td>
                    )}
                    {isWaiting && (
                      <td className="table__right">
                        <button
                          type="button"
                          className={`btn btn--small ${index === 0 ? 'btn--primary' : 'btn--secondary'}`}
                          onClick={() => callPatient(patient.id)}
                        >
                          Call
                          <span className="sr-only"> {patient.name}</span>
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
