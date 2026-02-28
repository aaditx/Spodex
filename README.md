# Spodex

Spodex is a comprehensive cricket analytics platform designed to provide insights, comparisons, and visualizations for cricket players and teams. The project consists of a Python backend for data processing and a modern React frontend for user interaction.

## Features

- **Player Comparison:** Compare stats and performance of different players across formats (ODI, T20I).
- **Dream Team Builder:** Create and analyze your ideal cricket team based on player data.
- **Leaderboard:** View top performers and rankings for batsmen, bowlers, and wicketkeepers.
- **Player Profiles:** Detailed statistics and career highlights for individual players.
- **Data Visualization:** Interactive charts and tables for better understanding of player and team metrics.

## Project Structure

```
Spodex/
├── app.py                  # Main backend application
├── data_proccessing.py     # Data processing logic
├── master_player_table.csv # Master player data
├── master_table.py         # Master table logic
├── requirements.txt        # Python dependencies
├── archive/                # Historical and raw data CSVs
│   ├── batsman data odi.csv
│   ├── batsman data t20i.csv
│   ├── bowler data odi.csv
│   ├── bowler data t20i.csv
│   ├── champion.csv
│   ├── wicketkeeper data odi.csv
│   └── wicketkeeper data t20i.csv
└── frontend/               # React frontend
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    └── src/
        ├── api.js
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── Navbar.css
        │   ├── Navbar.jsx
        │   ├── PlayerCard.css
        │   └── PlayerCard.jsx
        └── pages/
            ├── Compare.css
            ├── Compare.jsx
            ├── DreamTeam.css
            ├── DreamTeam.jsx
            ├── Hero.css
            ├── Hero.jsx
            ├── Leaderboard.css
            ├── Leaderboard.jsx
            ├── PlayerProfile.css
            ├── PlayerProfile.jsx
            ├── Players.css
            └── Players.jsx
```

## Backend (Python)
- **app.py:** Main entry point for the backend server (Flask or FastAPI recommended).
- **data_proccessing.py:** Handles data cleaning, transformation, and analytics.
- **master_table.py:** Manages master player data and integrates with CSVs in the archive.
- **Requirements:**
  - Install dependencies with: `pip install -r requirements.txt`

## Frontend (React + Vite)
- **src/components:** Reusable UI components (Navbar, PlayerCard, etc.)
- **src/pages:** Main pages for the app (Compare, DreamTeam, Leaderboard, etc.)
- **api.js:** Handles API requests to the backend.
- **Setup:**
  - Install dependencies: `npm install`
  - Start development server: `npm run dev`

## Data Sources
- Player and match data stored in CSV files under the `archive/` directory.
- Master player table for unified player information.

## How to Run

### Backend
1. Create and activate a Python virtual environment:
   ```
   python -m venv .venv
   .venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```
   python app.py
   ```

### Frontend
1. Navigate to the `frontend/` directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Contributing
- Fork the repository and create a new branch for your feature or bugfix.
- Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.

## Authors
- Project created by the Spodex Team.

## Contact
For questions or support, please open an issue or contact the maintainers.
