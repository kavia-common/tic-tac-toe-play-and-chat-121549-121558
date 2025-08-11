/* GameBoard.jsx
   A stateless component that renders the Tic Tac Toe board and calls back when a cell is clicked. */
import React from "react";

/**
 * Square cell component
 */
function Cell({ value, onClick, disabled, accent }) {
  const display = value || "";
  return (
    <button
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${display || "empty"}`}
      style={accent ? { boxShadow: "0 0 0 3px var(--color-accent) inset" } : undefined}
    >
      {display}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function GameBoard({ board, onCellClick, disabled, currentPlayer, status }) {
  /** Renders the 3x3 game board. */
  const isDone = status && status !== "in_progress";
  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div className="board-title">Game Board</div>
        <div className="board-status">
          {isDone ? (
            <span className="badge">{status.replace("_", " ").toUpperCase()}</span>
          ) : (
            <span>
              Turn: <strong>{currentPlayer || "-"}</strong>
            </span>
          )}
        </div>
      </div>
      <div className="ttt-grid">
        {board.map((cell, idx) => (
          <Cell
            key={idx}
            value={cell}
            onClick={() => onCellClick(idx)}
            disabled={disabled || Boolean(cell) || isDone}
            accent={false}
          />
        ))}
      </div>
    </div>
  );
}
