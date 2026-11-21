import { useEffect, useRef, useState } from 'react'
import TriageLevel from './TriageLevel.jsx'

const LEVELS = [1, 2, 3, 4, 5]
const EMPTY = { name: '', age: '', sex: '', complaint: '', level: '' }

export default function IntakeForm({ open, onClose, onSubmit }) {
  const dialogRef = useRef(null)
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  const reset = () => {
    setForm(EMPTY)
    onClose()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      name: form.name.trim(),
      age: Number(form.age),
      sex: form.sex,
      complaint: form.complaint.trim(),
      level: Number(form.level),
    })
    reset()
  }

  return (
    <dialog ref={dialogRef} className="dialog" aria-labelledby="intake-form-title" onCancel={reset}>
      <form className="form" onSubmit={handleSubmit}>
        <h2 id="intake-form-title" className="form__title">
          New intake
        </h2>

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
          <button type="button" className="btn btn--secondary" onClick={reset}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Add to queue
          </button>
        </div>
      </form>
    </dialog>
  )
}
