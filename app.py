from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import math

app = Flask(__name__)
CORS(app)

CSV_PATH = 'master_player_table.csv'

def load_data():
    df = pd.read_csv(CSV_PATH)
    # Normalize player names (strip whitespace)
    df['Player'] = df['Player'].str.strip()
    # Fill NaN with None for JSON serialization
    df = df.where(pd.notnull(df), None)
    return df

def safe_float(val):
    if val is None:
        return None
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return None
        return round(f, 2)
    except (ValueError, TypeError):
        return None

def row_to_dict(row):
    result = {}
    for k, v in row.items():
        if isinstance(v, (float, np.floating)):
            result[k] = safe_float(v)
        elif isinstance(v, (np.integer,)):
            result[k] = int(v)
        elif v is None:
            result[k] = None
        else:
            result[k] = v
    return result

def generate_insights(row):
    pros = []
    cons = []
    role = row.get('Role', '')

    batting_avg = safe_float(row.get('Batting Average'))
    wickets = safe_float(row.get('Wickets'))
    economy = safe_float(row.get('Economy Rate'))
    sr = safe_float(row.get('Strike Rate'))
    runs = safe_float(row.get('Runs'))
    centuries = safe_float(row.get('Centuries'))
    dismissals = safe_float(row.get('Dismissals'))
    stumpings = safe_float(row.get('Stumpings'))

    if role in ('Batsman', 'Wicketkeeper'):
        if batting_avg and batting_avg > 50:
            pros.append(f"Elite batter with avg {batting_avg} — world-class consistency.")
        elif batting_avg and batting_avg > 35:
            pros.append(f"Reliable batter averaging {batting_avg}.")
        elif batting_avg and batting_avg < 20:
            cons.append("Below-par batting average for this format.")

        if sr and sr > 120:
            pros.append(f"Explosive strike rate of {sr} — match-winning potential.")
        elif sr and sr < 70:
            cons.append(f"Low strike rate ({sr}) — can be a drag in limited-overs formats.")

        if centuries and centuries >= 3:
            pros.append(f"{int(centuries)} centuries — proven big-match performer.")

        if runs and runs > 600:
            pros.append(f"Tournament top-scorer candidate with {int(runs)} runs.")

    if role == 'Wicketkeeper':
        if dismissals and dismissals >= 30:
            pros.append(f"Outstanding keeper — {int(dismissals)} dismissals in career.")
        if stumpings and stumpings >= 8:
            pros.append(f"{int(stumpings)} stumpings — dangerous against spin.")

    if role in ('Bowler', 'Batsman'):  # allrounders have both
        if wickets and wickets >= 20:
            pros.append(f"Elite wicket-taker — {int(wickets)} tournament wickets.")
        elif wickets and wickets >= 10:
            pros.append(f"Consistent bowler with {int(wickets)} wickets.")

        if economy and economy < 4.0:
            pros.append(f"Miserly economy of {economy} — great for defensive phases.")
        elif economy and economy > 7.0:
            cons.append(f"High economy rate ({economy}) — can concede too many runs.")

    if not pros:
        pros.append("Solid squad contributor.")
    if not cons:
        cons.append("No glaring statistical weaknesses.")

    return pros, cons

def score_batsman(row):
    score = 0
    avg = safe_float(row.get('Batting Average')) or 0
    sr = safe_float(row.get('Strike Rate')) or 0
    runs = safe_float(row.get('Runs')) or 0
    centuries = safe_float(row.get('Centuries')) or 0
    fifties = safe_float(row.get('Fifties')) or 0
    score = avg * 1.5 + sr * 0.5 + runs * 0.1 + centuries * 20 + fifties * 10
    return score

def score_bowler(row):
    wickets = safe_float(row.get('Wickets')) or 0
    economy = safe_float(row.get('Economy Rate')) or 9999
    bowling_avg = safe_float(row.get('Bowling Average')) or 9999
    five_wic = safe_float(row.get('Five Wickets')) or 0
    four_wic = safe_float(row.get('Four Wickets')) or 0
    score = wickets * 15 + (10 - economy) * 10 + (50 - bowling_avg) * 2 + five_wic * 30 + four_wic * 15
    return score

