import { Link } from 'react-router-dom'
import './PlayerCard.css'

const ROLE_BADGE = {
    Batsman: 'badge-blue',
    Bowler: 'badge-emerald',
    Wicketkeeper: 'badge-gold',
}

const ROLE_ICON = {
    Batsman: '🏏',
    Bowler: '🎳',
    Wicketkeeper: '🧤',
}

export default function PlayerCard({ player }) {
    const badgeClass = ROLE_BADGE[player.role] || 'badge-blue'
    const icon = ROLE_ICON[player.role] || '⭐'

    const primaryStats = player.role === 'Bowler'
        ? [
            { label: 'Wickets', value: player.wickets ?? '—' },
            { label: 'Economy', value: player.economy ?? '—' },
            { label: 'Matches', value: player.matches ?? '—' },
        ]
        : player.role === 'Wicketkeeper'
            ? [
                { label: 'Dismissals', value: player.dismissals ?? '—' },
                { label: 'Matches', value: player.matches ?? '—' },
                { label: 'Runs', value: player.runs ?? '—' },
            ]
            : [
                { label: 'Runs', value: player.runs ?? '—' },
                { label: 'Avg', value: player.batting_avg ?? '—' },
                { label: 'Matches', value: player.matches ?? '—' },
            ]

    return (
        <Link
            to={`/player/${encodeURIComponent(player.name)}`}
            className="player-card card"
        >
            <div className="pc-header">
                <div className="pc-avatar">{icon}</div>
                <div className="pc-info">
                    <div className="pc-name">{player.name}</div>
                    <div className="pc-country">{player.country}</div>
                </div>
                <span className={`badge ${badgeClass}`}>{player.role}</span>
            </div>
            <div className="pc-stats">
                {primaryStats.map(s => (
                    <div key={s.label} className="stat-chip">
                        <span className="stat-chip-label">{s.label}</span>
                        <span className="stat-chip-value">{s.value}</span>
                    </div>
                ))}
            </div>
            <div className="pc-footer">
                View Full Profile →
            </div>
        </Link>
    )
}
