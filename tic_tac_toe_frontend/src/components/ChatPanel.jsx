/* ChatPanel.jsx
   Integrated chat panel that calls the backend AI trash talk endpoint. */
import React, { useState, useRef, useEffect } from "react";
import { sendChat } from "../services/api";

// PUBLIC_INTERFACE
export default function ChatPanel({ username, gameId, disabled }) {
  /** Chat panel that displays messages and sends to backend AI. */
  const [messages, setMessages] = useState([
    { role: "system", text: "Welcome to trash talk! Keep it friendly and fun 😄" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text, username }]);
    setSending(true);
    try {
      const res = await sendChat(text, gameId || null, username || null);
      setMessages((prev) => [...prev, { role: "assistant", text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: `Error: ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-panel">
      <div className="panel-header">
        <div className="panel-title">Chat</div>
      </div>
      <div className="chat-log" aria-live="polite">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-msg ${m.role}`}>
            {m.username ? <span className="chat-username">{m.username}: </span> : null}
            <span>{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={disabled ? "Backend not configured" : "Say something..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || sending}
          aria-label="Chat message input"
        />
        <button className="btn" type="submit" disabled={disabled || sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
