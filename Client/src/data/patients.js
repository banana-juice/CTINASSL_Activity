// Shared labels and constants. Patient records now come from the server (see src/api/patients.js).
//
// Each patient is expected to look like:
//   { id, queueNo: 'Q-001', name, age, sex: 'F' | 'M', complaint,
//     arrivedAt: ISO 8601 string, level: 1-5, status: one of STATUSES }

export const FACILITY_NAME = 'Taguig Community Hospital ER'

// Shown in the dashboard header when set. Left empty until a real name exists.
export const TRIAGE_NURSE = ''

export const TRIAGE_LABELS = {
  1: 'Resuscitation',
  2: 'Emergent',
  3: 'Urgent',
  4: 'Less urgent',
  5: 'Non-urgent',
}

export const STATUSES = ['Waiting', 'In assessment', 'Referred']

