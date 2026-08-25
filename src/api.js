const API_BASE = import.meta.env.VITE_API_URL || ''

async function fetchJSON(path) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed ${path}: ${res.status}`)
  return res.json()
}

export const api = {
  getSkills: () => fetchJSON('/api/skills/').then(d => d.results ?? d),
  getProjects: () => fetchJSON('/api/projects/').then(d => d.results ?? d),
  getProfile: () => fetchJSON('/api/profile/'),
  sendContact: (payload) =>
    fetch(`${API_BASE}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        throw new Error(JSON.stringify(err) || r.statusText)
      }
      return r.json()
    }),
  health: () => fetchJSON('/api/health/'),
}
