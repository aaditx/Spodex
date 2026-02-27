import pandas as pd
import numpy as np

class PlayerAnalytics:
    def __init__(self, csv_path=None):
        # Use master_player_table.csv by default
        if csv_path is None:
            csv_path = 'master_player_table.csv'
        try:
            self.df = pd.read_csv(csv_path)
        except FileNotFoundError:
            self.df = self._get_dummy_data()

    def _get_dummy_data(self):
        # Minimal fallback data if master table is missing
        return pd.DataFrame({
            'Player': ['Virat Kohli', 'Lasith Malinga'],
            'Country': ['India', 'Sri Lanka'],
            'Matches': [11, 14],
            'Runs': [766, 32],
            'Wickets': [0, 29],
            'Batting Average': [63.83, 5.33],
            'Economy Rate': [0.0, 4.65],
            'Role': ['Batsman', 'Bowler']
        })

    def get_player_names(self):
        return self.df['Player'].dropna().unique().tolist()

    def get_player_stats(self, player_name):
        player_rows = self.df[self.df['Player'] == player_name]
        if not player_rows.empty:
            return player_rows.iloc[0]
        else:
            return None

    def generate_insights(self, player_data):
        pros = []
        cons = []

        # Use flexible column names for master table
        batting_avg = player_data.get('Batting Average') or player_data.get('Batting_Avg') or 0
        wickets = player_data.get('Wickets', 0)
        economy = player_data.get('Economy Rate') or player_data.get('Economy') or 0

        # Rule 1: Elite Batting
        try:
            if float(batting_avg) > 50:
                pros.append("Elite batter: Averages over 50 in the tournament.")
            elif float(batting_avg) < 20 and float(wickets) < 5:
                cons.append("Lower-order batter or out of form.")
        except Exception:
            pass

        # Rule 2: Lethal Bowling
        try:
            if float(wickets) > 15:
                pros.append("Proven match-winner with the ball in subcontinental conditions.")
        except Exception:
            pass

        # Rule 3: Economy Check
        try:
            if float(economy) > 6.0 and float(wickets) > 0:
                cons.append("Can leak runs; high economy rate.")
        except Exception:
            pass

        # Fallbacks
        if not pros:
            pros.append("Solid squad player.")
        if not cons:
            cons.append("No glaring statistical weaknesses in this format.")
        return pros, cons