def score_keeper(row):
    dismissals = safe_float(row.get('Dismissals')) or 0
    stumpings = safe_float(row.get('Stumpings')) or 0
    return dismissals * 10 + stumpings * 5

@app.route('/api/stats/summary')
def stats_summary():
    df = load_data()
    summary = {
        'total_players': int(df['Player'].nunique()),
        'total_countries': int(df['Country'].nunique()),
        'total_records': int(len(df)),
        'roles': df['Role'].value_counts().to_dict(),
        'formats_covered': ['ODI', 'T20I'],
    }
    return jsonify(summary)

@app.route('/api/countries')
def countries():
    df = load_data()
    countries_list = sorted(df['Country'].dropna().unique().tolist())
    return jsonify(countries_list)

@app.route('/api/players')
def players():
    df = load_data()
    role = request.args.get('role')
    country = request.args.get('country')
    search = request.args.get('search', '').strip().lower()

    if role:
        df = df[df['Role'].str.lower() == role.lower()]
    if country:
        df = df[df['Country'].str.lower() == country.lower()]
    if search:
        df = df[df['Player'].str.lower().str.contains(search)]

    # Deduplicate: keep highest-runs / highest-wickets record per player
    result = []
    seen = set()
    for _, row in df.iterrows():
        player = row['Player']
        if player not in seen:
            seen.add(player)
            d = row_to_dict(row)
            result.append({
                'name': player,
                'country': row.get('Country'),
                'role': row.get('Role'),
                'matches': safe_float(row.get('Matches')),
                'runs': safe_float(row.get('Runs')),
                'batting_avg': safe_float(row.get('Batting Average')),
                'wickets': safe_float(row.get('Wickets')),
                'economy': safe_float(row.get('Economy Rate')),
                'dismissals': safe_float(row.get('Dismissals')),
            })

    return jsonify(result)

@app.route('/api/player/<path:name>')
def player_detail(name):
    df = load_data()
    name = name.strip()
    rows = df[df['Player'].str.lower() == name.lower()]
    if rows.empty:
        return jsonify({'error': 'Player not found'}), 404

    # Aggregate across multiple entries for the same player
    records = [row_to_dict(r) for _, r in rows.iterrows()]
    # Use first record as base, merge stats
    base = records[0]
    pros, cons = generate_insights(base)

    return jsonify({
        'name': base.get('Player'),
        'country': base.get('Country'),
        'role': base.get('Role'),
        'records': records,
        'insights': {
            'pros': pros,
            'cons': cons,
        }
    })

@app.route('/api/compare')
def compare():
    df = load_data()
    p1_name = request.args.get('p1', '').strip()
    p2_name = request.args.get('p2', '').strip()

    def get_player(name):
        rows = df[df['Player'].str.lower() == name.lower()]
        if rows.empty:
            return None
        row = rows.iloc[0]
        return row_to_dict(row)

    p1 = get_player(p1_name)
    p2 = get_player(p2_name)

    if not p1:
        return jsonify({'error': f'Player "{p1_name}" not found'}), 404
    if not p2:
        return jsonify({'error': f'Player "{p2_name}" not found'}), 404

    # Compute head-to-head score
    def overall_score(r):
        s = 0
        s += (safe_float(r.get('Batting Average')) or 0) * 2
        s += (safe_float(r.get('Strike Rate')) or 0) * 0.5
        s += (safe_float(r.get('Runs')) or 0) * 0.05
        s += (safe_float(r.get('Wickets')) or 0) * 10
        s += (10 - (safe_float(r.get('Economy Rate')) or 10)) * 5
        s += (safe_float(r.get('Dismissals')) or 0) * 5
        return round(s, 1)

    p1['_score'] = overall_score(p1)
    p2['_score'] = overall_score(p2)
    winner = p1.get('Player') if p1['_score'] >= p2['_score'] else p2.get('Player')

    return jsonify({
        'player1': p1,
        'player2': p2,
        'winner': winner,
    })

