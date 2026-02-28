import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import './Compare.css'

const COMPARE_STATS = [
    { key: 'Runs', label: 'Runs', max: 1300, color1: '#60a5fa', color2: '#f59e0b' },
    { key: 'Batting Average', label: 'Batting Avg', max: 100, color1: '#60a5fa', color2: '#f59e0b' },
    { key: 'Strike Rate', label: 'Strike Rate', max: 150, color1: '#60a5fa', color2: '#f59e0b' },
    { key: 'Centuries', label: 'Centuries', max: 6, color1: '#60a5fa', color2: '#f59e0b' },
    { key: 'Wickets', label: 'Wickets', max: 30, color1: '#34d399', color2: '#fb923c' },
    { key: 'Economy Rate', label: 'Economy', max: 10, color1: '#34d399', color2: '#fb923c' },
    { key: 'Bowling Average', label: 'Bowl Avg', max: 50, color1: '#34d399', color2: '#fb923c' },
    { key: 'Dismissals', label: 'Dismissals', max: 40, color1: '#fbbf24', color2: '#a78bfa' },
    { key: 'Matches', label: 'Matches', max: 30, color1: '#94a3b8', color2: '#94a3b8' },
]

function DualBar({ label, v1, v2, max, color1, color2 }) {
    const pct1 = Math.min(((v1 || 0) / max) * 100, 100)
    const pct2 = Math.min(((v2 || 0) / max) * 100, 100)
    if (!v1 && !v2) return null
    const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0
    return (
        <div className="dual-bar-row">
            <span className={`dual-val ${winner === 1 ? 'dual-winner' : ''}`}>{v1 ?? '—'}</span>
            <div className="dual-bar-center">
                <span className="dual-label">{label}</span>
                <div className="dual-track-wrap">
                    <div className="dual-track left-track">
                        <div className="dual-fill left-fill" style={{ width: `${pct1}%`, background: color1 }} />
                    </div>
                    <div className="dual-track right-track">
                        <div className="dual-fill right-fill" style={{ width: `${pct2}%`, background: color2 }} />
                    </div>
                </div>
            </div>
            <span className={`dual-val ${winner === 2 ? 'dual-winner' : ''}`}>{v2 ?? '—'}</span>
        </div>
    )
}

export default function Compare() {
    const [searchParams] = useSearchParams()
    const [players, setPlayers] = useState([])
    const [p1, setP1] = useState(searchParams.get('p1') || '')
    const [p2, setP2] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.players().then(ps => setPlayers(ps))
    }, [])

    const handleCompare = () => {
        if (!p1 || !p2) return
        setLoading(true)
        setError(null)
        api.compare(p1, p2).then(d => {
            if (d.error) setError(d.error)
            else setResult(d)
            setLoading(false)
        }).catch(() => { setError('Something went wrong'); setLoading(false) })
    }

    const p1Data = result?.player1
    const p2Data = result?.player2

    return (
        <main className="compare-page">
            <div className="page-header">
                <div className="container">
                    <p className="section-subtitle">Any two players, side by side</p>
                    <h1 className="section-title">Head-to-Head <span className="gradient-text">Comparator</span></h1>
                </div>
            </div>

            <div className="container">
                {/* Picker */}
                <div className="compare-picker card">
                    <div className="picker-col">
                        <label className="picker-label">Player 1</label>
                        <select id="compare-p1" className="input" value={p1} onChange={e => setP1(e.target.value)}>
                            <option value="">Select player…</option>
                            {players.map(p => <option key={p.name} value={p.name}>{p.name} ({p.country})</option>)}
                        </select>
                    </div>
                    <div className="vs-badge">VS</div>
                    <div className="picker-col">
                        <label className="picker-label">Player 2</label>
                        <select id="compare-p2" className="input" value={p2} onChange={e => setP2(e.target.value)}>
                            <option value="">Select player…</option>
                            {players.map(p => <option key={p.name} value={p.name}>{p.name} ({p.country})</option>)}
                        </select>
                    </div>
                    <button id="compare-btn" className="btn btn-primary compare-btn" onClick={handleCompare} disabled={!p1 || !p2 || loading}>
                        {loading ? '…' : '⚔️ Compare'}
                    </button>
                </div>

                {error && <div className="compare-error">{error}</div>}

                {result && (
                    <div className="compare-result fade-up">
                        {/* Winner banner */}
                        <div className="winner-banner card">
                            <span className="winner-label">🏆 Overall Winner</span>
                            <span className="winner-name">{result.winner}</span>
                            <span className="text-muted text-sm">
                                Score: {p1Data._score} vs {p2Data._score}
                            </span>
                        </div>

                        {/* Player headers */}
                        <div className="compare-headers">
                            <div className="compare-head">
                                <div className="compare-head-name">{p1Data.Player}</div>
                                <div className="compare-head-meta">{p1Data.Country} · {p1Data.Role}</div>
                            </div>
                            <div className="compare-head text-right">
                                <div className="compare-head-name">{p2Data.Player}</div>
                                <div className="compare-head-meta">{p2Data.Country} · {p2Data.Role}</div>
                            </div>
                        </div>

                        {/* Dual bars */}
                        <div className="card dual-bars-card">
                            {COMPARE_STATS.map(s => (
                                <DualBar
                                    key={s.key}
                                    label={s.label}
                                    v1={p1Data[s.key]}
                                    v2={p2Data[s.key]}
                                    max={s.max}
                                    color1={s.color1}
                                    color2={s.color2}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
