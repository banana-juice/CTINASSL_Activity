# CTINASSL_Activity
# BahalaNa
# Joung Yop Kim & Joseph Gabriel Lontoc
# INF245

## Running the app

1. Start MongoDB locally (`mongodb://localhost:27017/INF245MWA`).
2. Server: `cd Server && npm install && npm run dev` (port 8000)
3. Client: `cd Client && npm install && npm run dev` (Vite proxies `/api` to the server)

## Patient CRUD API (`/patients`)

| Method | Route | Does |
| --- | --- | --- |
| GET | `/patients` | List all patients (most urgent first) |
| GET | `/patients/:id` | Get one patient |
| POST | `/patients/create` | Create a patient (`name, age, sex, complaint, level`). Queue no. is generated. |
| PUT | `/patients/update/:id` | Update any of `name, age, sex, complaint, level, status` |
| DELETE | `/patients/:id` | Delete a patient |
