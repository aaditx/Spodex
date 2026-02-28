import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts'
import { api } from '../api'
import './PlayerProfile.css'

const ROLE_ICON = { Batsman: '🏏', Bowler: '🎳', Wicketkeeper: '🧤' }
const ROLE_BADGE = { Batsman: 'badge-blue', Bowler: 'badge-emerald', Wicketkeeper: 'badge-gold' }

function StatBar({ label, value, max, color = '#10b981' }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
    return (
        <div className="stat-bar-wrap">
            <div className="stat-bar-label">
                <span>{label}</span>
                <span>{value ?? '—'}</span>
            </div>
            <div className="stat-bar-track">
                <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    )
}

function buildRadar(rec) {
    const norm = (v, max) => Math.min(((v || 0) / max) * 100, 100)
    if (rec.Role === 'Bowler') {
        return [
            { subject: 'Wickets', A: norm(rec.Wickets, 30) },
            { subject: 'Economy', A: norm(10 - (rec['Economy Rate'] || 10), 10) * 10 },
            { subject: 'BowlAvg', A: norm(50 - (rec['Bowling Average'] || 50), 50) * 2 },
            { subject: 'Overs', A: norm(rec.Overs, 250) },
            { subject: '5-fers', A: norm((rec['Five Wickets'] || 0) * 20, 60) },
        ]
    }
    if (rec.Role === 'Wicketkeeper') {
        return [
            { subject: 'Dismissals', A: norm(rec.Dismissals, 40) },
            { subject: 'Stumpings', A: norm(rec.Stumpings, 12) },
            { subject: 'Catches', A: norm(rec.Catches, 30) },
            { subject: 'Matches', A: norm(rec.Matches, 25) },
            { subject: 'Runs', A: norm(rec.Runs, 800) },
        ]
    }
    return [
        { subject: 'Runs', A: norm(rec.Runs, 1300) },
        { subject: 'Avg', A: norm(rec['Batting Average'], 70) },
        { subject: 'SR', A: norm(rec['Strike Rate'], 150) },
        { subject: 'Centuries', A: norm(rec.Centuries, 6) },
        { subject: 'Fifties', A: norm(rec.Fifties, 10) },
    ]
}

export default function PlayerProfile() {
    const { name } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.player(decodeURIComponent(name))
            .then(d => { setData(d); setLoading(false) })
            .catch(() => { setError('Player not found'); setLoading(false) })
    }, [name])

    if (loading) return <div className="loading-wrap" style={{ minHeight: '100vh' }}><div className="spinner" /><span>Loading…</span></div>
    if (error || !data) return <div className="loading-wrap" style={{ minHeight: '100vh' }}><span>❌ {error}</span><Link to="/players" className="btn btn-outline mt-4">← Back</Link></div>

    const rec = data.records[0]
    const role = data.role
    const radarData = buildRadar(rec)
    const badgeClass = ROLE_BADGE[role] || 'badge-blue'
    const icon = ROLE_ICON[role] || '⭐'

    return (
        <main className="profile-page">
            <div className="page-header">
                <div className="container">
                    <Link to="/players" className="btn btn-ghost mb-4" style={{ width: 'fit-content' }}>
                        ← All Players
                    </Link>
                    <div className="profile-hero">
                        <div className="profile-avatar">{icon}</div>
                        <div>
                            <div className="flex gap-3 items-center mb-2 flex-wrap">
                                <h1 className="profile-name">{data.name}</h1>
                                <span className={`badge ${badgeClass}`}>{role}</span>
                            </div>
                            <p className="profile-country">🌍 {data.country}</p>
                            <p className="text-muted text-sm mt-2">
                                {data.records.length} tournament record{data.records.length > 1 ? 's' : ''} across Asia Cup history
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container profile-body">
                <div className="profile-grid">
                    {/* ── Stat bars ── */}
                    <div className="card profile-stats-card">
                        <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Career Statistics</h2>
                        {role !== 'Wicketkeeper' && (
                            <>
                                <p className="profile-section-label">Batting</p>
                                <StatBar label="Runs" value={rec.Runs} max={1300} />
                                <StatBar label="Batting Avg" value={rec['Batting Average']} max={100} color="#60a5fa" />
                                <StatBar label="Strike Rate" value={rec['Strike Rate']} max={180} color="#a78bfa" />
                                <StatBar label="Centuries" value={rec.Centuries} max={6} color="#f59e0b" />
                                <StatBar label="Fifties" value={rec.Fifties} max={12} color="#fbbf24" />
                            </>
                        )}
                        {role !== 'Batsman' && role !== 'Wicketkeeper' && <div className="divider" />}
                        {(role === 'Bowler') && (
                            <>
                                <p className="profile-section-label">Bowling</p>
                                <StatBar label="Wickets" value={rec.Wickets} max={30} color="#10b981" />
                                <StatBar label="Economy Rate" value={rec['Economy Rate']} max={10} color="#f87171" />
                                <StatBar label="Bowling Avg" value={rec['Bowling Average']} max={50} color="#fb923c" />
                                <StatBar label="Overs Bowled" value={rec.Overs} max={250} color="#94a3b8" />
                            </>
                        )}
                        {role === 'Wicketkeeper' && (
                            <>
                                <p className="profile-section-label">Wicketkeeping</p>
                                <StatBar label="Total Dismissals" value={rec.Dismissals} max={40} color="#f59e0b" />
                                <StatBar label="Catches" value={rec.Catches} max={30} color="#fbbf24" />
                                <StatBar label="Stumpings" value={rec.Stumpings} max={12} color="#34d399" />
                                <div className="divider" />
                                <p className="profile-section-label">Batting</p>
                                <StatBar label="Runs" value={rec.Runs} max={800} />
                                <StatBar label="Batting Avg" value={rec['Batting Average']} max={70} color="#60a5fa" />
                            </>
                        )}

                        <div className="divider" />
                        <div className="profile-chips">
                            {[
                                { label: 'Matches', value: rec.Matches },
                                { label: 'Period', value: rec['Time Period'] },
                                rec.Runs != null && { label: 'Highest Score', value: rec['Highest Score'] },
                                rec['Best Figure'] && { label: 'Best Figures', value: rec['Best Figure'] },
                                rec['Maximum Dismissals'] && { label: 'Max Dismissals', value: rec['Maximum Dismissals'] },
                            ].filter(Boolean).map(s => (
                                <div key={s.label} className="stat-chip">
                                    <span className="stat-chip-label">{s.label}</span>
                                    <span className="stat-chip-value">{s.value ?? '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="profile-right">
                        {/* Radar chart */}
                        <div className="card">
                            <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Performance Radar</h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' }} />
                                    <Radar dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.18} strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f1622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.8rem' }}
                                        formatter={(v) => [`${v.toFixed(0)}%`, 'Score']}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Insights */}
                        <div className="card">
                            <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>AI Insights</h2>
                            <div className="insights-section">
                                <p className="insights-label insights-pros">✅ Strengths</p>
                                {data.insights.pros.map((p, i) => (
                                    <div key={i} className="insight-item insight-pro">{p}</div>
                                ))}
                            </div>
                            <div className="insights-section mt-4">
                                <p className="insights-label insights-cons">⚠️ Weaknesses</p>
                                {data.insights.cons.map((c, i) => (
                                    <div key={i} className="insight-item insight-con">{c}</div>
                                ))}
                            </div>
                        </div>

                        <Link
                            to={`/compare?p1=${encodeURIComponent(data.name)}`}
                            className="btn btn-outline w-full text-center"
                            style={{ justifyContent: 'center' }}
                        >
                            ⚔️ Compare with another player
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
