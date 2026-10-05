# WPC AI Post Compliance — Frontend

React + Vite front end for the **Post Compliance Audit** flow: upload company and
employee documents, review the AI-extracted right-to-work checklist, and submit the
audit for verification.

The screens are built from `WPC AI Post .pdf` (Upload → Checklist → Review).

## Getting started

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev
```

Then open http://localhost:5173.

## Configuration

All requests target `${VITE_API_BASE_URL}/<endpoint>`. Set it in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

- **With a URL** — the form POSTs to the backend (see contract below).
- **Empty string** — the UI runs in *local preview mode* and skips network calls, so
  you can click through all steps without a server.

See `.env.example`.

## The flow

| Step | Screen | What it does |
| --- | --- | --- |
| Details | Document Verification | Company name, RTI document, bank statements, plus one block per employee (name, designation, employment type **Case A/B/C** and the documents required for that case). Submits on **Proceed to Checklist**. |
| Checklist | Compliance Checklist | 31 right-to-work parameters, each marked **Available / Missing / N/A**, plus *Overall Observation* and *Recommendation Remarks*. |
| Review | Review Audit Submission | Company + employee summaries and Available / Missing / N/A breakdown. Submits on **Run Verification**. |
| Report | Audit Report | Confirmation with reference, status and counts. |

### Employment cases

- **Case A — Sponsored, New Hire:** Certificate of Sponsorship (COS)\* + CV (optional)
- **Case B — Sponsored, Existing Staff:** Payslips\* + Reference / Exp. letter (optional)
- **Case C — Not Sponsored:** Government document\* + Passport (optional)

## Backend API contract

Both calls send credentials-less JSON/multipart `fetch` requests and treat any non-2xx
response as an error (the message is surfaced in a toast).

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

## Build

```bash
npm run build     # outputs to dist/
npm run preview
```
