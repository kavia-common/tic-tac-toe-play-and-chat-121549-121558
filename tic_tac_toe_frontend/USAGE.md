# Tic Tac Toe Frontend - Usage

1) Configure environment:
   - Copy .env.example to .env
   - Set REACT_APP_API_BASE_URL to your backend FastAPI URL (no trailing slash)

2) Install & run:
   - npm install
   - npm start

3) Features:
   - Username prompt on first load (stored locally)
   - Start/restart games with your username as X and "Guest" as O
   - Interactive 3x3 board powered by backend moves
   - Scoreboard (top scores) auto-refreshes every 5s
   - Chat panel sends messages to backend AI trash talk (OpenAI on backend)
   - Responsive layout: board + sidebar on desktop, stacked on mobile

Notes:
   - Score increments by +1 for game winner when a game finishes.
   - Draws do not change scores.
   - If backend URL is not configured, UI will show a banner and disable network actions.
