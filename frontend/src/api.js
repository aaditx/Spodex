const BASE = 'http://localhost:5000/api'

export const api = {
    players: (params = {}) => {
        const q = new URLSearchParams(params).toString()
        return fetch(`${BASE}/players${q ? '?' + q : ''}`).then(r => r.json())
    },
    player: (name) => fetch(`${BASE}/player/${encodeURIComponent(name)}`).then(r => r.json()),
    compare: (p1, p2) => fetch(`${BASE}/compare?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`).then(r => r.json()),
    dreamTeam: () => fetch(`${BASE}/dream-team`).then(r => r.json()),
    leaderboard: (category, limit = 20) => fetch(`${BASE}/leaderboard?category=${category}&limit=${limit}`).then(r => r.json()),
    countries: () => fetch(`${BASE}/countries`).then(r => r.json()),
    summary: () => fetch(`${BASE}/stats/summary`).then(r => r.json()),
}
