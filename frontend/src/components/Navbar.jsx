export default function Navbar({ user, theme, onToggleTheme, onLogout, onMenuToggle }) {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button className="menu-toggle" onClick={onMenuToggle}>☰</button>
        <div className="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26, color: '#6c5ce7' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
            <line x1="9" y1="11" x2="13" y2="11" />
          </svg>
          ResumeAI
        </div>
      </div>
      <div className="navbar-actions">
        <span className="navbar-user">👋 {user.username}</span>
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
