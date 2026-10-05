# WPC AI Post Compliance — Frontend

React + Vite front end for the **Post Compliance Audit** flow: upload company and employee
documents, review the AI-extracted right-to-work checklist, and submit the audit for
verification.

The UI follows a four-step wizard: **Details → Checklist → Review → Report**.

---

## Prerequisites

- **Node.js 18+** (20 LTS recommended) and **npm 9+**
  - Check with `node -v` and `npm -v`
- A running backend that implements the [API contract](#backend-api-contract) — **optional**,
  see [Running without a backend](#running-without-a-backend).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env          # macOS / Linux
copy .env.example .env        # Windows (cmd / PowerShell)

# 3. Edit .env and point it at your backend
#    VITE_API_BASE_URL=http://localhost:8000/api

# 4. Start the dev server (opens http://localhost:5173 automatically)
npm run dev
```

That's it. The dev server hot-reloads on save.

> **No backend yet?** You can still click through the whole UI — see
> [Running without a backend](#running-without-a-backend).

### Running without a backend

Set the API base URL to an **empty** value in `.env` so the app skips network calls and runs
in local preview mode:

```
VITE_API_BASE_URL=
```

Now every step works offline (submits advance without calling the server, and the Report
screen shows a local reference id). Handy for design review and demos.

---

## Configuration

All requests go to `${VITE_API_BASE_URL}/<endpoint>`. Set the value in `.env` at the project
root (see `.env.example`):

| `VITE_API_BASE_URL` | Behaviour |
| --- | --- |
| `http://localhost:8000/api` (default) | POSTs to your backend |
| *(empty)* | Local preview mode — no network calls |

`.env` is git-ignored; `.env.example` is the committed template.

---

## Screens & flow

| Step | Screen | What it does |
| --- | --- | --- |
| Details | Document Verification | Company name, RTI document, bank statements, plus one block per employee (name, designation, employment type **Case A/B/C** and the documents required for that case). Submits on **Proceed to Checklist**. |
| Checklist | Compliance Checklist | 31 right-to-work parameters, each marked **Available / Missing / N/A**, plus *Overall Observation* and *Recommendation Remarks*. |
| Review | Review Audit Submission | Company + employee summaries and an Available / Missing / N/A breakdown. Submits on **Run Verification**. |
| Report | Audit Report | Confirmation with reference, status and counts. |

### Employment cases

| Case | Type | Required | Optional |
| --- | --- | --- | --- |
| **A** | Sponsored — New Hire | Certificate of Sponsorship (COS) | CV |
| **B** | Sponsored — Existing Staff | Payslips | Reference / Exp. letter |
| **C** | Not Sponsored | Government document | Passport |

Required documents must be attached before **Proceed to Checklist** will advance.

---

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:5173 (hot reload) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally to check the production bundle |

---

## Project structure

```
src/
  api/client.js          # fetch wrapper + endpoints
  components/            # Sidebar, TopBar, Stepper, FileDropZone, Field, Toast
  data/                  # checklist items, employment types
  steps/                 # DetailsStep, ChecklistStep, ReviewStep, ReportStep
  App.jsx                # wizard state, navigation, validation, POST calls
  styles.css             # design system
```

State lives entirely in `App.jsx`; each step is a presentational component that receives
props and callbacks. There is no state library and no router — add one if the app grows
beyond this single flow.

---

## Backend API contract

Both calls send credentialed-less `fetch` requests and treat any non-2xx response as an
error (the message is shown in a toast).

### 1. Submit documents — *Proceed to Checklist*

`POST {VITE_API_BASE_URL}/post-compliance` — `multipart/form-data`

| Field | Type | Notes |
| --- | --- | --- |
| `companyName` | text | |
| `rtiDocument` | file | single |
| `bankStatements` | file[] | one field per file |
| `employees` | text (JSON) | `[{ id, fullName, designation, employmentType }]` |
| `employeeFiles[i][key]` | file[] | files for employee `i`, document `key` |

Expected response: `{ "id": "<auditId>" }` (optional — falls back to a local id).

### 2. Submit verification — *Run Verification*

`POST {VITE_API_BASE_URL}/post-compliance/verify` — `application/json`

```json
{
  "auditId": "…",
  "company": { "name": "…", "rtiDocument": "file.pdf", "bankStatements": ["a.pdf"] },
  "employees": [{ "id": "…", "fullName": "…", "designation": "…", "employmentType": "A", "documents": [{ "key": "cos", "files": ["cos.pdf"] }] }],
  "checklist": { "passport": "na", "brp": "available", "cos": "missing" },
  "overallObservation": "…",
  "recommendationRemarks": "…"
}
```

Expected response: `{ "id": "…", "status": "verified" }` (optional).

---

## Troubleshooting

**`Cannot find module .../vite/bin/vite.js` after `npm install`**
Your shell has `NODE_ENV=production` (or npm is set to omit dev dependencies), so Vite was
skipped. Install including dev dependencies:

```bash
npm install --include=dev
```

**Port 5173 already in use**
Stop the other process, or run on another port: `npm run dev -- --port 5174`.

**Submitting shows a red toast and the step doesn't advance**
The app couldn't reach the backend. Check that `VITE_API_BASE_URL` in `.env` points at a
running server (the toast includes the URL it tried), or set it empty to use local preview
mode. Restart `npm run dev` after changing `.env` — env changes are not hot-reloaded.

**Blank page**
Open the browser console — a runtime error will be logged there. Also make sure
`npm install` completed and `node_modules` exists.
