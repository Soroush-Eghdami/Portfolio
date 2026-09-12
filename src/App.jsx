import { useState, useEffect } from 'react'
import { api } from './api'

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'My Toolkit' },
]

const GITHUB = 'https://github.com/Soroush-Eghdami'
const AVATAR = 'https://avatars.githubusercontent.com/u/204998566?v=4'

const FALLBACK_SKILLS = [
  { id: 1, name: 'Python', level: 'Advanced', icon: '🐍' },
  { id: 2, name: 'Django / DRF', level: 'Advanced', icon: '🌐' },
  { id: 3, name: 'REST APIs', level: 'Advanced', icon: '🔗' },
  { id: 4, name: 'Docker', level: 'Intermediate', icon: '🐳' },
  { id: 5, name: 'PostgreSQL', level: 'Intermediate', icon: '🐘' },
  { id: 6, name: 'MongoDB', level: 'Intermediate', icon: '🍃' },
  { id: 7, name: 'Redis', level: 'Beginner', icon: '⚡' },
  { id: 8, name: 'C++', level: 'Intermediate', icon: '➕' },
]

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'R.A.G',
    repo: 'R.A.G',
    emoji: '🧠',
    description: 'Local, private RAG app for law students — upload case files, ask questions and get answers with cited sources. CLI + web UI.',
    tags: ['Python', 'RAG', 'AI'],
    stack: 'Python, RAG, Transformers',
    created_at: '2025-10-23T11:00:06Z',
    pushed_at: '2025-12-24T10:32:59Z',
    gradient: 'from-violet-600 to-indigo-600',
    code_url: `${GITHUB}/R.A.G`,
  },
  {
    id: 2,
    title: 'Tweeter_Demo',
    repo: 'Tweeter_Demo',
    emoji: '🐦',
    description: 'Full-stack Twitter clone with Docker support and real-time features.',
    tags: ['TypeScript', 'Docker', 'Real-time'],
    stack: 'TypeScript, Docker, Real-time',
    created_at: '2026-04-19T04:21:40Z',
    pushed_at: '2026-09-11T17:15:55Z',
    gradient: 'from-fuchsia-600 to-pink-600',
    code_url: `${GITHUB}/Tweeter_Demo`,
  },
  {
    id: 3,
    title: 'CakeShop',
    repo: 'CakeShop',
    emoji: '🍰',
    description: 'Online cake store — product listings, shopping cart and order flow for handcrafted cakes, built with React and Tailwind CSS.',
    tags: ['React', 'Tailwind', 'E-commerce'],
    stack: 'React, Tailwind, E-commerce',
    created_at: '2026-08-04T15:52:52Z',
    pushed_at: '2026-08-17T11:51:21Z',
    gradient: 'from-orange-500 to-red-600',
    code_url: `${GITHUB}/CakeShop`,
  },
  {
    id: 4,
    title: 'Online-shop-CBV',
    repo: 'Online-shop-CBV',
    emoji: '🛒',
    description: 'Full-featured Django e-commerce demo with clean CBV architecture, ready to deploy.',
    tags: ['Django', 'CBV', 'E-commerce'],
    stack: 'Django, CBV, PostgreSQL',
    created_at: '2025-09-28T19:46:19Z',
    pushed_at: '2025-09-28T19:57:00Z',
    gradient: 'from-teal-500 to-emerald-600',
    code_url: `${GITHUB}/Online-shop-CBV`,
  },
  {
    id: 5,
    title: 'Summerizer',
    repo: 'Summerizer',
    emoji: '📝',
    description: 'Flask web app that summarizes text, PDF documents and audio files using transformer models and the Groq API.',
    tags: ['Flask', 'Transformers', 'Groq'],
    stack: 'Flask, Transformers, Groq API',
    created_at: '2025-10-15T17:43:27Z',
    pushed_at: '2026-06-01T16:15:14Z',
    gradient: 'from-amber-500 to-orange-600',
    code_url: `${GITHUB}/Summerizer`,
  },
]

