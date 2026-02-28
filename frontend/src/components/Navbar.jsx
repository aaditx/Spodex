import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

const links = [
    { to: '/players', label: 'Players' },
    { to: '/compare', label: 'Compare' },
    { to: '/dream-team', label: 'Dream Team' },
    { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setOpen(false) }, [pathname])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🏏</span>
                    <span className="brand-name">Spodex</span>
                </Link>

                <div className={`navbar-links ${open ? 'open' : ''}`}>
                    {links.map(l => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </div>

                <button
                    className="hamburger"
                    aria-label="Toggle menu"
                    onClick={() => setOpen(o => !o)}
                >
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    )
}
