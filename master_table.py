import pandas as pd
import glob
import os

archive_folder = 'archive'
output_file = 'master_player_table.csv'
csv_files = glob.glob(os.path.join(archive_folder, '*.csv'))

role_map = {'batsman': 'Batsman', 'bowler': 'Bowler', 'wicketkeeper': 'Wicketkeeper'}
def get_role(filename):
    for key in role_map:
        if key in filename.lower():
            return role_map[key]
    return 'Other'

frames = []
for file in csv_files:
    if 'champion' in file:
        continue
    df = pd.read_csv(file)
    df['Role'] = get_role(file)
    for col in df.columns:
        if 'Player' in col:
            df.rename(columns={col: 'Player'}, inplace=True)
            break
    for col in df.columns:
        if 'Country' in col:
            df.rename(columns={col: 'Country'}, inplace=True)
            break
    frames.append(df)

master_df = pd.concat(frames, ignore_index=True, sort=False)
master_df.to_csv(output_file, index=False)
print(f'Master table created: {output_file}\\nRows: {len(master_df)}\\nColumns: {list(master_df.columns)}')