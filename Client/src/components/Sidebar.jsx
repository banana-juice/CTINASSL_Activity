import { NavLink } from 'react-router-dom'
import { TRIAGE_NURSE } from '../data/patients.js'
import useNow from '../hooks/useNow.js'
import { currentShift, formatTime } from '../utils/patients.js'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Patient Intake', to: '/patient-intake' },
  { label: 'Records', to: '/records' },
]

export default function Sidebar() {
  const now = useNow()
  const date = now.toLocaleDateString('en-PH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="sidebar">
      <p className="sidebar__name">TriageHIS</p>
      <nav aria-label="Main">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar__now">
        <p className="sidebar__time num" aria-label="Current time">
          {formatTime(now)}
        </p>
        <p className="sidebar__detail">{date}</p>
        <p className="sidebar__detail">{currentShift(now)}</p>
        {TRIAGE_NURSE && <p className="sidebar__detail">Triage nurse: {TRIAGE_NURSE}</p>}
      </div>
    </div>
  )
}
