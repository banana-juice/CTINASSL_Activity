import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'
import { formatTime } from '../utils/patients.js'

export default function Records() {
  const { patients } = useOutletContext()
  const [query, setQuery] = useState('')

  const term = query.trim().toLowerCase()
  const rows = [...patients]
    .sort((a, b) => new Date(b.arrivedAt) - new Date(a.arrivedAt))
    .filter(
      (p) =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.queueNo.toLowerCase().includes(term) ||
        p.complaint.toLowerCase().includes(term),
    )

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">Records</h1>
        <div className="search">
          <label htmlFor="records-search">Search</label>
          <input
            id="records-search"
            type="search"
            placeholder="Name, queue no. or complaint"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>

      <div className="panel table-wrap">
        <table className="table">
          <caption className="sr-only">All patient records, newest first</caption>
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
                  {term ? 'No records match your search.' : 'No records yet.'}
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
                  <td className={patient.status === 'In assessment' ? 'status--active' : undefined}>
                    {patient.status}
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
