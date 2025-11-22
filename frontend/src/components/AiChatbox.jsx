"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AIChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [animatesend, setanimatedsend] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("ai-reply", (reply) => {
      setLoading(false);
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
    });

    return () => {
      socket.off("ai-reply");
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = "Hello! 👋 I'm your smart shopping assistant. How can I help you today? 😊";
      let index = 0;

      const interval = setInterval(() => {
        setMessages([{ from: "ai", text: greeting.slice(0, index) }]);
        index++;

        if (index > greeting.length) {
          clearInterval(interval);
        }
      }, 35);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setanimatedsend(true);
    setTimeout(() => setanimatedsend(false), 450);

    setMessages((prev) => [...prev, { from: "user", text: input }]);

    socket.emit("user-message", input); 

    setInput("");
    setLoading(true);
  };

  return (
    <div
      className="chat-box shadow-lg rounded p-4"
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        backdropFilter: "blur(15px)",
        background: "rgba(255, 255, 255, 0.75)",
        border: "1px solid rgba(255,255,255,0.4)",
        transition: "0.3s",
        borderRadius: "18px"
      }}
    >
      <h4 className="fw-bold text-center mb-4" style={{ color: "#2A2A2A" }}>
        Shopping Assistant
      </h4>

      <div
        className="chat-window mb-3 p-3 rounded"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
          backdropFilter: "blur(12px)",
          height: "260px",
          overflowY: "auto",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          transition: "0.3s ease"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 fade-in ${
              msg.from === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 px-3 rounded-4 shadow-sm ${
                msg.from === "user" ? "text-white" : "text-dark"
              }`}
              style={{
                maxWidth: "75%",
                background:
                  msg.from === "user"
                    ? "rgba(22, 163, 74, 0.9)"
                    : "rgba(255,255,255,0.9)",
                border:
                  msg.from === "user"
                    ? "none"
                    : "1px solid rgba(200,200,200,0.5)",
                transition: "transform .2s"
              }}
            >
              <strong
                className="d-block"
                style={{ fontSize: "0.7rem", opacity: 0.8 }}
              >
                {msg.from === "user" ? "You" : "Assistant"}
              </strong>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-center text-muted fade-in">
            <i>Assistant is typing...</i>
          </p>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Ask about products..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ borderRadius: "12px", border: "1px solid #bbb" }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "linear-gradient(135deg, #32d67b, #1f9e50)",
            border: "none",
            padding: "0.65rem 0.9rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "0.3s"
          }}
          className="shadow-sm"
        >
          <Send size={20} color="white" className={animatesend ? "send-animate" : ""} />
        </button>
      </div>
    </div>
  );
}
