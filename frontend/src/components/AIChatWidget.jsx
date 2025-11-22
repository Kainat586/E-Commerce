"use client";
import { useState } from "react";
import AIChatBox from "./AiChatbox";// your chat component

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#198754",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          transition: "transform 0.3s",
          zIndex: 2000,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ fontSize: "28px", color: "white" }}>💬</span>
      </div>

      {/* Popup Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "25px",
            width: "350px",
            animation: "fadeIn 0.3s ease-out",
            zIndex: 1500,
          }}
        >
          <AIChatBox />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
