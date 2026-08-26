const API_BASE = import.meta.env.VITE_API_URL || ''

async function fetchJSON(path, { timeout = 8000 } = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const url = `${API_BASE}${path}`
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`)
    return res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`Timeout ${path}`)
    throw err
  } finally {
    clearTimeout(id)
  }
}

export const api = {
  getSkills: () => fetchJSON('/api/skills/').then(d => d.results ?? d),
  getProjects: () => fetchJSON('/api/projects/').then(d => d.results ?? d),
  getProfile: () => fetchJSON('/api/profile/'),
  sendContact: (payload) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 8000)
    return fetch(`${API_BASE}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (r) => {
        clearTimeout(id)
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          const msg = err.detail || err.message || JSON.stringify(err) || r.statusText
          throw new Error(msg)
        }
        return r.json()
      })
      .catch((err) => {
        clearTimeout(id)
        if (err.name === 'AbortError') throw new Error('Request timed out')
        throw err
      })
  },
  health: () => fetchJSON('/api/health/'),
}
