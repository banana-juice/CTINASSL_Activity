import { useOutletContext } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'
import useNow from '../hooks/useNow.js'
import { LONG_WAIT_MINUTES, byAcuity, formatTime, formatWait, minutesSince } from '../utils/patients.js'

export default function Queue() {
  const { patients, callPatient } = useOutletContext()
  const now = useNow()
  const waiting = patients.filter((p) => p.status === 'Waiting').sort(byAcuity)

  return (
    <div className="intake">
      <div className="intake__inner">
        <div className="intake__head">
          <div>
            <h1 className="intake__title">Queue</h1>
            <p className="intake__sub">{waiting.length} waiting. Next to call is at the top.</p>
          </div>
        </div>

        <div className="intake__panel">
          <table className="intake-table">
            <caption className="sr-only">Patients waiting to be seen, in calling order</caption>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '24%' }} />
              <col style={{ width: '24%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Queue</th>
                <th scope="col">Patient</th>
                <th scope="col">Chief complaint</th>
                <th scope="col">Triage level</th>
                <th scope="col">Waiting</th>
                <th scope="col" className="intake-table__right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {waiting.length === 0 ? (
                <tr>
                  <td colSpan={6} className="intake-table__empty">
                    No patients waiting.
                  </td>
                </tr>
              ) : (
                waiting.map((patient) => {
                  const minutes = minutesSince(patient.arrivedAt, now)
                  return (
                    <tr key={patient.id}>
                      <td className="num">{patient.queueNo}</td>
                      <th scope="row">
                        <span className="patient__name">{patient.name}</span>
                        <span className="patient__meta">
                          {patient.age} · {patient.sex} · arrived {formatTime(patient.arrivedAt)}
                        </span>
                      </th>
                      <td>{patient.complaint}</td>
                      <td>
                        <TriageLevel level={patient.level} />
                      </td>
                      <td className={`num${minutes >= LONG_WAIT_MINUTES ? ' wait--long' : ''}`}>
                        {formatWait(minutes)}
                      </td>
                      <td className="intake-table__right">
                        <button
                          type="button"
                          className="btn btn--primary btn--small"
                          onClick={() => callPatient(patient.id)}
                        >
                          Call
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
