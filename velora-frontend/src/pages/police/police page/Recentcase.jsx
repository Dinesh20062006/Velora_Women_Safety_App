import { useEffect, useState, useCallback } from "react";
import UserLayout from "./UserLayout";
import {
  getAllPoliceIncidents,
  getRegisteredPoliceOfficers,
  updateCaseStatus,
  assignPoliceOfficerToCase
} from "../../../api/policeApi";
import {
  escalateCaseToAdmin,
  getEscalatedPoliceCases
} from "../../../api/adminApi";
import {
  downloadIndividualEReport,
  downloadFullCaseHistoryReport
} from "../../../utils/reportExporter";
import {
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoCloseOutline,
  IoImageOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoTimeOutline
} from "react-icons/io5";

// Default seed cases if backend returns empty or is offline
const DEFAULT_FALLBACK_CASES = [
  {
    complaintId: 101,
    id: 101,
    userName: "Ananya Sharma",
    phoneNumber: "+91 98765 43210",
    title: "Suspicious Stalking near Bus Stand",
    description: "Reported an unknown individual following near the bus terminus around late evening hours. Immediate patrol intervention requested.",
    category: "STALKING",
    location: "Sector 14 Bus Terminal, Main Road",
    status: "PENDING",
    assignedOfficerId: "",
    assignedOfficerName: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    complaintId: 102,
    id: 102,
    userName: "Priya Venkatesh",
    phoneNumber: "+91 98451 22334",
    title: "Verbal Harassment in Commercial Hub",
    description: "Group of individuals engaging in harassment outside tech park entrance. Officer dispatched.",
    category: "HARASSMENT",
    location: "Tech Park Phase 2, Ring Road",
    status: "UNDER_INVESTIGATION",
    assignedOfficerId: "1",
    assignedOfficerName: "Inspector Rajesh Kumar",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    complaintId: 103,
    id: 103,
    userName: "Divya Nair",
    phoneNumber: "+91 97112 33445",
    title: "Poorly Lit Alleyway Safety Concern",
    description: "Defective streetlights and non-functional CCTV cameras leading to suspicious loitering at night.",
    category: "UNSAFE_AREA",
    location: "Cross Road 5, Gandhi Nagar",
    status: "RESOLVED",
    assignedOfficerId: "2",
    assignedOfficerName: "Sub-Inspector Suresh",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }
];

