/* Header.jsx
   Application header with title and action buttons. */
import React from "react";

// PUBLIC_INTERFACE
export default function Header({ username, onNewGame, onChangeUser, apiConfigured }) {
  /** Header with app title, user info, and actions. */
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-accent">Tic</span> Tac <span className="brand-accent">Toe</span>
      </div>
      <div className="header-actions">
        {!apiConfigured ? (
          <span className="warning-badge" title="Backend not configured">
            Backend URL missing
          </span>
        ) : null}
        <span className="user-chip" title="Current player">
          👤 {username || "Guest"}
        </span>
        <button className="btn" onClick={onChangeUser} aria-label="Change user">
          Change User
        </button>
        <button className="btn primary" onClick={onNewGame} disabled={!apiConfigured} aria-label="Start new game">
          New Game
        </button>
      </div>
    </header>
  );
}
