import { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import History from './components/History';

const API = '/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [history, setHistory] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => { setToken(null); localStorage.removeItem('token'); });
  }, [token]);

  // Load history when user is set
  useEffect(() => {
    if (!user || !token) return;
    fetchHistory();
  }, [user, token]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/analysis/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {}
  }, [token]);

  const handleAuth = (authToken, authUser) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setHistory([]);
    setActiveResult(null);
  };

  const handleAnalysisComplete = (result) => {
    setActiveResult(result);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/analysis/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(prev => prev.filter(h => h.id !== id));
      if (activeResult?.id === id) setActiveResult(null);
    } catch {}
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen(s => !s)}
      />
      <div className="app-layout">
        <History
          history={history}
          activeId={activeResult?.id}
          onSelect={setActiveResult}
          onDelete={handleDelete}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="main-content">
          <Dashboard
            token={token}
            activeResult={activeResult}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </main>
      </div>
    </div>
  );
}
