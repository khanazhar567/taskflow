import { Link } from 'react-router-dom';
import useTypewriter from '../hooks/useTypewriter';

const TYPEWRITER_WORDS = ['in real time.', 'with your team.', 'the smart way.', 'without the chaos.'];

const features = [
  {
    title: 'Real-Time Kanban',
    description: 'Drag tasks across columns and watch every connected user see the change instantly — no refresh needed.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    color: 'bg-indigo-500',
  },
  {
    title: 'Role-Based Access',
    description: 'Admins manage projects and tasks. Standard users view boards and add tasks. Right permissions for every role.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'bg-violet-500',
  },
  {
    title: 'Smart Notifications',
    description: 'Live notification bell updates the moment a task is created, edited, or deleted anywhere in your project.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    color: 'bg-pink-500',
  },
  {
    title: 'Priority & Due Dates',
    description: 'Colour-coded priority badges (High / Medium / Low) and overdue indicators keep your team focused on what matters.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-amber-500',
  },
];

const stats = [
  { value: 'Real-time', label: 'Live updates via Socket.io' },
  { value: '2 Roles', label: 'Admin & Standard User' },
  { value: 'WCAG AA', label: 'Fully accessible' },
];

const Landing = () => {
  const typedText = useTypewriter(TYPEWRITER_WORDS);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
        role="navigation"
        aria-label="Site navigation"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Task<span className="text-indigo-600">Flow</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', animation: 'blob 8s ease-in-out infinite' }}
          />
          <div
            className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'blob 10s ease-in-out infinite 2s' }}
          />
          <div
            className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'blob 12s ease-in-out infinite 4s' }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
            Live · Real-time task management
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
            Manage tasks together,
          </h1>

          {/* Typewriter line */}
          <div
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8 min-h-20 flex items-center justify-center"
            aria-live="polite"
            aria-label={`currently showing: ${typedText}`}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {typedText}
            </span>
            <span
              className="ml-0.5 inline-block w-0.5 bg-indigo-400 rounded animate-pulse"
              style={{ height: '1em' }}
              aria-hidden="true"
            />
          </div>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow gives your team a shared Kanban workspace with live updates, priority tracking, and role-based access — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link
              to="/register"
              className="group px-7 py-3.5 text-base font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Start for free
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
            <Link
              to="/login"
              className="px-7 py-3.5 text-base font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white bg-slate-900/50 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-95"
            >
              Sign in
            </Link>
          </div>

          {/* Stats glassmorphism cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 p-4"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600" aria-hidden="true">
          <span className="text-xs">Scroll</span>
          <div className="w-5 h-8 border border-slate-700 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything your team needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Built for project teams that need speed, clarity, and real-time collaboration.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-white mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50" aria-labelledby="how-heading">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 id="how-heading" className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">How it works</h2>
          <p className="text-gray-500 text-lg mb-16">Three steps to a fully organised team.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Admin creates projects', desc: 'Admin sets up projects, adds team members, and defines the scope of work.' },
              { step: '02', title: 'Assign tasks to users', desc: 'Create tasks with priority and due dates, then assign them to the right team member.' },
              { step: '03', title: 'Collaborate in real time', desc: 'Everyone sees Kanban board updates live the instant anything changes.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold mb-5"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  aria-hidden="true"
                >
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-slate-950" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to get organised?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Create your free account and start collaborating in minutes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Get started — it's free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Task<span className="text-indigo-400">Flow</span>
          </span>
          <span className="text-slate-600 text-xs">
            Built for MSc Advanced Software Engineering & UX
          </span>
        </div>
      </footer>

      {/* Blob keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -50px) scale(1.1); }
          66%       { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