function RecentCases() {
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null); // Case details modal
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [officerFilter, setOfficerFilter] = useState("ALL");
  const [evidenceFilter, setEvidenceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [escalatedCaseIds, setEscalatedCaseIds] = useState([]);

  // Load escalated cases from Admin storage
  useEffect(() => {
    try {
      const list = getEscalatedPoliceCases();
      const ids = (list || []).map((c) => String(c.id || c.complaintId));
      setEscalatedCaseIds(ids);
    } catch (e) {
      console.warn("Could not read escalated cases", e);
    }
  }, []);

  const fetchOfficers = async () => {
    try {
      const list = await getRegisteredPoliceOfficers();
      if (list && list.length > 0) {
        setOfficers(list);
      } else {
        // Fallback demo officers
        setOfficers([
          { id: "1", policeId: "1", name: "Inspector Rajesh Kumar", badgeNumber: "TN-401" },
          { id: "2", policeId: "2", name: "Sub-Inspector Suresh", badgeNumber: "TN-402" },
          { id: "3", policeId: "3", name: "Officer Meera Krishnan", badgeNumber: "TN-405" }
        ]);
      }
    } catch (e) {
      console.error("Failed to load police officers", e);
    }
  };

  const fetchCases = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }
    try {
      const res = await getAllPoliceIncidents();
      const data = res?.data || res?.content || res;
      let rawList = [];
      if (Array.isArray(data) && data.length > 0) {
        rawList = data;
      } else if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
        rawList = data.content;
      } else {
        rawList = DEFAULT_FALLBACK_CASES;
      }

      const sorted = [...rawList].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.createdDate || a.timestamp || 0).getTime() || 0;
        const dateB = new Date(b.createdAt || b.createdDate || b.timestamp || 0).getTime() || 0;
        if (dateA && dateB && dateA !== dateB) return dateB - dateA;
        const idA = Number(String(a.complaintId || a.id || "").replace(/\D/g, "")) || 0;
        const idB = Number(String(b.complaintId || b.id || "").replace(/\D/g, "")) || 0;
        return idB - idA;
      });

      setCases(sorted);
    } catch (e) {
      console.error("Failed to fetch cases", e);
      setCases((prev) => (prev && prev.length > 0 ? prev : DEFAULT_FALLBACK_CASES));
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchCases(true);
    fetchOfficers();

    const interval = setInterval(() => {
      fetchCases(false);
    }, 10000); // Background sync every 10s

    return () => clearInterval(interval);
  }, [fetchCases]);

  // Handle live status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCaseStatus(id, newStatus);
      setCases((prev) =>
        prev.map((c) => {
          const cId = c.complaintId || c.id;
          return String(cId) === String(id) ? { ...c, status: newStatus } : c;
        })
      );
      if (selectedCase && String(selectedCase.complaintId || selectedCase.id) === String(id)) {
        setSelectedCase((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update case status:", err);
      alert("Failed to update case status");
    }
  };

  // Handle officer assignment
  const handleAssignOfficer = async (caseId, officerId) => {
    const selectedOfficer = officers.find(
      (o) => String(o.id || o.policeId) === String(officerId)
    );
    const officerName = selectedOfficer ? selectedOfficer.name : "";
    try {
      await assignPoliceOfficerToCase(caseId, officerId, officerName);
      setCases((prev) =>
        prev.map((c) => {
          const cId = c.complaintId || c.id;
          return String(cId) === String(caseId)
            ? { ...c, assignedOfficerId: officerId, assignedOfficerName: officerName, assignedOfficer: officerId }
            : c;
        })
      );
      if (selectedCase && String(selectedCase.complaintId || selectedCase.id) === String(caseId)) {
        setSelectedCase((prev) => ({
          ...prev,
          assignedOfficerId: officerId,
          assignedOfficerName: officerName,
          assignedOfficer: officerId
        }));
      }
    } catch (err) {
      console.error("Failed to assign police officer:", err);
      alert("Failed to assign officer");
    }
  };

  // Handle escalation to admin
  const handleSendToAdmin = async (item) => {
    const cId = item.complaintId || item.id;
    try {
      await escalateCaseToAdmin(item);
      setEscalatedCaseIds((prev) => [...new Set([...prev, String(cId)])]);
      setCases((prev) =>
        prev.map((c) => {
          const id = c.complaintId || c.id;
          return String(id) === String(cId) ? { ...c, status: "SENT_TO_ADMIN" } : c;
        })
      );
      alert(`Case INC-${cId} has been successfully escalated to Admin Portal!`);
    } catch (err) {
      console.error("Failed to send case to Admin:", err);
      alert("Failed to send case to Admin");
    }
  };

  // Filtering & Sorting
  const filteredCases = cases
    .filter((item) => {
      const status = (item.status || "PENDING").toUpperCase();
      const isPending = status === "PENDING" || status === "SUBMITTED";
      const isInvestigating = status === "UNDER_INVESTIGATION" || status === "IN_PROGRESS" || status === "ASSIGNED";
      const isSentAdmin = status === "SENT_TO_ADMIN" || status === "ESCALATED";
      const isResolved = status === "RESOLVED";

      if (statusFilter === "PENDING" && !isPending) return false;
      if (statusFilter === "UNDER_INVESTIGATION" && !isInvestigating) return false;
      if (statusFilter === "SENT_TO_ADMIN" && !isSentAdmin) return false;
      if (statusFilter === "RESOLVED" && !isResolved) return false;

      const cat = (item.category || item.type || "GENERAL").toUpperCase();
      if (categoryFilter !== "ALL" && cat !== categoryFilter) return false;

      const currentOfficer = String(item.assignedOfficerId || item.assignedOfficer || item.officerId || "");
      if (officerFilter === "UNASSIGNED" && currentOfficer !== "") return false;
      if (officerFilter !== "ALL" && officerFilter !== "UNASSIGNED" && currentOfficer !== String(officerFilter)) return false;

      const hasPhoto = Boolean(item.imageUrl);
      if (evidenceFilter === "WITH_PHOTO" && !hasPhoto) return false;
      if (evidenceFilter === "WITHOUT_PHOTO" && hasPhoto) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cId = String(item.complaintId || item.id || "");
        const name = String(item.userName || item.title || item.victimName || "").toLowerCase();
        const loc = typeof item.location === "object" ? String(item.location?.address || "") : String(item.location || item.address || "");
        return cId.includes(q) || name.includes(q) || cat.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || a.createdDate || a.timestamp || 0).getTime() || 0;
      const timeB = new Date(b.createdAt || b.createdDate || b.timestamp || 0).getTime() || 0;
      if (timeA && timeB && timeA !== timeB) {
        return sortBy === "OLDEST" ? timeA - timeB : timeB - timeA;
      }
      const idA = Number(String(a.complaintId || a.id || "").replace(/\D/g, "")) || 0;
      const idB = Number(String(b.complaintId || b.id || "").replace(/\D/g, "")) || 0;
      if (sortBy === "OLDEST") return idA - idB;
      return idB - idA;
    });

  const categories = Array.from(
    new Set(cases.map((c) => (c.category || c.type || "GENERAL").toUpperCase()))
  );

  return (
    <UserLayout>
      <div className="casePage">
        {/* Top Header */}
        <div className="top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1>Recent Cases</h1>
            <p>AI Women's Safety Incident Records, Investigation & Case Dispatch</p>
          </div>

          <button
            type="button"
            onClick={() => downloadFullCaseHistoryReport(cases, officers)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.4)",
              transition: "all 0.2s"
            }}
          >
            <IoDownloadOutline style={{ fontSize: "17px" }} /> Export Full Case History Report
          </button>
        </div>

        {/* Statistical Summary Cards */}
        <div className="caseCards">
          <div className="caseCard">
            <h3>Total Cases</h3>
            <h1>{cases.length}</h1>
            <p>Live Database Records</p>
          </div>

          <div className="caseCard redCard">
            <h3>Pending Attention</h3>
            <h1>
              {
                cases.filter((c) => {
                  const s = (c.status || "").toUpperCase();
                  return s === "PENDING" || s === "SUBMITTED";
                }).length
              }
            </h1>
            <p>Need Immediate Response</p>
          </div>

          <div className="caseCard">
            <h3>Active Investigation</h3>
            <h1>
              {
                cases.filter((c) => {
                  const st = (c.status || "").toUpperCase();
                  return st === "UNDER_INVESTIGATION" || st === "IN_PROGRESS" || st === "ASSIGNED";
                }).length
              }
            </h1>
            <p>In Progress with Officers</p>
          </div>

          <div className="caseCard">
            <h3>Resolved</h3>
            <h1>{cases.filter((c) => (c.status || "").toUpperCase() === "RESOLVED").length}</h1>
            <p>Completed Cases</p>
          </div>
        </div>

        {/* Main Records Table Box */}
        <div className="tableBox" style={{ background: "#111827", padding: "24px", borderRadius: "12px", border: "1px solid #374151", marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <h2 style={{ color: "#f9fafb", margin: 0, fontSize: "18px" }}>
              Case Records Database ({filteredCases.length})
            </h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="🔍 Search Case ID, Name, Location, Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#1f2937",
                border: "1px solid #374151",
                color: "#f3f4f6",
                fontSize: "14px",
                outline: "none",
                minWidth: "280px"
              }}
            />
          </div>

          {/* Filter Bar Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", padding: "12px 0 16px 0", borderTop: "1px solid #1f2937", borderBottom: "1px solid #1f2937", marginBottom: "16px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "700", textTransform: "uppercase" }}>Filters:</span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="ALL">📌 All Statuses</option>
              <option value="PENDING">🔴 Pending</option>
              <option value="UNDER_INVESTIGATION">🟡 Investigating</option>
              <option value="SENT_TO_ADMIN">🟣 Sent to Admin</option>
              <option value="RESOLVED">🟢 Resolved</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="ALL">📁 All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Officer Filter */}
            <select
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="ALL">👮 All Officers</option>
              <option value="UNASSIGNED">⚠️ Unassigned Only</option>
              {officers.map((o) => (
                <option key={o.id || o.policeId} value={o.id || o.policeId}>{o.name}</option>
              ))}
            </select>

            {/* Evidence Filter */}
            <select
              value={evidenceFilter}
              onChange={(e) => setEvidenceFilter(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", fontSize: "13px", cursor: "pointer" }}
            >
              <option value="ALL">📷 All Evidence Types</option>
              <option value="WITH_PHOTO">🖼️ With Photo Only</option>
              <option value="WITHOUT_PHOTO">🚫 Without Photo</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", background: "#1f2937", border: "1px solid #374151", color: "#60a5fa", fontSize: "13px", cursor: "pointer", fontWeight: "600", marginLeft: "auto" }}
            >
              <option value="NEWEST">⚡ Newest Cases First</option>
              <option value="OLDEST">⏳ Oldest Cases First</option>
            </select>
          </div>

          {loading ? (
            <p style={{ color: "#9ca3af", padding: "20px 0" }}>Synchronizing incident records from database...</p>
          ) : filteredCases.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No incident cases matching the filter criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                  setOfficerFilter("ALL");
                  setEvidenceFilter("ALL");
                  setSearchQuery("");
                }}
                style={{
                  background: "#374151",
                  color: "#f3f4f6",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #374151", color: "#9ca3af", fontSize: "13px" }}>
                    <th style={{ padding: "14px" }}>Case ID</th>
                    <th style={{ padding: "14px" }}>Victim / Title</th>
                    <th style={{ padding: "14px" }}>Category</th>
                    <th style={{ padding: "14px" }}>Location</th>
                    <th style={{ padding: "14px" }}>Status</th>
                    <th style={{ padding: "14px" }}>Assigned Officer</th>
                    <th style={{ padding: "14px" }}>Evidence</th>
                    <th style={{ padding: "14px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((item, index) => {
                    const cId = item.complaintId || item.id || index + 1;
                    const loc = typeof item.location === "object" ? (item.location?.address || item.location?.city) : (item.location || item.address || "Location recorded");
                    const currentStatus = (item.status || "PENDING").toUpperCase();
                    const currentOfficer = item.assignedOfficerId || item.assignedOfficer || item.officerId || "";
                    const assignedOfficerObj = officers.find((o) => String(o.id || o.policeId) === String(currentOfficer));
                    const assignedOfficerName = assignedOfficerObj ? assignedOfficerObj.name : (item.assignedOfficerName || "");
                    const isEscalated = escalatedCaseIds.includes(String(cId)) || currentStatus === "SENT_TO_ADMIN" || currentStatus === "ESCALATED";

                    return (
                      <tr key={`case-${cId}-${index}`} style={{ borderBottom: "1px solid #374151", color: "#e5e7eb" }}>
                        {/* ID */}
                        <td style={{ padding: "14px", fontWeight: "700", color: "#60a5fa" }}>
                          INC-{cId}
                        </td>

                        {/* Title & Reporter */}
                        <td style={{ padding: "14px" }}>
                          <div style={{ fontWeight: "600", color: "#f9fafb" }}>
                            {item.userName || item.title || item.victimName || "Citizen User"}
                          </div>
                          {item.title && item.userName && (
                            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                              {item.title}
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td style={{ padding: "14px" }}>
                          <span style={{ background: "#374151", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#f3f4f6", fontWeight: "600" }}>
                            {item.category || item.type || "HARASSMENT"}
                          </span>
                        </td>

                        {/* Location */}
                        <td style={{ padding: "14px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={loc}>
                          📍 {loc}
                        </td>

                        {/* Status Selector */}
                        <td style={{ padding: "14px" }}>
                          <select
                            value={currentStatus === "SUBMITTED" ? "PENDING" : currentStatus}
                            onChange={(e) => handleStatusChange(cId, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                              border: "none",
                              outline: "none",
                              background:
                                currentStatus === "RESOLVED"
                                  ? "rgba(16, 185, 129, 0.2)"
                                  : currentStatus === "UNDER_INVESTIGATION" || currentStatus === "IN_PROGRESS" || currentStatus === "ASSIGNED"
                                  ? "rgba(245, 158, 11, 0.2)"
                                  : isEscalated
                                  ? "rgba(168, 85, 247, 0.2)"
                                  : "rgba(239, 68, 68, 0.2)",
                              color:
                                currentStatus === "RESOLVED"
                                  ? "#10b981"
                                  : currentStatus === "UNDER_INVESTIGATION" || currentStatus === "IN_PROGRESS" || currentStatus === "ASSIGNED"
                                  ? "#f59e0b"
                                  : isEscalated
                                  ? "#c084fc"
                                  : "#ef4444"
                            }}
                          >
                            <option value="PENDING" style={{ background: "#111827", color: "#ef4444" }}>PENDING</option>
                            <option value="UNDER_INVESTIGATION" style={{ background: "#111827", color: "#f59e0b" }}>INVESTIGATING</option>
                            <option value="RESOLVED" style={{ background: "#111827", color: "#10b981" }}>RESOLVED</option>
                            <option value="SENT_TO_ADMIN" style={{ background: "#111827", color: "#c084fc" }}>SENT TO ADMIN</option>
                          </select>
                        </td>

                        {/* Officer Assignment Dropdown */}
                        <td style={{ padding: "14px" }}>
                          <select
                            value={currentOfficer || ""}
                            onChange={(e) => handleAssignOfficer(cId, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: "#1f2937",
                              border: "1px solid #374151",
                              color: currentOfficer ? "#10b981" : "#ef4444",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              maxWidth: "160px"
                            }}
                          >
                            <option value="" style={{ color: "#ef4444" }}>⚠️ Assign Officer</option>
                            {officers.map((o) => (
                              <option key={o.id || o.policeId} value={o.id || o.policeId} style={{ color: "#f3f4f6" }}>
                                {o.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Photo Evidence */}
                        <td style={{ padding: "14px" }}>
                          {item.imageUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewImage({
                                  url: item.imageUrl,
                                  caseId: cId,
                                  title: item.userName || item.title || item.victimName || "Citizen User",
                                  category: item.category || item.type || "Incident Evidence",
                                  location: loc
                                })
                              }
                              style={{
                                background: "rgba(59, 130, 246, 0.15)",
                                border: "1px solid #3b82f6",
                                color: "#60a5fa",
                                fontWeight: "600",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                cursor: "pointer",
                                fontSize: "12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <IoImageOutline /> Photo
                            </button>
                          ) : (
                            <span style={{ color: "#6b7280", fontSize: "12px" }}>No Photo</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "6px" }}>
                            {/* View Details Modal Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedCase({ ...item, assignedOfficerName: assignedOfficerName || "Unassigned" })}
                              title="View Full Case Details"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                background: "#1f2937",
                                color: "#f3f4f6",
                                border: "1px solid #4b5563",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                            >
                              <IoEyeOutline style={{ fontSize: "14px" }} /> Details
                            </button>

                            {/* Download Individual E-Report */}
                            <button
                              type="button"
                              onClick={() => downloadIndividualEReport(item, assignedOfficerName || "Unassigned")}
                              title="Download Official PDF/HTML E-Report"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                background: "rgba(37, 99, 235, 0.15)",
                                color: "#60a5fa",
                                border: "1px solid #2563eb",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                            >
                              <IoDocumentTextOutline style={{ fontSize: "14px" }} /> E-Report
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 99998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setSelectedCase(null)}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "650px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "14px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ margin: 0, color: "#f9fafb", fontSize: "18px" }}>
                  Incident Dossier: INC-{selectedCase.complaintId || selectedCase.id}
                </h3>
                <span style={{ background: "#374151", color: "#60a5fa", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700" }}>
                  {selectedCase.category || selectedCase.type || "HARASSMENT"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                style={{
                  background: "#1f2937",
                  color: "#9ca3af",
                  border: "1px solid #374151",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <IoCloseOutline style={{ fontSize: "18px" }} />
              </button>
            </div>

            {/* Grid Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              <div style={{ background: "#1f2937", padding: "12px", borderRadius: "8px", border: "1px solid #374151" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700" }}>
                  <IoPersonOutline style={{ marginRight: "4px" }} /> Complainant / Victim
                </div>
                <div style={{ color: "#f9fafb", fontWeight: "600", marginTop: "4px" }}>
                  {selectedCase.userName || selectedCase.victimName || selectedCase.title || "Citizen User"}
                </div>
                <div style={{ color: "#60a5fa", fontSize: "12px", marginTop: "2px" }}>
                  {selectedCase.phoneNumber || "+91 98765 43210"}
                </div>
              </div>

              <div style={{ background: "#1f2937", padding: "12px", borderRadius: "8px", border: "1px solid #374151" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700" }}>
                  <IoTimeOutline style={{ marginRight: "4px" }} /> Incident Timestamp
                </div>
                <div style={{ color: "#f9fafb", fontWeight: "600", marginTop: "4px" }}>
                  {(selectedCase.createdAt || selectedCase.createdDate) ? new Date(selectedCase.createdAt || selectedCase.createdDate).toLocaleString() : "Recently"}
                </div>
              </div>

              <div style={{ background: "#1f2937", padding: "12px", borderRadius: "8px", border: "1px solid #374151", gridColumn: "span 2" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700" }}>
                  <IoLocationOutline style={{ marginRight: "4px" }} /> Incident Location
                </div>
                <div style={{ color: "#f9fafb", fontWeight: "600", marginTop: "4px" }}>
                  {typeof selectedCase.location === "object" ? (selectedCase.location?.address || selectedCase.location?.city) : (selectedCase.location || selectedCase.address || "Recorded Location")}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: "#1f2937", padding: "14px", borderRadius: "8px", border: "1px solid #374151", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700", marginBottom: "6px" }}>
                Incident Description & Narrative
              </div>
              <p style={{ color: "#e5e7eb", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                {selectedCase.description || "No specific incident description recorded."}
              </p>
            </div>

            {/* Evidence Image Attachment */}
            {selectedCase.imageUrl && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase", fontWeight: "700", marginBottom: "6px" }}>
                  Photo Evidence Attachment
                </div>
                <div style={{ background: "#030712", padding: "10px", borderRadius: "8px", border: "1px solid #374151", textAlign: "center" }}>
                  <img
                    src={selectedCase.imageUrl}
                    alt="Evidence"
                    style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "6px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => downloadIndividualEReport(selectedCase, selectedCase.assignedOfficerName)}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <IoDocumentTextOutline /> Download E-Report
              </button>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                style={{
                  background: "#374151",
                  color: "#f3f4f6",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(3, 7, 18, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "700px",
              width: "90%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid #1f2937", paddingBottom: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 style={{ color: "#f9fafb", margin: 0, fontSize: "18px", fontWeight: "700" }}>
                    Evidence Photo — INC-{previewImage.caseId}
                  </h3>
                  <span style={{ background: "#374151", color: "#60a5fa", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                    {previewImage.category}
                  </span>
                </div>
                <p style={{ color: "#9ca3af", margin: "6px 0 0 0", fontSize: "13px" }}>
                  Reporter: <strong>{previewImage.title}</strong> | 📍 {previewImage.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{
                  background: "#1f2937",
                  color: "#9ca3af",
                  border: "1px solid #374151",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Image Container */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#030712", borderRadius: "12px", padding: "16px", overflow: "hidden", border: "1px solid #1f2937", minHeight: "250px" }}>
              <img
                src={previewImage.url}
                alt={`Evidence for INC-${previewImage.caseId}`}
                style={{ maxWidth: "100%", maxHeight: "55vh", objectFit: "contain", borderRadius: "8px" }}
              />
            </div>

            {/* Actions */}
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{
                  background: "#3b82f6",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default RecentCases;