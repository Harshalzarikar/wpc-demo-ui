# WPC AI Post Compliance — Frontend

React + Vite UI for the Post Compliance Audit flow: upload company and employee documents,
review the AI-extracted right-to-work checklist, then submit the audit for verification.

Four steps: **Details → Checklist → Review → Report**.

## Requirements

- Node.js 18+ (20 LTS recommended) and npm
- A backend — optional, see [Configuration](#configuration)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

It runs out of the box: it points at `http://localhost:8000/api`, and if no backend is
reachable it continues in preview mode so you can still click through every screen.

## Configuration

Requests go to `${VITE_API_BASE_URL}/<endpoint>`. Edit `.env`:

| Value | Behaviour |
| --- | --- |
| `http://localhost:8000/api` (default) | POSTs to your backend |
| *(empty)* | Preview mode — no network calls |

`.env` is committed with the default. Use `.env.local` for personal overrides.
Restart the dev server after changing `.env`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with hot reload (http://localhost:5173) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

## Screens

- **Details** — company documents (RTI, bank statements) and one block per employee, with
  employment case A/B/C and the documents each case needs.
- **Checklist** — 31 right-to-work parameters marked Available / Missing / N/A, plus notes.
- **Review** — company + employee summaries and the Available / Missing / N/A breakdown.
- **Report** — confirmation with reference, status and counts.

Employment cases:

- **A** Sponsored — New Hire: Certificate of Sponsorship (required), CV (optional)
- **B** Sponsored — Existing Staff: Payslips (required), Reference / Exp. letter (optional)
- **C** Not Sponsored: Government document (required), Passport (optional)

## Project structure

```
src/
  api/client.js   # fetch wrapper + endpoints
  components/     # Sidebar, TopBar, Stepper, FileDropZone, Field, Toast
  data/           # checklist items, employment types
  steps/          # Details, Checklist, Review, Report
  App.jsx         # wizard state, navigation, validation, POST calls
  styles.css      # design system
```

State lives in `App.jsx`; there is no router or state library.

## Backend endpoints

`POST {VITE_API_BASE_URL}/post-compliance` — `multipart/form-data`

Fields: `companyName`, `rtiDocument` (file), `bankStatements` (files), `employees` (JSON),
`employeeFiles[i][key]` (files). Returns `{ "id": "…" }`.

`POST {VITE_API_BASE_URL}/post-compliance/verify` — `application/json`

Body: `{ auditId, company, employees, checklist, overallObservation, recommendationRemarks }`.
Returns `{ "id": "…", "status": "…" }`.

## Troubleshooting

- **`Cannot find module .../vite/bin/vite.js`** — dev dependencies were skipped; run
  `npm install --include=dev`.
- **Port 5173 in use** — `npm run dev -- --port 5174`.
- **Warning toast, step still advances** — backend unreachable, nothing was saved. Start the
  backend or fix the URL in `.env`.
- **Red error toast, step blocked** — the backend returned an error; the toast shows why.
