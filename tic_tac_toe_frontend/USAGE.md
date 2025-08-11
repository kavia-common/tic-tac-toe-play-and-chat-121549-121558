# Tic Tac Toe Frontend - Usage

1) Configure environment:
   - Copy `.env.example` to `.env`
   - Set `REACT_APP_API_BASE_URL` to your backend FastAPI URL (no trailing slash)
   - Example:
     ```
     REACT_APP_API_BASE_URL=http://localhost:3001
     ```
     Or for the cloud/dev container (example):
     ```
     REACT_APP_API_BASE_URL=https://vscode-internal-13618-beta.beta01.cloud.kavia.ai:3001
     ```
   - Important: Create React App loads env vars at startup. If you change `.env`, stop and restart `npm start`.

2) Install & run:
   - npm install
   - npm start
   - Visit http://localhost:3000

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
   - Ensure the backend is reachable at the URL you configured. If scores/chat don't load, check:
     - The `.env` file has the correct REACT_APP_API_BASE_URL (no trailing slash).
     - You restarted the dev server after changing `.env`.
     - Backend database connectivity (MongoDB) is properly configured on the backend; otherwise scoreboard endpoints may fail.
