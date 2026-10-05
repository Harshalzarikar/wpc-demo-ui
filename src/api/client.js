const RAW_BASE = import.meta.env.VITE_API_BASE_URL
const API_BASE = (RAW_BASE ?? 'http://localhost:8000/api').trim().replace(/\/+$/, '')

/** When false the UI runs in local preview mode and skips network calls. */
export const apiConfigured = API_BASE.length > 0

export function apiBaseUrl() {
  return API_BASE
}

async function request(path, { method = 'POST', body } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body ?? {}),
    })
  } catch (cause) {
    // fetch only rejects on network-level failures (server down, DNS, CORS),
    // never on HTTP error statuses — so this means "backend unreachable".
    const error = new Error(`Could not reach ${API_BASE}${path}`)
    error.isNetworkError = true
    error.cause = cause
    throw error
  }

  const raw = await response.text()
  let data = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = { raw }
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) ||
      `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

/** POST company + employee documents (multipart) for AI extraction. */
export function submitDetails(formData) {
  return request('/post-compliance', { method: 'POST', body: formData })
}

/** POST the completed checklist for final verification. */
export function submitVerification(payload) {
  return request('/post-compliance/verify', { method: 'POST', body: payload })
}
