/* App.js
   Main application: handles username "login", game lifecycle, chat panel integration, and scoreboard. */
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import ChatPanel from "./components/ChatPanel";
import Scoreboard from "./components/Scoreboard";
import Header from "./components/Header";
import { createGame, makeMove, getPlayerScore, setPlayerScore, getApiBaseUrl } from "./services/api";

const DEFAULT_BOARD = Array(9).fill("");

// PUBLIC_INTERFACE
function App() {
  /** Root component orchestrating UI and backend interactions. */
  const [username, setUsername] = useState(() => localStorage.getItem("ttt_username") || "");
  const [opponent] = useState("Guest");
  const [game, setGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(() => !localStorage.getItem("ttt_username"));

  const apiConfigured = Boolean(getApiBaseUrl());

  useEffect(() => {
    // Avoid auto-creating game when user not set or API missing
    if (!username || !apiConfigured) return;
    // Autostart a game on first load after login
    if (!game) handleNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, apiConfigured]);

  async function handleNewGame() {
    if (!apiConfigured) return;
    try {
      setLoadingGame(true);
      setError("");
      const g = await createGame(username || "Player X", opponent || "Player O");
      setGame(g);
    } catch (e) {
      setError(`Failed to start game: ${e.message}`);
    } finally {
      setLoadingGame(false);
    }
  }

  function resolveWinnerUsername(gameState) {
    const status = gameState?.status;
    if (status === "x_won") return gameState?.players?.X || "Player X";
    if (status === "o_won") return gameState?.players?.O || "Player O";
    return null;
  }

  async function updateScoreIfNeeded(gameState) {
    const winner = resolveWinnerUsername(gameState);
    if (!winner) return;
    try {
      let current = 0;
      try {
        const s = await getPlayerScore(winner);
        current = typeof s?.score === "number" ? s.score : 0;
      } catch {
        current = 0;
      }
      await setPlayerScore(winner, current + 1);
    } catch (e) {
      // Non-fatal: show banner
      setError(`Failed to update score: ${e.message}`);
      setTimeout(() => setError(""), 4000);
    }
  }

  async function handleCellClick(index) {
    if (!game || loadingGame) return;
    if (game.status && game.status !== "in_progress") return;
    if (game.board[index]) return;

    const player = game.current_player || "X";
    try {
      setLoadingGame(true);
      const res = await makeMove(game.id, index, player);
      setGame(res.game);
      // Did the game end? Update scores
      if (res.game?.status && res.game.status !== "in_progress") {
        updateScoreIfNeeded(res.game);
      }
    } catch (e) {
      setError(`Move error: ${e.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoadingGame(false);
    }
  }

  function handleSubmitLogin(e) {
    e.preventDefault();
    if (!username.trim()) return;
    const name = username.trim();
    localStorage.setItem("ttt_username", name);
    setUsername(name);
    setShowLogin(false);
  }

  function handleChangeUser() {
    setShowLogin(true);
  }

  const board = useMemo(() => game?.board || DEFAULT_BOARD, [game]);
  const status = game?.status || "in_progress";
  const currentPlayer = game?.current_player || "X";

  return (
    <div className="app-root">
      <Header
        username={username}
        onNewGame={handleNewGame}
        onChangeUser={handleChangeUser}
        apiConfigured={apiConfigured}
      />

      {error ? <div className="banner error">{error}</div> : null}
      {!apiConfigured ? (
        <div className="banner warning">
          Missing configuration: please set REACT_APP_API_BASE_URL in a .env file (see .env.example).
        </div>
      ) : null}

      <main className="app-main">
        <section className="board-section card">
          {!game ? (
            <div className="placeholder">
              {loadingGame ? (
                <div className="muted">Starting game...</div>
              ) : (
                <button className="btn primary" onClick={handleNewGame} disabled={!apiConfigured}>
                  Start New Game
                </button>
              )}
            </div>
          ) : (
            <>
              <GameBoard
                board={board}
                onCellClick={handleCellClick}
                disabled={!apiConfigured || loadingGame}
                currentPlayer={currentPlayer}
                status={status}
              />
              <div className="board-actions">
                <button className="btn" onClick={handleNewGame} disabled={!apiConfigured || loadingGame}>
                  Restart
                </button>
                <div className="players-pill">
                  <span className="pill x">X: {game?.players?.X || "Player X"}</span>
                  <span className="pill o">O: {game?.players?.O || "Player O"}</span>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="sidebar">
          <div className="card">
            <Scoreboard highlightUsername={username} disabled={!apiConfigured} />
          </div>
          <div className="card">
            <ChatPanel username={username || "Guest"} gameId={game?.id || null} disabled={!apiConfigured} />
          </div>
        </aside>
      </main>

      {showLogin ? (
        <div className="login-overlay" role="dialog" aria-modal="true" aria-label="Login">
          <form className="login-card" onSubmit={handleSubmitLogin}>
            <h2 className="login-title">Welcome!</h2>
            <p className="login-subtitle">Enter a display name to play</p>
            <input
              type="text"
              className="input"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              aria-label="Your name"
            />
            <button className="btn primary" type="submit">
              Continue
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default App;
