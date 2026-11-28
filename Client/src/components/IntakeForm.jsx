import { useEffect, useRef, useState } from 'react'
import TriageLevel from './TriageLevel.jsx'
import { STATUSES } from '../data/patients.js'

const LEVELS = [1, 2, 3, 4, 5]
const EMPTY = { name: '', age: '', sex: '', complaint: '', level: '', status: 'Waiting' }

const toForm = (patient) =>
  patient
    ? {
        name: patient.name,
        age: String(patient.age),
        sex: patient.sex,
        complaint: patient.complaint,
        level: String(patient.level),
        status: patient.status,
      }
    : EMPTY

// Pop-up form for adding a patient, or editing one when `patient` is passed.
// Render it only while open (with a key), so every open starts with fresh fields.
// onSubmit should return a promise; errors from the server are shown in the form.
export default function IntakeForm({ patient, onClose, onSubmit }) {
  const dialogRef = useRef(null)
  const [form, setForm] = useState(() => toForm(patient))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(patient)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => dialog?.open && dialog.close()
  }, [])

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
    if (isEdit) data.status = form.status
    setSaving(true)
    setError('')
    try {
      await onSubmit(data)
      onClose()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="intake-form-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <form className="form form--dialog" onSubmit={handleSubmit}>
        <h2 id="intake-form-title" className="form__title">
          {isEdit ? `Edit ${patient.queueNo}` : 'New intake'}
        </h2>

        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}

        <div className="field">
          <label htmlFor="dlg-name">Full name</label>
          <input id="dlg-name" type="text" required autoComplete="off" value={form.name} onChange={set('name')} />
        </div>

        <div className="form__row">
          <div className="field">
            <label htmlFor="dlg-age">Age</label>
            <input
              id="dlg-age"
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
            <label htmlFor="dlg-sex">Sex</label>
            <select id="dlg-sex" required value={form.sex} onChange={set('sex')}>
              <option value="" disabled>
                Select
              </option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="dlg-complaint">Chief complaint</label>
          <input
            id="dlg-complaint"
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
                name="dlg-level"
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
            <label htmlFor="dlg-status">Status</label>
            <select id="dlg-status" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form__actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add to queue'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
