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
    <div className="intake">
      <div className="intake__inner">
        <div className="intake__head">
          <div>
            <h1 className="intake__title">Records</h1>
            <p className="intake__sub">All patients seen at triage, newest first.</p>
          </div>
          <div className="search">
            <label htmlFor="records-search" className="sr-only">
              Search records
            </label>
            <input
              id="records-search"
              type="search"
              placeholder="Name, queue number or complaint"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="intake__panel">
          <table className="intake-table">
            <caption className="sr-only">All patient records, newest first</caption>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '24%' }} />
              <col style={{ width: '24%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Arrived</th>
                <th scope="col">Queue</th>
                <th scope="col">Patient</th>
                <th scope="col">Chief complaint</th>
                <th scope="col">Triage level</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="intake-table__empty">
                    {term ? 'No records match your search.' : 'No records yet.'}
                  </td>
                </tr>
              ) : (
                rows.map((patient) => (
                  <tr key={patient.id}>
                    <td className="num">{formatTime(patient.arrivedAt)}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
