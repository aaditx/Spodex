import { useState, useEffect } from 'react'
import { api } from '../api'
import './DreamTeam.css'

const POSITION_COLORS = {
    'Top Order': '#60a5fa',
    'Middle Order': '#a78bfa',
    'Lower Order': '#f59e0b',
    'Wicket-Keeper': '#fbbf24',
    'Pace Bowler': '#34d399',
    'Spin Bowler': '#10b981',
    'All-Rounder': '#fb923c',
}

// Pitch layout rows: [positions in each row]
const PITCH_LAYOUT = [
    ['Pace Bowler', 'Pace Bowler', 'Spin Bowler'],
    ['All-Rounder', 'All-Rounder'],
    ['Wicket-Keeper'],
    ['Middle Order', 'Lower Order'],
    ['Top Order', 'Top Order'],
]

function PlayerPin({ player, isCaptain, isViceCaptain }) {
    const color = POSITION_COLORS[player.position] || '#10b981'
    return (
        <div className="player-pin" style={{ '--pin-color': color }}>
            {isCaptain && <div className="captain-badge">C</div>}
            {isViceCaptain && <div className="vc-badge">VC</div>}
            <div className="pin-name">{player.name.split(' ').slice(-1)[0]}</div>
            <div className="pin-pos">{player.position}</div>
            <div className="pin-country">{player.country}</div>
            <div className="pin-stat">{player.key_stat}</div>
        </div>
    )
}

export default function DreamTeam() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.dreamTeam().then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="loading-wrap" style={{ minHeight: '100vh' }}><div className="spinner" /><span>Building Dream XI…</span></div>

    const team = data?.team || []
    const captain = data?.captain
    const vc = data?.vice_captain

    // Group by position for pitch layout
    const byPosition = {}
    team.forEach(p => {
        if (!byPosition[p.position]) byPosition[p.position] = []
        byPosition[p.position].push(p)
    })

    return (
        <main className="dt-page">
            <div className="page-header">
                <div className="container">
                    <p className="section-subtitle">AI-selected from Asia Cup history</p>
                    <h1 className="section-title">All-Time Asia Cup <span className="gradient-text">Dream XI</span></h1>
                    <p className="text-muted text-sm mt-2">
                        Captain: <strong style={{ color: '#fbbf24' }}>{captain}</strong>
                        &nbsp;·&nbsp; Vice Captain: <strong style={{ color: '#94a3b8' }}>{vc}</strong>
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="dt-layout">
                    {/* Pitch visual */}
                    <div className="pitch-outer dt-pitch">
                        <div className="pitch-label top-label">BOWLING END</div>

                        {PITCH_LAYOUT.map((row, ri) => (
                            <div key={ri} className="pitch-row">
                                {row.map(pos => {
                                    const players = byPosition[pos] || []
                                    const player = players.shift()
                                    if (!player) return null
                                    return (
                                        <PlayerPin
                                            key={player.name}
                                            player={player}
                                            isCaptain={player.name === captain}
                                            isViceCaptain={player.name === vc}
                                        />
                                    )
                                })}
                            </div>
                        ))}

                        <div className="pitch-strip" />
                        <div className="pitch-label bottom-label">BATTING END</div>
                    </div>

                    {/* List view */}
                    <div className="dt-list">
                        <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Squad Details</h2>
                        {team.map((p, i) => (
                            <div key={p.name} className="dt-player-row card">
                                <div className="dt-player-num">{i + 1}</div>
                                <div className="dt-player-info">
                                    <div className="dt-player-name">
                                        {p.name}
                                        {p.name === captain && <span className="badge badge-gold ml-2">C</span>}
                                        {p.name === vc && <span className="badge badge-emerald ml-2">VC</span>}
                                    </div>
                                    <div className="dt-player-meta">{p.country} · {p.key_stat}</div>
                                </div>
                                <div className="dt-player-pos" style={{ color: POSITION_COLORS[p.position] || '#10b981' }}>
                                    {p.position}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
