import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import PlayerCard from '../components/PlayerCard'
import './Players.css'

const ROLES = ['All', 'Batsman', 'Bowler', 'Wicketkeeper']

export default function Players() {
    const [players, setPlayers] = useState([])
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('All')
    const [country, setCountry] = useState('All')

    useEffect(() => {
        api.countries().then(c => setCountries(['All', ...c]))
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = {}
        if (search) params.search = search
        if (role !== 'All') params.role = role
        if (country !== 'All') params.country = country
        api.players(params).then(data => {
            setPlayers(data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [search, role, country])

    return (
        <main className="players-page">
            <div className="page-header">
                <div className="container">
                    <p className="section-subtitle">Asia Cup · ODI &amp; T20I</p>
                    <h1 className="section-title">Player <span className="gradient-text">Explorer</span></h1>
                    <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>
                        {loading ? '…' : `${players.length} players found`}
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Filters */}
                <div className="filters-bar glass">
                    <input
                        id="player-search"
                        className="input"
                        placeholder="🔍  Search player name…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="tab-strip" role="group">
                        {ROLES.map(r => (
                            <button
                                key={r}
                                className={`tab-btn ${role === r ? 'active' : ''}`}
                                onClick={() => setRole(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <select
                        id="country-select"
                        className="input country-select"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    >
                        {countries.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="loading-wrap">
                        <div className="spinner" />
                        <span>Loading players…</span>
                    </div>
                ) : players.length === 0 ? (
                    <div className="loading-wrap">
                        <span style={{ fontSize: '2rem' }}>😶</span>
                        <span>No players found. Try different filters.</span>
                    </div>
                ) : (
                    <div className="grid-3" style={{ paddingBottom: '4rem' }}>
                        {players.map((p, i) => (
                            <PlayerCard key={`${p.name}-${i}`} player={p} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
