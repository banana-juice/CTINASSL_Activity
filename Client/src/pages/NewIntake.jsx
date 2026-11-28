import { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import TriageLevel from '../components/TriageLevel.jsx'
import { STATUSES } from '../data/patients.js'

const LEVELS = [1, 2, 3, 4, 5]
const EMPTY = { name: '', age: '', sex: '', complaint: '', level: '', status: 'Waiting' }

// Used for both "New Intake" (/patient-intake/new) and "Edit" (/patient-intake/:id/edit)
export default function NewIntake() {
  const { patients, addPatient, editPatient } = useOutletContext()
  const { id } = useParams()
  const navigate = useNavigate()

  const existing = id ? patients.find((p) => p.id === id) : null
  const isEdit = Boolean(id)

  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name,
          age: String(existing.age),
          sex: existing.sex,
          complaint: existing.complaint,
          level: String(existing.level),
          status: existing.status,
        }
      : EMPTY,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = {
      name: form.name.trim(),
      age: Number(form.age),
      sex: form.sex,
      complaint: form.complaint.trim(),
      level: Number(form.level),
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await editPatient(id, { ...data, status: form.status })
        navigate('/records')
      } else {
        await addPatient(data)
        navigate('/patient-intake')
      }
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="page">
        <header className="page-head">
          <h1 className="page-head__title">Patient not found</h1>
        </header>
        <Link to="/records" className="text-link">
          Back to records
        </Link>
      </div>
    )
  }

  const backTo = isEdit ? '/records' : '/patient-intake'

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-head__title">{isEdit ? `Edit ${existing.queueNo}` : 'New Intake'}</h1>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}

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

        {isEdit && (
          <div className="field">
            <label htmlFor="intake-status">Status</label>
            <select id="intake-status" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form__actions">
          <Link to={backTo} className="btn btn--secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add to queue'}
          </button>
        </div>
      </form>
    </div>
  )
}
