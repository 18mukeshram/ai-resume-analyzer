import { useState, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';

function ScoreRing({ score }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? '#00cec9' : score >= 40 ? '#fdcb6e' : '#ff6b6b';

  return (
    <div className="score-ring">
      <svg viewBox="0 0 100 100">
        <circle className="score-ring-bg" cx="50" cy="50" r={r} />
        <circle
          className="score-ring-fill"
          cx="50" cy="50" r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ '--score-offset': offset }}
        />
      </svg>
      <div className="score-ring-text" style={{ color }}>{score}%</div>
      <div className="score-ring-label">Match</div>
    </div>
  );
}

function SkillsTab({ matched, missing }) {
  return (
    <div className="skills-grid">
      <div className="skills-column">
        <h4><span className="dot dot-success"></span> Matched Skills ({matched.length})</h4>
        <div>{matched.map((s, i) => <span key={i} className="skill-tag skill-matched">{s}</span>)}</div>
        {matched.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No matching skills found</p>}
      </div>
      <div className="skills-column">
        <h4><span className="dot dot-danger"></span> Missing Skills ({missing.length})</h4>
        <div>{missing.map((s, i) => <span key={i} className="skill-tag skill-missing">{s}</span>)}</div>
        {missing.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No gaps detected!</p>}
      </div>
    </div>
  );
}

export default function Dashboard({ token, activeResult, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('skills');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const resultsRef = useRef();

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.docx'))) {
      setFile(f);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError('Please upload a resume and enter a job description.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jd);

    try {
      const res = await fetch(`${API}/analysis/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      onAnalysisComplete(data);
      setTab('skills');
      // Scroll to results
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!activeResult) return;
    // Dynamic import to keep bundle small
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);
    const el = resultsRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#1a1a2e' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    pdf.save(`ResumeAI_Report_${activeResult.resumeName}.pdf`);
  };

  const r = activeResult;

  return (
    <>
      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <h3>📄 Upload Resume</h3>
          <div
            className={`dropzone ${dragOver ? 'dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="dropzone-icon">📎</div>
            <div className="dropzone-text">
              Drag & drop or <span>browse</span>
            </div>
            <div className="dropzone-hint">PDF or DOCX (max 10MB)</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <div className="file-selected">
              <span>📄</span>
              <span className="file-selected-name">{file.name}</span>
              <button className="file-selected-remove" onClick={() => setFile(null)}>✕</button>
            </div>
          )}
        </div>

        <div className="upload-card">
          <h3>💼 Job Description</h3>
          <textarea
            className="jd-textarea"
            placeholder="Paste the job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <div className="jd-char-count">{jd.length} characters</div>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="analyze-btn-wrapper">
        <button
          className="btn btn-primary analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file || !jd.trim()}
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze Resume'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">AI is analyzing your resume... This may take a moment.</div>
        </div>
      )}

      {/* Results */}
      {r && !loading && (
        <div className="results" ref={resultsRef}>
          <div className="results-header">
            <h2>📊 Analysis Results</h2>
            <button className="btn btn-ghost btn-sm" onClick={downloadPDF}>
              📥 Download PDF
            </button>
          </div>

          <div className="score-section">
            <ScoreRing score={r.matchScore} />
            <div className="score-summary">
              <h3>{r.resumeName}</h3>
              <p>{r.summary}</p>
            </div>
          </div>

          <div className="tabs">
            <div className="tab-headers">
              <button className={`tab-header ${tab === 'skills' ? 'active' : ''}`} onClick={() => setTab('skills')}>
                Skills Match
              </button>
              <button className={`tab-header ${tab === 'improve' ? 'active' : ''}`} onClick={() => setTab('improve')}>
                Improvements
              </button>
              <button className={`tab-header ${tab === 'interview' ? 'active' : ''}`} onClick={() => setTab('interview')}>
                Interview Prep
              </button>
            </div>
            <div className="tab-content">
              {tab === 'skills' && <SkillsTab matched={r.matchedSkills || []} missing={r.missingSkills || []} />}
              {tab === 'improve' && (
                <ul className="insight-list">
                  {(r.improvements || []).map((item, i) => <li key={i}>💡 {item}</li>)}
                </ul>
              )}
              {tab === 'interview' && (
                <ul className="insight-list questions">
                  {(r.interviewQuestions || []).map((q, i) => <li key={i}>❓ {q}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!r && !loading && (
        <div className="welcome">
          <div className="welcome-icon">🧠</div>
          <h2>Ready to Analyze</h2>
          <p>Upload your resume and paste a job description to get AI-powered insights, skill matching, and interview preparation.</p>
        </div>
      )}
    </>
  );
}