function repoFromUrl(url) {
  if (!url) return ''
  const m = String(url).match(/github\.com\/[^/]+\/([^/?#]+)/i)
  return m ? decodeURIComponent(m[1].replace(/\.git$/, '')) : ''
}

function formatMonthYear(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function resolveMediaUrl(cover) {
  if (!cover) return ''
  if (/^https?:\/\//i.test(cover) || cover.startsWith('data:')) return cover
  return `${API_BASE}${cover.startsWith('/') ? cover : `/${cover}`}`
}

function levelWidth(level) {
  const l = String(level || '').toLowerCase()
  if (l.startsWith('begin')) return '20%'
  if (l.startsWith('adv')) return '88%'
  return '58%'
}

const SERVICES = [
  {
    n: '01',
    title: 'Backend APIs',
    text: 'I take ideas from zero to one — shaping schemas, writing clean Django / DRF code, and shipping documented REST APIs. I sweat the latency as much as the feature, so every release moves a number that matters.',
  },
  {
    n: '02',
    title: 'Docker & Deployment',
    text: 'Deployments are my unfair advantage as a backend dev. I containerize everything myself, so apps go from laptop to server in days, not sprints — with compose files and envs that just work.',
  },
  {
    n: '03',
    title: 'AI / RAG Systems',
    text: 'I speak AI fluently because I build with it. I wire transformers, embeddings and RAG pipelines into real products — which means honest trade-offs and demos that are real working software.',
  },
  {
    n: '04',
    title: 'Data & Integrations',
    text: 'I am an AI-native builder. With PostgreSQL, Redis and MongoDB I compress weeks of iteration into days — modelling data, caching hot paths, and shipping experiments fast with evidence, not opinions.',
  },
]

const TOOLKIT = [
  { group: 'Backend & APIs', items: ['Python', 'Django', 'DRF', 'Flask', 'REST APIs', 'JWT Auth', 'CBV', 'C++'] },
  { group: 'Databases & Caching', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'SQL', 'Indexing'] },
  { group: 'DevOps & Infra', items: ['Docker', 'Compose', 'Nginx', 'Gunicorn', 'Linux', 'Git & CI'] },
  { group: 'AI & Pipelines', items: ['RAG', 'Embeddings', 'Transformers', 'Groq API', 'PDF Parsing', 'Prompt Engineering'] },
]

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState('')
  const [skills, setSkills] = useState(FALLBACK_SKILLS)
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [profile, setProfile] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const [sending, setSending] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [githubDates, setGithubDates] = useState({})
  const [githubProfile, setGithubProfile] = useState(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll-reveal entrance for elements with .reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('reveal-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const el = en.target
          io.unobserve(el)
          el.classList.add('reveal-visible')
          // Clean up after the entrance finishes: clears stagger delays and
          // removes transform rules so hover lifts work without lag or conflict
          const delay = parseFloat(el.style.transitionDelay) || 0
          setTimeout(() => {
            el.classList.remove('reveal', 'reveal-visible')
            el.style.transitionDelay = ''
          }, delay + 900)
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [projects.length, skills.length])

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([api.getSkills(), api.getProjects(), api.getProfile(), api.health()])
      .then(([s, p, pr, h]) => {
        if (cancelled) return
        if (s.status === 'fulfilled' && Array.isArray(s.value) && s.value.length) setSkills(s.value)
        if (p.status === 'fulfilled' && Array.isArray(p.value) && p.value.length) {
          setProjects(p.value.map((x, i) => {
            const fb = FALLBACK_PROJECTS[i % FALLBACK_PROJECTS.length]
            return {
              ...fb,
              ...x,
              repo: x.repo || repoFromUrl(x.code_url) || fb.repo,
              emoji: x.emoji || fb.emoji,
              cover: x.cover || fb.cover || '',
              stack: x.stack || fb.stack,
              gradient: x.gradient || fb.gradient,
              created_at: x.created_at || fb.created_at,
              pushed_at: x.pushed_at || fb.pushed_at,
              description: x.description,
              code_url: x.code_url,
            }
          }))
        }
        if (pr.status === 'fulfilled' && pr.value?.name) setProfile(pr.value)
        setApiStatus(h.status === 'fulfilled' ? 'online' : 'offline')
      })
      .catch(() => !cancelled && setApiStatus('offline'))
    return () => { cancelled = true }
  }, [])

  // Sync project dates live from GitHub so cards always match the repo
  useEffect(() => {
    let cancelled = false
    const repos = [...new Set(projects.map((p) => p.repo || repoFromUrl(p.code_url)).filter(Boolean))]
    if (!repos.length) return
    Promise.allSettled(
      repos.map((repo) =>
        fetch(`https://api.github.com/repos/Soroush-Eghdami/${encodeURIComponent(repo)}`, {
          headers: { Accept: 'application/vnd.github+json' },
        }).then((r) => {
          if (!r.ok) throw new Error(`GitHub ${r.status}`)
          return r.json()
        })
      )
    ).then((results) => {
      if (cancelled) return
      const next = {}
      results.forEach((res, i) => {
        if (res.status === 'fulfilled' && res.value?.created_at) {
          next[repos[i]] = { created_at: res.value.created_at, pushed_at: res.value.pushed_at }
        }
      })
      if (Object.keys(next).length) setGithubDates(next)
    })
    return () => { cancelled = true }
  }, [projects.length])

  // Live social info from the GitHub profile (bio, X handle, blog, location)
  useEffect(() => {
    let cancelled = false
    fetch('https://api.github.com/users/Soroush-Eghdami', {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`)
        return r.json()
      })
      .then((d) => { if (!cancelled) setGithubProfile(d) })
      .catch(() => { /* offline — fallbacks below cover it */ })
    return () => { cancelled = true }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const validate = (payload) => {
    const errs = {}
    const name = (payload.name || '').trim()
    const email = (payload.email || '').trim()
    const message = (payload.message || '').trim()
    const subject = (payload.subject || '').trim()
    const website = (payload.website || '').trim()
    if (website) errs.website = 'Spam detected.'
    if (name.length < 2) errs.name = 'Name must be at least 2 characters.'
    else if (name.length > 100) errs.name = 'Name must be at most 100 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.'
    if (subject && subject.length > 200) errs.subject = 'Subject must be at most 200 characters.'
    if (message.length < 10) errs.message = 'Message must be at least 10 characters.'
    else if (message.length > 5000) errs.message = 'Message must be at most 5000 characters.'
    else if ((message.match(/https?:\/\//g) || []).length > 3) errs.message = 'Too many links.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      subject: fd.get('subject') || '',
      message: fd.get('message'),
      website: fd.get('website') || '',
    }
    const errs = validate(payload)
    if (Object.keys(errs).length) {
      setFormErrors(errs)
      showToast(Object.values(errs)[0])
      return
    }
    setFormErrors({})
    const { website: _hp, ...cleanPayload } = payload
    setSending(true)
    try {
      await api.sendContact(cleanPayload)
      showToast('Message sent! I will reply soon ✨')
      e.target.reset()
    } catch (err) {
      if (apiStatus === 'offline') {
        showToast('Backend offline — message saved locally ✉️ (will sync when online)')
        e.target.reset()
      } else {
        showToast('Failed to send: ' + (err.message?.slice(0, 80) || 'try again'))
      }
    } finally {
      setSending(false)
    }
  }

  const displayName = profile?.name || 'Soroush Eghdami'
  const shortName = 'soroush'
  const displayRole = profile?.role || 'Python Backend Developer'
  const displayEmail = profile?.email || 'Soroush.egh@gmail.com'
  const displayTelegram = '@inairplanemode'
  // Socials: backend profile first, then live GitHub profile, then defaults
  const xHandle = githubProfile?.twitter_username ? `@${githubProfile.twitter_username}` : null
  const xUrl = profile?.twitter || (githubProfile?.twitter_username ? `https://x.com/${githubProfile.twitter_username}` : 'https://x.com/Tha_Dead_Sheep')
  const blogUrl = githubProfile?.blog ? (/^https?:\/\//i.test(githubProfile.blog) ? githubProfile.blog : `https://${githubProfile.blog}`) : ''
  const blogHost = blogUrl ? blogUrl.replace(/^https?:\/\//i, '').split('/')[0] : ''
  const cvUrl = profile?.cv ? resolveMediaUrl(profile.cv) : ''

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0E100F] dark:bg-[#0E100F] dark:text-[#FFFCE1] transition-colors duration-300 selection:bg-[#8B7CFF]/40">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#0E100F] focus:text-[#FFFCE1] dark:focus:bg-[#FFFCE1] dark:focus:text-[#0E100F]">
        Skip to content
      </a>

      {/* scroll progress — like reference gradient bar */}
      <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-[#8B7CFF] via-[#5EEAD4] to-[#FACC15]" style={{ transform: `scaleX(${progress})` }} />

      {/* NAVBAR — reference style */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'py-3' : 'py-5'}`}>
        <nav aria-label="Primary" className={`mx-auto max-w-6xl px-4 flex items-center justify-between gap-4 transition-colors duration-300 ${scrolled ? 'bg-[#FFFCE1]/85 dark:bg-[#0E100F]/85 backdrop-blur-xl border border-[#0E100F]/10 dark:border-white/10 rounded-full px-6 py-3 shadow-xl' : 'bg-transparent border border-transparent'}`}>
          <a href="#home" className="group font-display font-extrabold text-lg tracking-tight">
            {shortName}
            <span className="text-[#8B7CFF] inline-block transition-transform duration-300 group-hover:scale-125">.</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="nav-link opacity-70 hover:opacity-100 transition">
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className={`hidden lg:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${apiStatus === 'online' ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-300' : apiStatus === 'offline' ? 'border-amber-500/30 text-amber-600 dark:text-amber-300' : 'border-[#0E100F]/10 dark:border-white/10 opacity-60'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {apiStatus === 'online' ? 'API online' : apiStatus === 'offline' ? 'API offline' : 'checking...'}
            </span>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 grid place-items-center rounded-full border border-[#0E100F]/15 dark:border-white/15 hover:opacity-70 transition"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" className="px-5 py-2 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm font-bold hover:opacity-85 transition">Contact Me</a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="w-9 h-9 grid place-items-center rounded-full border border-[#0E100F]/15 dark:border-white/15">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="w-9 h-9 grid place-items-center rounded-full border border-[#0E100F]/15 dark:border-white/15"
            >
              <span aria-hidden="true" className="text-lg">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation" className="md:hidden mx-4 mt-3 bg-[#FFFCE1] dark:bg-[#1A1C1A] border border-[#0E100F]/10 dark:border-white/10 rounded-2xl p-2 flex flex-col shadow-xl">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm hover:opacity-70 transition">{n.label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] font-bold">Contact Me</a>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* HERO — reference: Hello! + huge headline + image */}
        <section id="home" className="pt-32 pb-10 px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
                Hello! I&apos;m {displayName} <span aria-hidden="true">👋</span>
              </h1>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-4 py-1.5 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-sm font-semibold">{displayRole}</span>
                <span className="px-4 py-1.5 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm font-semibold">AI Builder</span>
              </div>

              <h2 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02] tracking-tight mt-6 text-balance">
                I&apos;m a Backend Developer with technical &amp; AI expertise — a zero-to-one builder who takes ideas from whiteboard to shipped product.
              </h2>
              <p className="opacity-70 text-base md:text-lg leading-relaxed mt-5 max-w-xl">
                {profile?.bio || 'Most backends just work. Mine don\'t break. I research the problem, design the schema in Django, containerize with Docker, and ship with the team — iterating faster than the roadmap says is possible.'}
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#projects" className="group px-7 py-3.5 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] font-bold text-sm inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]">
                  View Projects <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
                <a href="#contact" className="group px-7 py-3.5 rounded-full border border-[#0E100F]/20 dark:border-white/20 font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#8B7CFF]/60 active:scale-[0.98]">
                  Say Hello ! <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                {cvUrl ? (
                  <a href={cvUrl} download className="group px-7 py-3.5 rounded-full border border-[#0E100F]/20 dark:border-white/20 font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#8B7CFF]/60 active:scale-[0.98]">
                    Download CV <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                  </a>
                ) : (
                  <button type="button" onClick={() => showToast('CV coming soon 📄')} className="group px-7 py-3.5 rounded-full border border-[#0E100F]/20 dark:border-white/20 font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#8B7CFF]/60 active:scale-[0.98] opacity-70">
                    Download CV <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#0E100F]/10 dark:border-white/10">
                <div className="flex -space-x-2">
                  <img src={AVATAR} alt={displayName} className="w-9 h-9 rounded-full border-2 border-[#FFFCE1] dark:border-[#0E100F] object-cover" />
                  <span className="w-9 h-9 rounded-full bg-[#8B7CFF] border-2 border-[#FFFCE1] dark:border-[#0E100F] grid place-items-center text-xs font-bold text-white">111</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Growing on GitHub</p>
                  <a href={GITHUB} target="_blank" rel="noreferrer" className="text-xs opacity-60 hover:opacity-100 transition">github.com/Soroush-Eghdami ↗</a>
                </div>
                <div className="hidden sm:flex ml-auto gap-8">
                  <div><p className="font-display font-extrabold text-2xl">19+</p><p className="text-xs uppercase tracking-widest opacity-60">Repos</p></div>
                  <div><p className="font-display font-extrabold text-2xl">10+</p><p className="text-xs uppercase tracking-widest opacity-60">Tools</p></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="group rounded-[28px] overflow-hidden border border-[#0E100F]/10 dark:border-white/10 bg-[#0E100F] dark:bg-[#1A1C1A] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="overflow-hidden">
                  <img src={AVATAR} alt={`${displayName} — ${displayRole}`} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-[#FFFCE1]">{displayName}</p>
                    <p className="text-xs text-[#FFFCE1]/60">{displayRole} · AI / Django / Docker</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={profile?.github || GITHUB} target="_blank" rel="noreferrer" title="GitHub" className="w-8 h-8 rounded-full bg-[#FFFCE1] text-[#0E100F] grid place-items-center text-xs font-bold transition-transform duration-300 hover:scale-110">G</a>
                    <a href={xUrl} target="_blank" rel="noreferrer" title="X" className="w-8 h-8 rounded-full border border-white/20 grid place-items-center text-xs text-[#FFFCE1] transition-all duration-300 hover:scale-110 hover:bg-white/10">𝕏</a>
                    <a href="https://t.me/inairplanemode" target="_blank" rel="noreferrer" title="Telegram" className="w-8 h-8 rounded-full border border-white/20 grid place-items-center text-xs text-[#FFFCE1] transition-all duration-300 hover:scale-110 hover:bg-white/10">✈</a>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-[28px] border border-[#0E100F]/10 dark:border-white/10 p-5">
                <p className="text-xs tracking-[0.2em] font-bold opacity-60">TECH STACK</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Python', 'Django', 'DRF', 'Docker', 'PostgreSQL', 'Redis'].map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-xs font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0E100F] hover:text-[#FFFCE1] dark:hover:bg-[#FFFCE1] dark:hover:text-[#0E100F] cursor-default">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES — "I can help you with." */}
        <section className="px-4 max-w-6xl mx-auto mt-14">
          <h2 className="reveal font-display font-extrabold text-3xl md:text-5xl tracking-tight">I can help you with.</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mt-8">
            {SERVICES.map((s, i) => (
              <div key={s.n} style={{ transitionDelay: `${i * 100}ms` }} className="reveal group border-t border-[#0E100F]/15 dark:border-white/15 pt-5 transition-all duration-300 hover:translate-x-2 hover:border-[#8B7CFF]/60 will-change-transform">
                <p className="font-display font-extrabold text-4xl opacity-20 transition-all duration-300 group-hover:opacity-60 group-hover:text-[#8B7CFF]">{s.n}</p>
                <h3 className="font-display font-bold text-2xl mt-2">{s.title}</h3>
                <p className="opacity-70 text-sm leading-relaxed mt-3">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS — dates synced live from GitHub */}
        <section id="projects" className="px-4 max-w-6xl mx-auto mt-20">
          <h2 className="reveal font-display font-extrabold text-3xl md:text-5xl tracking-tight">My Projects</h2>
          <p className="opacity-60 mt-3 max-w-xl text-sm md:text-base">Backend projects — from RAG systems to full-stack clones, each shipped with real code. Dates sync live from GitHub. {apiStatus === 'online' && <span className="text-emerald-600 dark:text-emerald-300">● live from Django</span>}</p>

          <div className="mt-8 space-y-10">
            {projects.map((p, pi) => {
              const live = githubDates[p.repo || repoFromUrl(p.code_url)]
              const created = live?.created_at || p.created_at
              const pushed = live?.pushed_at || p.pushed_at
              const createdLabel = formatMonthYear(created)
              const pushedLabel = formatMonthYear(pushed)
              const dateBadge = pushedLabel && pushedLabel !== createdLabel
                ? `${createdLabel} • Updated ${pushedLabel}`
                : createdLabel || p.year || ''
              const dateTitle = `Created ${created || 'unknown'}${pushed ? ` • Last push ${pushed}` : ''} — synced from GitHub`
              const cover = resolveMediaUrl(p.cover)
              return (
              <article key={p.id ?? p.title} style={{ transitionDelay: `${(pi % 4) * 90}ms` }} className="reveal group grid lg:grid-cols-2 gap-6 items-stretch border border-[#0E100F]/10 dark:border-white/10 rounded-[28px] p-4 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8B7CFF]/10 hover:border-[#8B7CFF]/40 dark:hover:border-[#8B7CFF]/40">
                <div className={`rounded-2xl bg-gradient-to-br ${p.gradient || 'from-violet-600 to-indigo-600'} relative p-6 flex flex-col justify-between overflow-hidden min-h-[280px]`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex justify-between items-start gap-3">
                    <span title={dateTitle} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium border border-white/20 text-white">{dateBadge} • GitHub</span>
                  </div>
                  <div className="relative flex-1 grid place-items-center py-6 overflow-hidden">
                    {cover ? (
                      <img src={cover} alt={`${p.title} cover`} loading="lazy" className="max-h-44 w-full rounded-xl object-cover border border-white/20 transition-transform duration-500 group-hover:scale-[1.04]" />
                    ) : (
                      <span role="img" aria-label={`${p.title} icon`} className="text-7xl md:text-8xl drop-shadow-lg select-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">{p.emoji || '💻'}</span>
                    )}
                  </div>
                </div>
                <div className="p-2 md:p-4 flex flex-col">
                  <h3 className="font-display font-extrabold text-3xl tracking-tight">{p.title}</h3>
                  <p className="font-semibold mt-2 opacity-80">{p.stack || (p.tags || []).join(', ')}</p>
                  <p className="text-sm opacity-70 leading-relaxed mt-3 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(p.tags || []).map((t) => <span key={t} className="px-2.5 py-1 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-xs opacity-80 transition-all duration-300 hover:opacity-100 hover:border-[#8B7CFF]/60 hover:scale-105 cursor-default">{t}</span>)}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <a href={p.code_url || '#'} target="_blank" rel="noreferrer" onClick={(e) => { if (!p.code_url || p.code_url === '#') { e.preventDefault(); showToast('Github repo private 🔒') } }} className="group/btn flex-1 text-center px-6 py-2.5 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm font-bold transition-all duration-300 hover:shadow-xl hover:shadow-[#8B7CFF]/20 active:scale-[0.98]">View Code <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">↗</span></a>
                  </div>
                </div>
              </article>
              )
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="px-4 max-w-6xl mx-auto mt-20">
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 border border-[#0E100F]/10 dark:border-white/10 rounded-[28px] p-8">
              <p className="text-xs tracking-[0.2em] font-bold opacity-60">ABOUT ME</p>
              <h2 className="font-display font-extrabold text-3xl mt-3 leading-tight">Building backends<br />with purpose &amp; precision</h2>
              <p className="opacity-70 text-sm leading-relaxed mt-4">
                I&apos;m a computer engineering student who loves turning complex problems into clean, reliable services. I bridge ideas and infrastructure — designing schemas, shipping REST APIs and containerizing everything with Docker.
              </p>
              {githubProfile?.bio && (
                <p className="text-sm leading-relaxed mt-3 border-l-2 border-[#8B7CFF]/60 pl-3 opacity-80">
                  On GitHub: &ldquo;{githubProfile.bio}&rdquo;
                </p>
              )}
              <div className="mt-6">
                {[
                  { l: 'Location', v: profile?.location || githubProfile?.location || '404: Not Found 🌍' },
                  { l: 'Focus', v: 'RAG systems & APIs' },
                  { l: 'Email', v: displayEmail },
                ].map((r) => (
                  <div key={r.l} className="flex justify-between gap-4 text-sm py-3 border-b border-[#0E100F]/10 dark:border-white/10 last:border-0">
                    <span className="opacity-60">{r.l}</span><span className="font-medium text-right break-all">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 border border-[#0E100F]/10 dark:border-white/10 rounded-[28px] p-8">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm font-bold">REST APIs</span>
                <span className="px-4 py-2 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-sm">Dockerized Deploys</span>
                <span className="px-4 py-2 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-sm">RAG Systems</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { n: '19+', d: 'Public repositories' },
                  { n: '111', d: 'GitHub followers' },
                  { n: '☕', d: 'Always (fun fact)' },
                ].map((c) => (
                  <div key={c.n} className="border border-[#0E100F]/10 dark:border-white/10 rounded-2xl p-5">
                    <p className="font-display font-extrabold text-2xl">{c.n}</p>
                    <p className="text-xs opacity-60 mt-1">{c.d}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mt-8 border border-[#0E100F]/10 dark:border-white/10 rounded-2xl p-5 text-sm opacity-80 leading-relaxed">
                &quot;Let&apos;s build something great together!&quot;
                <span className="block mt-3 text-xs opacity-60">— Soroush, README.md</span>
              </blockquote>
            </div>
          </div>
        </section>

        {/* TOOLKIT */}
        <section id="skills" className="px-4 max-w-6xl mx-auto mt-20">
          <h2 className="reveal font-display font-extrabold text-3xl md:text-5xl tracking-tight">My toolkit.</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 mt-8">
            {TOOLKIT.map((g, gi) => (
              <div key={g.group} style={{ transitionDelay: `${gi * 100}ms` }} className="reveal border-t border-[#0E100F]/15 dark:border-white/15 pt-5 transition-colors duration-300 hover:border-[#8B7CFF]/60">
                <h3 className="font-display font-bold text-xl">{g.group}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {g.items.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-full border border-[#0E100F]/15 dark:border-white/15 text-xs font-medium opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105 hover:bg-[#0E100F] hover:text-[#FFFCE1] dark:hover:bg-[#FFFCE1] dark:hover:text-[#0E100F] cursor-default">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {skills.map((s, si) => (
              <div key={s.id ?? s.name} style={{ transitionDelay: `${(si % 4) * 80}ms` }} className="reveal group border border-[#0E100F]/10 dark:border-white/10 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#8B7CFF]/50">
                <div className="w-10 h-10 rounded-xl bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] grid place-items-center font-bold text-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {s.icon || '◆'}
                </div>
                <h3 className="font-semibold mt-4 text-sm">{s.name}</h3>
                <p className="text-xs opacity-60 mt-1">{s.level}</p>
                <div className="mt-3 h-1.5 bg-[#0E100F]/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B7CFF] via-[#5EEAD4] to-[#FACC15] rounded-full transition-all duration-500" style={{ width: levelWidth(s.level) }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-4 max-w-6xl mx-auto mt-20 mb-10">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 rounded-[28px] p-8 bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] relative overflow-hidden">
              <p className="text-xs tracking-[0.2em] font-bold opacity-60">GET IN TOUCH</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl mt-3 leading-tight">Contact Me</h2>
              <p className="opacity-70 text-sm mt-3 leading-relaxed">Have an idea or want to collaborate? I&apos;m open to internships, freelance work and open-source projects. Drop a message and I&apos;ll reply within 24h.</p>

              <div className="mt-8 space-y-3">
                <a href={`mailto:${displayEmail}`} className="flex items-center gap-3 border border-current/20 rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="w-9 h-9 rounded-xl bg-current/10 grid place-items-center">✉</span>
                  <span className="text-sm font-medium break-all">{displayEmail}</span>
                </a>
                <a href="https://t.me/inairplanemode" target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-current/20 rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="w-9 h-9 rounded-xl bg-current/10 grid place-items-center">✈</span>
                  <span className="text-sm">{displayTelegram}</span>
                </a>
                {xHandle && (
                  <a href={xUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-current/20 rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <span className="w-9 h-9 rounded-xl bg-current/10 grid place-items-center text-sm font-bold">𝕏</span>
                    <span className="text-sm">{xHandle} <span className="opacity-60">· via GitHub</span></span>
                  </a>
                )}
                {blogUrl && (
                  <a href={blogUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-current/20 rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <span className="w-9 h-9 rounded-xl bg-current/10 grid place-items-center">🌐</span>
                    <span className="text-sm break-all">{blogHost} <span className="opacity-60">· via GitHub</span></span>
                  </a>
                )}
                <div className="flex gap-3 pt-2">
                  {[
                    { l: 'GitHub', h: GITHUB },
                    { l: 'X', h: xUrl },
                    { l: 'Telegram', h: 'https://t.me/inairplanemode' },
                    { l: 'Instagram', h: 'https://www.instagram.com/soroush_eghdami_/' },
                  ].map((s) => (
                    <a key={s.l} href={s.h} target="_blank" rel="noreferrer" title={s.l} className="w-9 h-9 rounded-full border border-current/20 grid place-items-center text-xs font-bold transition-all duration-300 hover:scale-110">{s.l[0]}</a>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="lg:col-span-7 border border-[#0E100F]/10 dark:border-white/10 rounded-[28px] p-8">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-xs tracking-widest opacity-60 font-bold">FULL NAME</span>
                  <input name="name" required maxLength={100} placeholder="John Doe" aria-invalid={!!formErrors.name} className={`w-full px-4 py-3 rounded-xl bg-transparent border text-sm placeholder:opacity-40 focus:outline-none transition focus:border-[#8B7CFF] focus:ring-2 focus:ring-[#8B7CFF]/30 ${formErrors.name ? 'border-red-500' : 'border-[#0E100F]/15 dark:border-white/15'}`} />
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs tracking-widest opacity-60 font-bold">EMAIL ADDRESS</span>
                  <input name="email" required type="email" maxLength={254} placeholder="john@example.com" aria-invalid={!!formErrors.email} className={`w-full px-4 py-3 rounded-xl bg-transparent border text-sm placeholder:opacity-40 focus:outline-none transition focus:border-[#8B7CFF] focus:ring-2 focus:ring-[#8B7CFF]/30 ${formErrors.email ? 'border-red-500' : 'border-[#0E100F]/15 dark:border-white/15'}`} />
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </label>
              </div>
              <label className="space-y-1.5 block mt-4">
                <span className="text-xs tracking-widest opacity-60 font-bold">SUBJECT</span>
                <input name="subject" placeholder="Project inquiry" maxLength={200} className={`w-full px-4 py-3 rounded-xl bg-transparent border text-sm placeholder:opacity-40 focus:outline-none transition focus:border-[#8B7CFF] focus:ring-2 focus:ring-[#8B7CFF]/30 ${formErrors.subject ? 'border-red-500' : 'border-[#0E100F]/15 dark:border-white/15'}`} />
                {formErrors.subject && <p className="text-xs text-red-500">{formErrors.subject}</p>}
              </label>
              <label className="space-y-1.5 block mt-4">
                <span className="text-xs tracking-widest opacity-60 font-bold">MESSAGE</span>
                <textarea name="message" required rows={4} maxLength={5000} placeholder="Tell me about your project..." className={`w-full px-4 py-3 rounded-xl bg-transparent border text-sm placeholder:opacity-40 focus:outline-none resize-none transition ${formErrors.message ? 'border-red-500' : 'border-[#0E100F]/15 dark:border-white/15'}`} />
                {formErrors.message && <p className="text-xs text-red-500">{formErrors.message}</p>}
              </label>
              <button type="submit" disabled={sending} className="group mt-6 w-full py-3.5 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#8B7CFF]/20 active:scale-[0.99] inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {sending ? 'Sending...' : 'Send Message'} <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <p className="text-center text-xs opacity-60 mt-3">Avg. response time — 3 hours ⚡ {apiStatus === 'online' ? '· Django API connected' : '· API offline — local fallback'}</p>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER — reference style */}
      <footer className="border-t border-[#0E100F]/10 dark:border-white/10 px-4 pt-12 pb-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight">Where aesthetics &amp;<br />functionality meet</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div>
              <p className="text-xs tracking-[0.2em] font-bold opacity-60">EXPLORE</p>
              <div className="flex flex-col gap-2 mt-4 text-sm font-medium items-start">
                <a href="#home" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Home</a>
                <a href="#projects" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Projects</a>
                <a href="#about" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">About Me</a>
                <a href="#contact" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Contact</a>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] font-bold opacity-60">FOLLOW ME</p>
              <div className="flex flex-col gap-2 mt-4 text-sm font-medium items-start">
                <a href="https://github.com/Soroush-Eghdami" target="_blank" rel="noreferrer" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Github</a>
                <a href={xUrl} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Twitter / X</a>
                <a href="https://t.me/inairplanemode" target="_blank" rel="noreferrer" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Telegram</a>
                <a href="https://www.instagram.com/soroush_eghdami_/" target="_blank" rel="noreferrer" className="transition-all duration-300 hover:translate-x-1 hover:opacity-100 opacity-80">Instagram</a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#contact" className="px-6 py-3 rounded-full bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm font-bold text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">Contact Me</a>
              <a href="#projects" className="px-6 py-3 rounded-full border border-[#0E100F]/20 dark:border-white/20 text-sm font-semibold text-center transition-all duration-300 hover:scale-[1.02] hover:border-[#8B7CFF]/60 active:scale-[0.98]">Say Hello ! — Explore Projects</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-[#0E100F]/10 dark:border-white/10 text-sm opacity-70">
            <p>{shortName} ©2026 - Privacy Policy</p>
            <p>Built with React + Tailwind + Vite + Django</p>
          </div>
        </div>
      </footer>

      {toast && (
        <div role="status" aria-live="polite" aria-atomic="true" className="toast-in fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0E100F] text-[#FFFCE1] dark:bg-[#FFFCE1] dark:text-[#0E100F] text-sm px-5 py-3 rounded-full shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