@app.route('/api/leaderboard')
def leaderboard():
    df = load_data()
    category = request.args.get('category', 'runs')
    limit = int(request.args.get('limit', 20))

    col_map = {
        'runs': ('Runs', False, 'Batsman'),
        'batting_avg': ('Batting Average', False, 'Batsman'),
        'strike_rate': ('Strike Rate', False, 'Batsman'),
        'wickets': ('Wickets', False, 'Bowler'),
        'economy': ('Economy Rate', True, 'Bowler'),  # ascending = best
        'bowling_avg': ('Bowling Average', True, 'Bowler'),
        'dismissals': ('Dismissals', False, 'Wicketkeeper'),
    }

    if category not in col_map:
        return jsonify({'error': f'Unknown category. Use: {list(col_map.keys())}'}), 400

    col, ascending, role = col_map[category]

    filtered = df[df[col].notna()].copy()
    filtered[col] = pd.to_numeric(filtered[col], errors='coerce')
    filtered = filtered.dropna(subset=[col])

    # Sort
    filtered = filtered.sort_values(col, ascending=ascending).head(limit)

    result = []
    for _, row in filtered.iterrows():
        result.append({
            'rank': len(result) + 1,
            'name': row['Player'],
            'country': row.get('Country'),
            'role': row.get('Role'),
            'value': safe_float(row.get(col)),
            'stat': category,
        })

    return jsonify(result)

@app.route('/api/dream-team')
def dream_team():
    df = load_data()

    batsmen_df = df[df['Role'] == 'Batsman'].copy()
    bowlers_df = df[df['Role'] == 'Bowler'].copy()
    keepers_df = df[df['Role'] == 'Wicketkeeper'].copy()

    # Score each group
    batsmen_df['_score'] = batsmen_df.apply(score_batsman, axis=1)
    bowlers_df['_score'] = bowlers_df.apply(score_bowler, axis=1)
    keepers_df['_score'] = keepers_df.apply(score_keeper, axis=1)

    # Remove duplicates (keep best score per player)
    batsmen_df = batsmen_df.sort_values('_score', ascending=False).drop_duplicates('Player')
    bowlers_df = bowlers_df.sort_values('_score', ascending=False).drop_duplicates('Player')
    keepers_df = keepers_df.sort_values('_score', ascending=False).drop_duplicates('Player')

    # Pick top players
    top_batsmen = batsmen_df.head(4).to_dict('records')
    top_bowlers = bowlers_df.head(4).to_dict('records')
    top_allrounders = bowlers_df[bowlers_df['Runs'].notna()].head(2).to_dict('records')  # bowlers who can bat
    top_keeper = keepers_df.head(1).to_dict('records')

    def fmt(r, pos):
        return {
            'name': r['Player'].strip(),
            'country': r.get('Country'),
            'role': r.get('Role'),
            'position': pos,
            'score': round(float(r.get('_score', 0)), 1),
            'key_stat': (
                f"Avg: {safe_float(r.get('Batting Average'))}" if r.get('Role') == 'Batsman'
                else f"Wkts: {safe_float(r.get('Wickets'))}" if r.get('Role') == 'Bowler'
                else f"Dismissals: {safe_float(r.get('Dismissals'))}"
            ),
        }

    team = []
    positions = ['Top Order', 'Top Order', 'Middle Order', 'Lower Order']
    for i, r in enumerate(top_batsmen):
        team.append(fmt(r, positions[i]))

    keeper_positions = ['Wicket-Keeper']
    for i, r in enumerate(top_keeper):
        team.append(fmt(r, keeper_positions[i]))

    bowl_positions = ['Pace Bowler', 'Pace Bowler', 'Spin Bowler', 'Pace Bowler']
    for i, r in enumerate(top_bowlers):
        team.append(fmt(r, bowl_positions[i % len(bowl_positions)]))

    allrounder_positions = ['All-Rounder', 'All-Rounder']
    added_names = {p['name'] for p in team}
    count = 0
    for r in top_allrounders:
        name = r['Player'].strip()
        if name not in added_names and count < 2:
            team.append(fmt(r, allrounder_positions[count]))
            added_names.add(name)
            count += 1

    # Ensure exactly 11
    team = team[:11]

    return jsonify({
        'team': team,
        'total': len(team),
        'captain': team[0]['name'] if team else None,
        'vice_captain': team[1]['name'] if len(team) > 1 else None,
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
