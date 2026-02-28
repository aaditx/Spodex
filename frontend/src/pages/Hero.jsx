import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import './Hero.css'

const FEATURES = [
    { icon: '🔍', title: 'Player Explorer', desc: 'Search 242 players by role, country, and format with instant results.', to: '/players' },
    { icon: '⚔️', title: 'Head-to-Head', desc: 'Compare any two players stat by stat across batting and bowling.', to: '/compare' },
    { icon: '🏆', title: 'Dream Team', desc: 'AI-built best XI from Asia Cup history — optimised by stats.', to: '/dream-team' },
    { icon: '📊', title: 'Leaderboard', desc: 'Top batsmen, bowlers, and wicketkeepers ranked by key metrics.', to: '/leaderboard' },
]

const FACTS = [
    { label: 'Players', value: '242+' },
    { label: 'Countries', value: '10+' },
    { label: 'Tournaments', value: 'ODI + T20I' },
    { label: 'Stats per Player', value: '20+' },
]

export default function Hero() {
    const [summary, setSummary] = useState(null)

    useEffect(() => {
        api.summary().then(setSummary).catch(() => { })
    }, [])

    return (
        <main className="hero-page">
            {/* ── Hero section ── */}
            <section className="hero-section">
                <div className="hero-bg-orb orb-1" />
                <div className="hero-bg-orb orb-2" />
                <div className="hero-bg-orb orb-3" />
                <div className="container hero-content">
                    <div className="hero-eyebrow fade-up">
                        <span className="badge badge-emerald">🏏 Asia Cup Analytics</span>
                    </div>
                    <h1 className="hero-title fade-up">
                        Cricket Intelligence<br />
                        <span className="gradient-text">Reimagined</span>
                    </h1>
                    <p className="hero-subtitle fade-up">
                        Explore 40+ years of Asia Cup history. Compare legends, build your dream XI,
                        and uncover insights powered by real match data.
                    </p>
                    <div className="hero-cta fade-up">
                        <Link to="/players" className="btn btn-primary">Explore Players</Link>
                        <Link to="/dream-team" className="btn btn-outline">Build Dream Team</Link>
                    </div>

                    {/* Stats bar */}
                    <div className="hero-stats fade-up">
                        {FACTS.map(f => (
                            <div key={f.label} className="hero-stat">
                                <span className="hero-stat-value">{summary ? (
                                    f.label === 'Players' ? summary.total_players + '+' :
                                        f.label === 'Countries' ? summary.total_countries + '+' :
                                            f.value
                                ) : f.value}</span>
                                <span className="hero-stat-label">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Animated cricket ball */}
                <div className="hero-ball-wrap">
                    <div className="hero-ball">🏏</div>
                </div>
            </section>

            {/* ── Features grid ── */}
            <section className="section features-section">
                <div className="container">
                    <p className="section-subtitle text-center" style={{ marginBottom: '0.5rem' }}>Everything you need</p>
                    <h2 className="section-title text-center" style={{ marginBottom: '3rem' }}>
                        Four Powerful <span className="gradient-text">Analytics Tools</span>
                    </h2>
                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <Link key={i} to={f.to} className="feature-card card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                                <span className="feature-link">Explore →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Top countries strip ── */}
            <section className="section countries-strip">
                <div className="container">
                    <h2 className="section-title text-center mb-6">Nations Covered</h2>
                    <div className="flag-row">
                        {['🇮🇳 India', '🇵🇰 Pakistan', '🇱🇰 Sri Lanka', '🇧🇩 Bangladesh', '🇦🇫 Afghanistan', '🇭🇰 Hong Kong', '🇴🇲 Oman', '🇦🇪 UAE'].map(c => (
                            <div key={c} className="flag-chip glass">{c}</div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="hero-footer">
                <div className="container text-center text-muted text-sm">
                    <p>Built for Dev Season of Code 2026 · Asia Cup data (1984–2022) · All-format analytics</p>
                </div>
            </footer>
        </main>
    )
}
