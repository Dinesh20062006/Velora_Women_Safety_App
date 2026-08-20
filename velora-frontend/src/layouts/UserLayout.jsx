import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar/Navbar";
import Sidebar from "../common/Sidebar/Sidebar";
import "../pages/police/police style/index.css";

function UserLayout({ children }) {
  const [collapse, setCollapse] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide AI floating button on the AI Analysis page
  const isAiPage = location.pathname.includes("/ai-analysis");

  return (
    <div className="user-layout" style={{ background: "#0b0f17", minHeight: "100vh", color: "#f3f4f6", position: "relative" }}>
      <Navbar />
      <div className="layout-body" style={{ display: "flex" }}>
        <Sidebar collapse={collapse} setCollapse={setCollapse} />
        <main className="layout-content" style={{ flex: 1, padding: "24px", position: "relative" }}>
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Button (Bottom-Right on all user pages except AI Chat / AI Analytics) */}
      {!isAiPage && (
        <button
          type="button"
          onClick={() => navigate("/ai-analysis", { state: { openChat: true } })}
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #0ea5e9 100%)",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "50px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.5), 0 0 16px rgba(168, 85, 247, 0.4)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            outline: "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(99, 102, 241, 0.7), 0 0 20px rgba(168, 85, 247, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.5), 0 0 16px rgba(168, 85, 247, 0.4)";
          }}
          title="Ask Velora AI Assistant"
        >
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px"
          }}>
            🤖
          </div>
          <span style={{ fontWeight: "700", fontSize: "14px", letterSpacing: "0.4px" }}>Ask AI</span>
        </button>
      )}
    </div>
  );
}

export default UserLayout;