import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Real-Time Updates',
    description: 'See task changes instantly across all connected users without refreshing.',
    icon: '⚡',
  },
  {
    title: 'Kanban Board',
    description: 'Visualise work with drag-and-drop columns: Todo, In Progress, Done.',
    icon: '📋',
  },
  {
    title: 'Role-Based Access',
    description: 'Admins manage everything. Standard users can view and add tasks.',
    icon: '🔐',
  },
  {
    title: 'Project Organisation',
    description: 'Group tasks into projects. Stay focused on what matters.',
    icon: '📁',
  },
];

const Landing = () => (
  <div className="min-h-screen bg-white">
    {/* Navbar */}
    <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto" role="navigation" aria-label="Site navigation">
      <span className="text-xl font-bold text-slate-900">
        Task<span className="text-indigo-600">Flow</span>
      </span>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="max-w-6xl mx-auto px-6 py-24 text-center">
      <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-full mb-6">
        Real-time task management
      </span>
      <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
        Manage tasks together,<br />
        <span className="text-indigo-600">in real time</span>
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
        TaskFlow gives your team a shared workspace to create, track, and complete tasks — with live updates so everyone stays in sync.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          to="/register"
          className="px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Start for free
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 text-base font-semibold text-slate-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-6xl mx-auto px-6 pb-24" aria-labelledby="features-heading">
      <h2 id="features-heading" className="text-3xl font-bold text-slate-900 text-center mb-12">
        Everything your team needs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.title} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4" role="img" aria-label={f.title}>{f.icon}</div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} TaskFlow. Built for MSc Advanced Software Engineering.
    </footer>
  </div>
);

export default Landing;
