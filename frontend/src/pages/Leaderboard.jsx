import { useState, useEffect } from 'react'
import { api } from '../api'
import './Leaderboard.css'

const CATEGORIES = [
    { key: 'runs', label: 'Top Scorers', icon: '🏏', unit: 'Runs' },
    { key: 'batting_avg', label: 'Best Avg', icon: '📊', unit: 'Average' },
    { key: 'strike_rate', label: 'Strike Rate', icon: '⚡', unit: 'SR' },
    { key: 'wickets', label: 'Wicket-Takers', icon: '🎳', unit: 'Wickets' },
    { key: 'economy', label: 'Best Economy', icon: '💰', unit: 'Economy' },
    { key: 'dismissals', label: 'Top Keepers', icon: '🧤', unit: 'Dismissals' },
]

const MEDAL = ['🥇', '🥈', '🥉']

const FLAGS = {
    India: '🇮🇳', Pakistan: '🇵🇰', 'Sri Lanka': '🇱🇰', Bangladesh: '🇧🇩',
    Afghanistan: '🇦🇫', 'Hong Kong': '🇭🇰', Oman: '🇴🇲', UAE: '🇦🇪',
}

export default function Leaderboard() {
    const [category, setCategory] = useState('runs')
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        api.leaderboard(category, 20).then(d => {
            setData(d)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [category])

    const active = CATEGORIES.find(c => c.key === category)
    const maxVal = data[0]?.value || 1

    return (
        <main className="lb-page">
            <div className="page-header">
                <div className="container">
                    <p className="section-subtitle">All-time Asia Cup rankings</p>
                    <h1 className="section-title">Player <span className="gradient-text">Leaderboard</span></h1>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                {/* Category tabs */}
                <div className="lb-tabs">
                    {CATEGORIES.map(c => (
                        <button
                            key={c.key}
                            className={`lb-tab-btn ${category === c.key ? 'active' : ''}`}
                            onClick={() => setCategory(c.key)}
                        >
                            {c.icon} {c.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-wrap"><div className="spinner" /><span>Loading…</span></div>
                ) : (
                    <div className="lb-table">
                        {/* Podium (top 3) */}
                        {data.length >= 3 && (
                            <div className="podium">
                                {[data[1], data[0], data[2]].map((p, pi) => {
                                    const height = pi === 1 ? 140 : pi === 0 ? 110 : 90
                                    const medal = pi === 1 ? '🥇' : pi === 0 ? '🥈' : '🥉'
                                    return (
                                        <div key={p.name} className="podium-column">
                                            <div className="podium-player">
                                                <div className="podium-medal">{medal}</div>
                                                <div className="podium-name">{p.name}</div>
                                                <div className="podium-country">{FLAGS[p.country] || ''} {p.country}</div>
                                                <div className="podium-value">{p.value}</div>
                                                <div className="podium-unit">{active?.unit}</div>
                                            </div>
                                            <div className="podium-block" style={{ height, background: pi === 1 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)' }}>
                                                <span style={{ color: pi === 1 ? '#f59e0b' : '#64748b', fontSize: '1.2rem' }}>#{p.rank}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Full list */}
                        <div className="lb-list">
                            {data.map((p, i) => (
                                <div key={`${p.name}-${i}`} className={`lb-row card ${i < 3 ? 'lb-top3' : ''}`}>
                                    <div className="lb-rank">
                                        {i < 3 ? MEDAL[i] : `#${p.rank}`}
                                    </div>
                                    <div className="lb-player-info">
                                        <div className="lb-player-name">{p.name}</div>
                                        <div className="lb-player-meta">
                                            {FLAGS[p.country] || ''} {p.country} · {p.role}
                                        </div>
                                    </div>
                                    <div className="lb-bar-col">
                                        <div className="lb-bar-track">
                                            <div
                                                className="lb-bar-fill"
                                                style={{ width: `${(p.value / maxVal) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="lb-value">
                                        <span className="lb-val-num">{p.value}</span>
                                        <span className="lb-val-unit">{active?.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
