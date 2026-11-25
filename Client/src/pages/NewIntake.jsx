import { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'

const LEVELS = [1, 2, 3, 4, 5]

export default function NewIntake() {
  const { addPatient } = useOutletContext()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', age: '', sex: '', complaint: '', level: '' })

  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    addPatient({
      name: form.name.trim(),
      age: Number(form.age),
      sex: form.sex,
      complaint: form.complaint.trim(),
      level: Number(form.level),
    })
    navigate('/patient-intake')
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">New Intake</h1>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="intake-name">Full name</label>
          <input id="intake-name" type="text" required autoComplete="off" value={form.name} onChange={set('name')} />
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="intake-age">Age</label>
            <input
              id="intake-age"
              type="number"
              inputMode="numeric"
              min="0"
              max="120"
              required
              value={form.age}
              onChange={set('age')}
            />
          </div>
          <div className="field">
            <label htmlFor="intake-sex">Sex</label>
            <select id="intake-sex" required value={form.sex} onChange={set('sex')}>
              <option value="" disabled>
                Select
              </option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="intake-complaint">Chief complaint</label>
          <input
            id="intake-complaint"
            type="text"
            required
            autoComplete="off"
            value={form.complaint}
            onChange={set('complaint')}
          />
        </div>

        <fieldset className="field levels">
          <legend>Triage level</legend>
          {LEVELS.map((level) => (
            <label key={level} className="levels__option">
              <input
                type="radio"
                name="level"
                value={level}
                required
                checked={form.level === String(level)}
                onChange={set('level')}
              />
              <TriageLevel level={level} />
            </label>
          ))}
        </fieldset>

        <div className="form__actions">
          <Link to="/patient-intake" className="btn btn--secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn--primary">
            Add to queue
          </button>
        </div>
      </form>
    </div>
  )
}
