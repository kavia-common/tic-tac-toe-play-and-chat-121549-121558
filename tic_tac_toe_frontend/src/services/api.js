/// services/api.js
/// API client for Tic Tac Toe backend.
/// Uses REACT_APP_API_BASE_URL from environment to configure the base URL.
/// All functions return parsed JSON or throw an error with a message for the caller to handle.

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Build a full URL from a path (e.g., "/games")
 * Throws a clear error if BASE_URL is not configured.
 */
function buildUrl(path) {
  if (!BASE_URL) {
    throw new Error("Frontend not configured: REACT_APP_API_BASE_URL is missing.");
  }
  return `${BASE_URL}${path}`;
}

/**
 * Internal helper to handle fetch responses.
 */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      if (isJson) {
        const data = await res.json();
        detail = (data && (data.detail || data.message)) || detail;
      } else {
        const text = await res.text();
        if (text) detail = text;
      }
    } catch (e) {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return isJson ? res.json() : res.text();
}

// PUBLIC_INTERFACE
/**
 * Create a new Tic Tac Toe game on the backend.
 * @param {string} playerX - Username for X
 * @param {string} playerO - Username for O
 * @returns {Promise<object>} GameOut
 */
export async function createGame(playerX, playerO) {
  /** Create a game with player names. */
  const res = await fetch(buildUrl("/games"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_x: playerX || "Player X",
      player_o: playerO || "Player O",
    }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Retrieve an existing game by id.
 * @param {string} gameId
 * @returns {Promise<object>} GameOut
 */
export async function getGame(gameId) {
  /** Fetch game state by id. */
  const res = await fetch(buildUrl(`/games/${encodeURIComponent(gameId)}`));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Submit a move for the given game.
 * @param {string} gameId
 * @param {number} position - Board index 0..8
 * @param {"X"|"O"} player - Which player is playing this move
 * @returns {Promise<object>} MoveResponse
 */
export async function makeMove(gameId, position, player) {
  /** Submit a move to the backend and receive the updated game state. */
  const res = await fetch(buildUrl(`/games/${encodeURIComponent(gameId)}/move`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position, player }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Get top scores list.
 * @param {number} [limit=10]
 * @returns {Promise<Array<{username:string, score:number}>>}
 */
export async function getTopScores(limit = 10) {
  /** Retrieve top N player scores. */
  const url = new URL(buildUrl("/scores"));
  if (limit) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString());
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Get score for a player.
 * @param {string} username
 * @returns {Promise<{username:string, score:number}>}
 */
export async function getPlayerScore(username) {
  /** Retrieve score for a given username. */
  const res = await fetch(buildUrl(`/scores/${encodeURIComponent(username)}`));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Set score for a player (overwrite with a value).
 * @param {string} username
 * @param {number} score
 * @returns {Promise<{username:string, score:number}>}
 */
export async function setPlayerScore(username, score) {
  /** Overwrite player score with provided value. */
  const res = await fetch(buildUrl(`/scores/${encodeURIComponent(username)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
/**
 * Send a chat message to the backend AI trash talk endpoint.
 * @param {string} message
 * @param {string|null} gameId
 * @param {string|null} username
 * @returns {Promise<{reply:string}>}
 */
export async function sendChat(message, gameId = null, username = null) {
  /** Send chat message and receive AI reply. */
  const res = await fetch(buildUrl("/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, game_id: gameId || null, username: username || null }),
  });
  return handleResponse(res);
}
