# Spodex


The Tech Stack: Python, Pandas (for data), Plotly (for graphs), Streamlit (for the web app).

Day 1 (Today): The Engine & The Interface
Your only goal today is to load data and display it on a webpage.

Hour 1: The Setup & Data * Initialize the Git repo and invite Suhail.

Jump on Kaggle and grab a clean, ready-to-use dataset (a La Liga or Champions League player stats CSV is perfect to start).

Aditya's Mission (Data Logic):

Write a Python script (data_processor.py) using Pandas to load the CSV, clean any missing numbers, and calculate basic percentiles (e.g., ranking players 1-100 based on stats).

Build the Player OOP class that will eventually hold the logic.

Suhail's Mission (Frontend):

Install Streamlit (pip install streamlit).

Create app.py. Build the basic UI skeleton: a title, a sidebar with a dropdown menu to select a player, and empty columns where the graphs will eventually go.

End of Day Merge: Connect Aditya's cleaned Pandas dataframe to Suhail's Streamlit dropdown. If you select a player and their raw stats print to the screen, Day 1 is a massive success.

Day 2 (Tomorrow): Visuals, Insights & Deployment
Today is about making it look like a real scouting tool.

Aditya's Mission (The Brains):

Write the rule-based engine. Add simple if/else statements to your Player class.

Example: if player.pass_completion > 88: return "Pro: Elite retention under pressure." Keep it to 3-5 simple rules just to prove the concept works.

Suhail's Mission (The Beauty):

Use plotly.express to build one killer visualization. A radar chart (spider web chart) comparing a player's stats (shooting, passing, defending) is the gold standard for sports apps.

Embed that Plotly chart into the Streamlit app.

The Final Countdown (Last 3 Hours):

Merge the code. Make sure selecting a player updates both the radar chart and prints Aditya's automated Pros/Cons.

Deploy it: Go to Streamlit Community Cloud (it's free). Connect it to your GitHub repo, and it will host your app live on the internet in about 2 minutes.
