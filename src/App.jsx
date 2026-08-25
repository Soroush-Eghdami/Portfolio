import { useState, useEffect } from 'react'
import { api } from './api'

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
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
    description: 'Local, private RAG app for law students — upload case files, ask questions and get answers with cited sources. CLI + web UI.',
    tags: ['Python', 'RAG', 'AI'],
    gradient: 'from-violet-600 to-indigo-600',
    demo_url: `${GITHUB}/R.A.G`,
    code_url: `${GITHUB}/R.A.G`,
  },
  {
    id: 2,
    title: 'Tweeter_Demo',
    description: 'Full-stack Twitter clone with Docker support and real-time features.',
    tags: ['TypeScript', 'Docker', 'Real-time'],
    gradient: 'from-fuchsia-600 to-pink-600',
    demo_url: `${GITHUB}/Tweeter_Demo`,
    code_url: `${GITHUB}/Tweeter_Demo`,
  },
  {
    id: 3,
    title: 'Online-shop-CBV',
    description: 'Full-featured Django e-commerce demo with clean CBV architecture, ready to deploy.',
    tags: ['Django', 'CBV', 'E-commerce'],
    gradient: 'from-cyan-500 to-blue-600',
    demo_url: `${GITHUB}/Online-shop-CBV`,
    code_url: `${GITHUB}/Online-shop-CBV`,
  },
  {
    id: 4,
    title: 'Summerizer',
    description: 'Flask web app that summarizes text, PDF documents and audio files using transformer models and the Groq API.',
    tags: ['Flask', 'Transformers', 'Groq'],
    gradient: 'from-emerald-500 to-teal-600',
    demo_url: `${GITHUB}/Summerizer`,
    code_url: `${GITHUB}/Summerizer`,
  },
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
  const [toast, setToast] = useState('')
  const [skills, setSkills] = useState(FALLBACK_SKILLS)
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [profile, setProfile] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const [sending, setSending] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([api.getSkills(), api.getProjects(), api.getProfile(), api.health()])
      .then(([s, p, pr, h]) => {
        if (cancelled) return
        if (s.status === 'fulfilled' && Array.isArray(s.value) && s.value.length) setSkills(s.value)
        if (p.status === 'fulfilled' && Array.isArray(p.value) && p.value.length) {
          setProjects(p.value.map((x) => ({
            ...x,
            description: x.description,
            demo_url: x.demo_url,
            code_url: x.code_url,
          })))
        }
        if (pr.status === 'fulfilled' && pr.value?.name) setProfile(pr.value)
        setApiStatus(h.status === 'fulfilled' ? 'online' : 'offline')
      })
      .catch(() => !cancelled && setApiStatus('offline'))
    return () => { cancelled = true }
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      subject: fd.get('subject') || '',
      message: fd.get('message'),
    }
    setSending(true)
    try {
      await api.sendContact(payload)
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
  const displayRole = profile?.role || 'Python Backend Developer'
  const displayEmail = profile?.email || 'Soroush.egh@gmail.com'
  const displayTelegram = '@inairplanemode'

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#07070b] relative selection:bg-violet-500/30 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-violet-500/10 dark:bg-violet-600/20 rounded-full blur-[120px] transition-colors duration-300" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-[130px] transition-colors duration-300" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[50%] h-[40%] bg-fuchsia-500/5 dark:bg-fuchsia-600/10 rounded-full blur-[110px] transition-colors duration-300" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] transition-colors duration-300" />
      </div>

      {/* NAVBAR */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'py-3' : 'py-5'}`}>
        <nav className={`mx-auto max-w-6xl px-4 flex items-center justify-between gap-4 ${scrolled ? 'bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-full px-6 py-3 shadow-xl dark:shadow-2xl' : 'bg-transparent border border-transparent'} transition-colors duration-300`}>
          <a href="#home" className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 grid place-items-center text-white text-sm">◆</span>
            {displayName}
            <span className="hidden sm:inline text-zinc-400 dark:text-zinc-500 font-normal">— Portfolio</span>
          </a>

          <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/5 rounded-full p-1 transition-colors duration-300">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition">
                {n.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className={`hidden lg:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${apiStatus === 'online' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : apiStatus === 'offline' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-amber-500 dark:bg-amber-400'}`} />
              {apiStatus === 'online' ? 'API online' : apiStatus === 'offline' ? 'API offline' : 'checking...'}
            </span>
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 grid place-items-center rounded-full border bg-white dark:bg-white/10 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/15 transition-colors"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#contact" className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">Let's Talk →</a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 grid place-items-center rounded-full border bg-white dark:bg-white/10 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-200"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 grid place-items-center rounded-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white transition-colors">
              <span className="text-lg">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="md:hidden mx-4 mt-3 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-2 flex flex-col shadow-xl transition-colors">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition">{n.label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 text-center py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold">Let's Talk</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="pt-32 pb-10 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-white/[0.08] dark:to-white/[0.02] backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-xl dark:shadow-none transition-colors duration-300">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-600/10 dark:from-violet-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 text-xs tracking-widest font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-3 py-1.5 transition-colors">
              <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" /> AVAILABLE FOR NEW PROJECTS
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[0.95] tracking-tight mt-6 text-zinc-900 dark:text-white">
              Python <br />
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">Backend Developer</span> <br />
              & AI Builder<span className="text-violet-600 dark:text-violet-400">.</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed mt-4 max-w-xl">
              {profile?.bio || 'I build fast, reliable backends with Python, Django and Docker — currently exploring AI-powered RAG systems and shipping real-world web apps.'}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#projects" className="px-7 py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                View Projects <span className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white grid place-items-center text-xs">↗</span>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Resume download started 📄') }} className="px-7 py-3.5 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/15 text-zinc-900 dark:text-white font-medium text-sm backdrop-blur hover:bg-zinc-200 dark:hover:bg-white/15 transition">
                Download CV
              </a>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-200 dark:border-white/10 transition-colors">
              <div className="flex -space-x-2">
                <img src={AVATAR} alt="Soroush Eghdami" className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-900 object-cover" />
                <span className="w-9 h-9 rounded-full bg-violet-600 border-2 border-white dark:border-zinc-900 grid place-items-center text-xs font-bold text-white">111</span>
              </div>
              <div className="text-sm">
                <p className="text-zinc-700 dark:text-zinc-300 font-medium">Growing community on GitHub</p>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition">github.com/Soroush-Eghdami ↗</a>
              </div>
              <div className="hidden sm:flex ml-auto gap-8">
                <div><p className="font-display font-bold text-2xl text-zinc-900 dark:text-white">19+</p><p className="text-xs text-zinc-500 uppercase tracking-widest">Repos</p></div>
                <div><p className="font-display font-bold text-2xl text-zinc-900 dark:text-white">10+</p><p className="text-xs text-zinc-500 uppercase tracking-widest">Technologies</p></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid gap-6">
            <div className="bg-white dark:bg-white/[0.06] backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[28px] p-6 relative overflow-hidden shadow-lg dark:shadow-none transition-colors duration-300">
              <div className="flex items-center gap-4">
                <img src={AVATAR} alt="Soroush Eghdami" className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-semibold leading-none text-zinc-900 dark:text-white">{displayName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{displayRole}</p>
                  <div className="flex gap-2 mt-2">
                    <a href={profile?.github || GITHUB} target="_blank" rel="noreferrer" title="GitHub" className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs font-bold">G</a>
                    <a href={profile?.twitter || 'https://x.com/Hoodi_guy'} target="_blank" rel="noreferrer" title="X / Twitter" className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 grid place-items-center text-xs text-zinc-700 dark:text-white">𝕏</a>
                    <a href="https://t.me/inairplanemode" target="_blank" rel="noreferrer" title="Telegram" className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 grid place-items-center text-xs text-zinc-700 dark:text-white">✈</a>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { k: 'Python', v: 'Adv.' },
                  { k: 'Django', v: 'Adv.' },
                  { k: 'Repos', v: '19+' },
                ].map((s) => (
                  <div key={s.k} className="bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/5 rounded-2xl py-3 transition-colors">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">{s.v}</p><p className="text-[10px] tracking-widest text-zinc-500">{s.k}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
              <p className="text-white/70 text-xs tracking-widest font-semibold">TECH STACK</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Python', 'Django', 'DRF', 'Docker', 'PostgreSQL', 'Redis'].map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/15 text-xs font-medium">{t}</span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-display font-bold">19+</p>
                  <p className="text-xs text-white/70">Public repositories</p>
                </div>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white text-violet-600 grid place-items-center hover:rotate-45 transition">↗</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 rounded-full px-2 py-2 flex items-center gap-3 overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <span className="shrink-0 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold tracking-widest">WORKING WITH</span>
          <div className="flex-1 flex gap-8 text-zinc-500 dark:text-zinc-500 text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
            <span>★ Django</span><span>★ DRF</span><span>★ PostgreSQL</span><span>★ Docker</span><span>★ Redis</span><span>★ MongoDB</span>
          </div>
          <span className="hidden md:inline pr-4 text-xs text-zinc-500">© 2026 — Crafted with passion</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 max-w-6xl mx-auto mt-6">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white dark:bg-white/[0.04] backdrop-blur border border-zinc-200 dark:border-white/10 rounded-[28px] p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <p className="text-violet-600 dark:text-violet-400 text-xs tracking-[0.2em] font-semibold">ABOUT ME</p>
            <h2 className="font-display font-bold text-3xl mt-3 leading-tight text-zinc-900 dark:text-white">Building backends<br />with purpose & precision</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-4">
              I'm a computer engineering student who loves turning complex problems into clean, reliable services. I bridge ideas and infrastructure — designing schemas, shipping REST APIs and containerizing everything with Docker.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { l: 'Location', v: profile?.location || '404: Not Found 🌍' },
                { l: 'Focus', v: 'RAG systems & APIs' },
                { l: 'Email', v: displayEmail },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-sm py-3 border-b border-zinc-200 dark:border-white/5 last:border-0">
                  <span className="text-zinc-500">{r.l}</span><span className="text-zinc-900 dark:text-white font-medium">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 bg-zinc-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[28px] p-8 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 dark:from-violet-600/10 via-transparent to-cyan-600/5 dark:to-cyan-600/10 pointer-events-none" />
            <div className="relative">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold">REST APIs</span>
                <span className="px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-sm text-zinc-700 dark:text-white">Dockerized Deploys</span>
                <span className="px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-sm text-zinc-700 dark:text-white">RAG Systems</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { n: '19+', d: 'Public repositories' },
                  { n: '111', d: 'GitHub followers' },
                  { n: '☕', d: 'Always (fun fact)' },
                ].map((c) => (
                  <div key={c.n} className="bg-white dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 rounded-2xl p-5 transition-colors">
                    <p className="font-display font-bold text-2xl text-zinc-900 dark:text-white">{c.n}</p>
                    <p className="text-xs text-zinc-500 mt-1">{c.d}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mt-8 bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 rounded-2xl p-5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed transition-colors">
                "Let's build something great together!"
                <span className="block mt-3 text-xs text-zinc-500">— Soroush, README.md</span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-4 max-w-6xl mx-auto mt-6">
        <div className="bg-white dark:bg-white/[0.04] backdrop-blur border border-zinc-200 dark:border-white/10 rounded-[28px] p-8 md:p-10 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-cyan-600 dark:text-cyan-400 text-xs tracking-[0.2em] font-semibold">SKILLS & TOOLS</p>
              <h2 className="font-display font-bold text-3xl mt-2 text-zinc-900 dark:text-white">Backend tools I ship with</h2>
            </div>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm max-w-md">A curated stack I use daily to ship production-grade products — from idea to deployment. {apiStatus === 'online' && <span className="text-emerald-600 dark:text-emerald-400">● live from Django</span>}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {skills.map((s) => (
              <div key={s.id ?? s.name} className="group bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-white/[0.06] dark:to-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-2xl p-5 hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-zinc-50 dark:hover:bg-white/[0.08] transition shadow-sm dark:shadow-none">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center font-bold text-sm group-hover:scale-105 transition">
                  {s.icon || '◆'}
                </div>
                <h3 className="font-semibold mt-4 text-sm text-zinc-900 dark:text-white">{s.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{s.level}</p>
                <div className="mt-3 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" style={{ width: s.level === 'Advanced' ? '92%' : s.level === 'Beginner' ? '45%' : '78%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-4 max-w-6xl mx-auto mt-6">
        <div className="flex items-end justify-between gap-4 mb-4 px-2">
          <div>
            <p className="text-fuchsia-600 dark:text-fuchsia-400 text-xs tracking-[0.2em] font-semibold">SELECTED WORK</p>
            <h2 className="font-display font-bold text-3xl mt-2 text-zinc-900 dark:text-white">Featured projects</h2>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); showToast('More projects coming soon 🚀') }} className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-sm text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/15 transition">View all →</a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <article key={p.id ?? p.title} className="group bg-white dark:bg-white/[0.04] backdrop-blur border border-zinc-200 dark:border-white/10 rounded-[28px] overflow-hidden hover:border-zinc-300 dark:hover:border-white/20 transition flex flex-col shadow-sm dark:shadow-none">
              <div className={`h-48 bg-gradient-to-br ${p.gradient} relative p-6 flex flex-col justify-between overflow-hidden`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
                <div className="relative flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium border border-white/20 text-white">2024 • Case Study</span>
                  <span className="w-8 h-8 rounded-full bg-white grid place-items-center text-zinc-900 group-hover:rotate-45 transition">↗</span>
                </div>
                <div className="relative">
                  <div className="w-full h-20 rounded-xl bg-white/15 backdrop-blur border border-white/20 grid place-items-center text-white/80 text-xs">▦ Preview Mockup</div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display font-semibold text-lg leading-tight text-zinc-900 dark:text-white">{p.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-2 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(p.tags || []).map((t) => <span key={t} className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-400">{t}</span>)}
                </div>
                <div className="flex gap-3 mt-5">
                  <a href={p.demo_url || '#'} onClick={(e) => { if (p.demo_url === '#') { e.preventDefault(); showToast('Live demo coming soon 🔗') }}} className="flex-1 text-center py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">Live Demo</a>
                  <a href={p.code_url || '#'} onClick={(e) => { if (p.code_url === '#') { e.preventDefault(); showToast('Github repo private 🔒') }}} className="px-5 py-2.5 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-sm text-zinc-700 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/15 transition">Code</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-4 max-w-6xl mx-auto mt-6 mb-10">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 rounded-[28px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/20 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-white/70 text-xs tracking-[0.2em] font-semibold">GET IN TOUCH</p>
              <h2 className="font-display font-bold text-3xl mt-3 leading-tight">Let's build<br />something great</h2>
              <p className="text-white/80 text-sm mt-3 leading-relaxed">Have an idea or want to collaborate? I'm open to internships, freelance work and open-source projects. Drop a message and I'll reply within 24h.</p>

              <div className="mt-8 space-y-3">
                <a href={`mailto:${displayEmail}`} className="flex items-center gap-3 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 hover:bg-white/20 transition">
                  <span className="w-9 h-9 rounded-xl bg-white text-violet-600 grid place-items-center">✉</span>
                  <span className="text-sm font-medium">{displayEmail}</span>
                </a>
                <a href="https://t.me/inairplanemode" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
                  <span className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center">✈</span>
                  <span className="text-sm">{displayTelegram}</span>
                </a>
                <div className="flex gap-3 pt-2">
                  {[
                    { l: 'GitHub', h: GITHUB },
                    { l: 'X / Twitter', h: profile?.twitter || 'https://x.com/Hoodi_guy' },
                    { l: 'Telegram', h: 'https://t.me/inairplanemode' },
                    { l: 'Instagram', h: 'https://www.instagram.com/soroush_eghdami_/' },
                  ].map((s) => (
                    <a key={s.l} href={s.h} target="_blank" rel="noreferrer" title={s.l} className="w-9 h-9 rounded-full bg-white/15 border border-white/20 grid place-items-center text-xs font-bold hover:bg-white hover:text-violet-600 transition">{s.l[0]}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-white/[0.04] backdrop-blur border border-zinc-200 dark:border-white/10 rounded-[28px] p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs tracking-widest text-zinc-500 font-semibold">FULL NAME</span>
                <input name="name" required placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white focus:outline-none focus:border-violet-400 dark:focus:border-violet-500/50 focus:bg-white dark:focus:bg-white/[0.08] transition" />
              </label>
              <label className="space-y-2">
                <span className="text-xs tracking-widest text-zinc-500 font-semibold">EMAIL ADDRESS</span>
                <input name="email" required type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white focus:outline-none focus:border-violet-400 dark:focus:border-violet-500/50 transition" />
              </label>
            </div>
            <label className="space-y-2 block mt-4">
              <span className="text-xs tracking-widest text-zinc-500 font-semibold">SUBJECT</span>
              <input name="subject" placeholder="Project inquiry" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white focus:outline-none focus:border-violet-400 dark:focus:border-violet-500/50 transition" />
            </label>
            <label className="space-y-2 block mt-4">
              <span className="text-xs tracking-widest text-zinc-500 font-semibold">MESSAGE</span>
              <textarea name="message" required rows={4} placeholder="Tell me about your project..." className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white focus:outline-none focus:border-violet-400 dark:focus:border-violet-500/50 resize-none transition" />
            </label>
            <button type="submit" disabled={sending} className="mt-6 w-full py-3.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {sending ? 'Sending...' : 'Send Message'} <span className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white grid place-items-center text-xs">→</span>
            </button>
            <p className="text-center text-xs text-zinc-500 mt-3">Avg. response time — 3 hours ⚡ {apiStatus === 'online' ? '· Django API connected' : '· API offline — local fallback'}</p>
          </form>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-white/10 py-6 px-4 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <p>© 2026 {displayName}. Built with React + Tailwind + Vite + Django. Crafted with ♥ and ☕.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-900 border border-white/15 text-white text-sm px-5 py-3 rounded-full shadow-2xl backdrop-blur z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
