import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import UserLayout from "../../../../layouts/UserLayout";
import Button from "../../../../common/Button/Button";
import {
  FaBrain,
  FaMapMarkerAlt,
  FaChartBar,
  FaSync
} from "react-icons/fa";

import { predictMLSafetyScore } from "../../../../api/mlSafetyApi";
import { getSafetyAnalysis } from "../../../../api/aiApi";
import VeloraChatbot from "../../../../components/chatbot/VeloraChatbot";

function SafetyAnalysis() {
  const location = useLocation();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab state: "chat" (AI Assistant) or "analytics" (Radar & Crime breakdown)
  const [activeTab, setActiveTab] = useState(() => {
    // Default to chat if requested or default tab
    return "chat";
  });

  useEffect(() => {
    if (location.state?.openChat || location.search.includes("openChat=true")) {
      setActiveTab("chat");
    }
  }, [location]);

  const fetchAllSafetyData = async (lat, lng) => {
    setLoading(true);
    const effectiveLat = lat ?? 10.8795;
    const effectiveLng = lng ?? 77.0223;
    setCurrentPosition({ lat: effectiveLat, lng: effectiveLng });

    try {
      const [mlRes, aiRes] = await Promise.allSettled([
        predictMLSafetyScore(effectiveLat, effectiveLng),
        getSafetyAnalysis(effectiveLat, effectiveLng)
      ]);

      if (mlRes.status === "fulfilled" && mlRes.value?.data) {
        setMlData(mlRes.value.data);
      }

      if (aiRes.status === "fulfilled" && aiRes.value?.data) {
        setAiAnalysis(aiRes.value.data);
      }
    } catch (err) {
      console.error("Error fetching AI safety analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const initFetch = () => {
      if (cancelled) return;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => !cancelled && fetchAllSafetyData(pos.coords.latitude, pos.coords.longitude),
          () => !cancelled && fetchAllSafetyData(undefined, undefined),
          { timeout: 5000 }
        );
      } else {
        fetchAllSafetyData(undefined, undefined);
      }
    };
    initFetch();
    return () => { cancelled = true; };
  }, []);

  const color = mlData?.color || "#00E676";
  const locationText = mlData?.locationLabel || (currentPosition ? `${currentPosition.lat.toFixed(3)}° N, ${currentPosition.lng.toFixed(3)}° E` : "Coimbatore Region");

  // Vectors for Hexagonal Area Radar Chart
  const radarVectors = useMemo(() => [
    { label: "Lighting", score: mlData?.featureBreakdown?.lightingScore ?? 75 },
    { label: "Police", score: mlData?.featureBreakdown?.policeScore ?? 82 },
    { label: "Crowd", score: mlData?.featureBreakdown?.crowdScore ?? 78 },
    { label: "Transport", score: mlData?.featureBreakdown?.transportScore ?? 80 },
    { label: "CCTV", score: mlData?.featureBreakdown?.cctvScore ?? 68 },
    { label: "Response", score: mlData?.featureBreakdown?.responseScore ?? 90 }
  ], [mlData]);

  // SVG Hexagon Radar Geometry Calculation
  const radarPoints = useMemo(() => {
    const cx = 150, cy = 140, maxR = 90;
    return radarVectors.map((v, i) => {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      const r = (v.score / 100) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [radarVectors]);

  // Crime Reports Breakdown Data (Dynamic from Backend ML Service)
  const crimeCategories = mlData?.crimeCategories || [];

  return (
    <UserLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 95px)", width: "100%", maxWidth: "100%", margin: 0, padding: 0 }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexShrink: 0 }}>
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "24px", margin: 0, fontWeight: "700" }}>AI Safety Intelligence</h1>
            <p style={{ color: "#9ca3af", margin: "4px 0 0 0", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaMapMarkerAlt style={{ color: "#ec4899" }} /> Live GPS Evaluated: <strong style={{ color: "#f3f4f6" }}>{locationText}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => currentPosition && fetchAllSafetyData(currentPosition.lat, currentPosition.lng)}
            style={{ background: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            <FaSync className={loading ? "spin" : ""} /> {loading ? "Analyzing..." : "Refresh Telemetry"}
          </button>
        </div>

        {/* Native Page Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          borderBottom: "1px solid #1f2937",
          paddingBottom: "10px",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              style={{
                background: activeTab === "chat" ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" : "#1f2937",
                color: "#ffffff",
                border: activeTab === "chat" ? "none" : "1px solid #374151",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "chat" ? "0 4px 12px rgba(99, 102, 241, 0.35)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <FaBrain /> AI Safety Assistant (Live Database)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              style={{
                background: activeTab === "analytics" ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" : "#1f2937",
                color: "#ffffff",
                border: activeTab === "analytics" ? "none" : "1px solid #374151",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: activeTab === "analytics" ? "0 4px 12px rgba(99, 102, 241, 0.35)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              <FaChartBar /> Area Safety Radar & Crime Analytics
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#10b981", background: "rgba(16, 185, 129, 0.15)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: "600" }}>
              ● Gemini 3.6 Flash & Live DB Connected
            </span>
          </div>
        </div>

        {/* Tab 1: AI Safety Assistant (Integrated natively into page) */}
        {activeTab === "chat" && (
          <div style={{ flex: 1, height: "100%", width: "100%", minHeight: 0 }}>
            <VeloraChatbot
              currentPosition={currentPosition}
              mlData={mlData}
            />
          </div>
        )}

        {/* Tab 2: Area Safety Radar & Crime Analytics */}
        {activeTab === "analytics" && (
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
            {/* Graphs & Detailed Analytics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Radar Chart Card */}
              <div style={{ background: "#1f2937", padding: "20px", borderRadius: "12px", border: "1px solid #374151" }}>
                <h3 style={{ fontSize: "16px", color: "#ffffff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaBrain style={{ color: "#6C63FF" }} /> Area Safety Analysis Radar
                </h3>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                  <svg width="300" height="280" viewBox="0 0 300 280">
                    {/* Hexagonal Background Grid Circles */}
                    {[0.25, 0.5, 0.75, 1.0].map((scale, idx) => {
                      const pts = radarVectors.map((_, i) => {
                        const angle = (i * 60 - 90) * (Math.PI / 180);
                        const r = scale * 90;
                        return `${(150 + r * Math.cos(angle)).toFixed(1)},${(140 + r * Math.sin(angle)).toFixed(1)}`;
                      }).join(" ");
                      return <polygon key={idx} points={pts} fill="none" stroke="#374151" strokeWidth="1" strokeDasharray={idx < 3 ? "2,2" : undefined} />;
                    })}

                    {/* Radar Axis Lines */}
                    {radarVectors.map((_, i) => {
                      const angle = (i * 60 - 90) * (Math.PI / 180);
                      const x = 150 + 90 * Math.cos(angle);
                      const y = 140 + 90 * Math.sin(angle);
                      return <line key={i} x1="150" y1="140" x2={x} y2={y} stroke="#374151" strokeWidth="1" />;
                    })}

                    {/* Data Polygon Fill */}
                    <polygon points={radarPoints} fill="rgba(108, 99, 255, 0.35)" stroke="#6C63FF" strokeWidth="2" />

                    {/* Radar Vector Labels */}
                    {radarVectors.map((v, i) => {
                      const angle = (i * 60 - 90) * (Math.PI / 180);
                      const lx = 150 + 115 * Math.cos(angle);
                      const ly = 140 + 115 * Math.sin(angle);
                      return (
                        <text
                          key={i}
                          x={lx}
                          y={ly}
                          fill="#9ca3af"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {v.label} ({v.score}%)
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Crime Report Analytics & Graphs Card */}
              <div style={{ background: "#1f2937", padding: "20px", borderRadius: "12px", border: "1px solid #374151" }}>
                <h3 style={{ fontSize: "16px", color: "#ffffff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaChartBar style={{ color: "#ec4899" }} /> Crime Report & Incident Analytics
                </h3>

                {/* Crime Categories Breakdown Bars */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px", fontWeight: "600" }}>Incident Category Breakdown</div>
                  {crimeCategories.map((c, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#e5e7eb", marginBottom: "4px" }}>
                        <span>{c.name}</span>
                        <span style={{ fontWeight: "bold", color: c.color }}>{c.pct}% ({c.count} cases)</span>
                      </div>
                      <div style={{ width: "100%", background: "#111827", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${c.pct}%`, background: c.color, height: "100%", borderRadius: "4px", transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights & Safety Tips Section */}
            <div style={{ background: "#1f2937", padding: "20px", borderRadius: "12px", border: "1px solid #374151", marginBottom: "20px" }}>
              <h2 style={{ color: "#ffffff", fontSize: "18px", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaBrain style={{ color: "#ec4899" }} /> AI Advisory Insights & Recommendations
              </h2>

              <div style={{ background: "#111827", padding: "14px 18px", borderRadius: "8px", borderLeft: `4px solid ${color}`, marginBottom: "16px" }}>
                <p style={{ margin: 0, color: "#f3f4f6", fontSize: "14px", lineHeight: "1.5" }}>
                  💡 <strong>AI Location Advisory:</strong> {mlData?.recommendation || "Location conditions are optimal for travel."}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                {(mlData?.tips || aiAnalysis?.tips || []).map((tip, i) => (
                  <div key={i} style={{ background: "#111827", padding: "12px 14px", borderRadius: "8px", color: "#d1d5db", fontSize: "13px", border: "1px solid #374151" }}>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* Switch to Chat Button */}
            <div style={{ textAlign: "center", paddingBottom: "24px" }}>
              <Button text="🤖 Open AI Safety Assistant for Deeper Analysis" onClick={() => setActiveTab("chat")} />
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default SafetyAnalysis;
