export default function History({ history, activeId, onSelect, onDelete, isOpen, onClose }) {
  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className="sidebar-title">Analysis History</div>
      {history.length === 0 ? (
        <div className="history-empty">
          <p>📋</p>
          <p>No analyses yet.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>Upload a resume to get started!</p>
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className={`history-item ${activeId === item.id ? 'active' : ''}`}
            onClick={() => { onSelect(item); onClose(); }}
          >
            <div className="history-item-name">{item.resumeName}</div>
            <div className="history-item-meta">
              <span className="history-item-score">{item.matchScore}% match</span>
              <span className="history-item-date">{formatDate(item.createdAt)}</span>
            </div>
            <button
              className="history-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              title="Delete"
            >✕</button>
          </div>
        ))
      )}
    </aside>
  );
}
