/* Scoreboard.jsx
   Polls the backend top scores and renders a small leaderboard. */
import React, { useEffect, useState } from "react";
import { getTopScores } from "../services/api";

// PUBLIC_INTERFACE
export default function Scoreboard({ highlightUsername, pollInterval = 5000, limit = 10, disabled }) {
  /** Scoreboard that displays top scores and refreshes periodically. */
  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");

  async function fetchScores() {
    try {
      const list = await getTopScores(limit);
      setScores(list || []);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (disabled) return;
    fetchScores();
    const id = setInterval(fetchScores, pollInterval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollInterval, limit, disabled]);

  return (
    <div className="scoreboard">
      <div className="panel-header">
        <div className="panel-title">Scoreboard</div>
      </div>
      {disabled ? (
        <div className="muted">Backend not configured</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <ul className="score-list">
          {scores.map((s, idx) => {
            const isYou =
              highlightUsername &&
              s.username &&
              s.username.toLowerCase() === highlightUsername.toLowerCase();
            return (
              <li key={`${s.username}-${idx}`} className={isYou ? "me" : ""}>
                <span className="rank">{idx + 1}</span>
                <span className="name">{s.username}</span>
                <span className="value">{s.score}</span>
              </li>
            );
          })}
          {scores.length === 0 ? <li className="muted">No scores yet</li> : null}
        </ul>
      )}
    </div>
  );
}
