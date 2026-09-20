import axios from "axios";

const COMPLAINT_URL = import.meta.env.VITE_COMPLAINT_SERVICE_URL || "http://localhost:8088";
const GATEWAY_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, "") : "http://localhost:8080";
const SAFETY_URL = "http://localhost:8083";
const POLICE_URL = "http://localhost:8086";
const ADMIN_URL = "http://localhost:8087";
const ML_URL = import.meta.env.VITE_ML_SERVICE_URL || "http://localhost:8000";

let cachedSnapshot = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache

/**
 * Fetches real live data across all Velora database services
 */
export async function fetchLiveDatabaseSnapshot(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedSnapshot && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedSnapshot;
  }

  const [complaintsRes, safeZonesRes, sosAlertsRes, adminStatsRes] = await Promise.allSettled([
    // 1. Complaints / Incident reports from Complaint microservice or Gateway
    axios.get(`${COMPLAINT_URL}/api/complaints`, { timeout: 2500 })
      .catch(() => axios.get(`${GATEWAY_URL}/api/v1/complaints`, { timeout: 2500 }))
      .catch(() => ({ data: [] })),

    // 2. Safe zones from Safety microservice or Gateway
    axios.get(`${SAFETY_URL}/api/v1/safety/safe-zones`, { timeout: 2500 })
      .catch(() => axios.get(`${GATEWAY_URL}/api/v1/safety/safe-zones`, { timeout: 2500 }))
      .catch(() => ({ data: { data: { content: [] } } })),

    // 3. SOS Alerts from Police microservice or Gateway
    axios.get(`${POLICE_URL}/api/v1/police/sos-alerts`, { timeout: 2500 })
      .catch(() => axios.get(`${GATEWAY_URL}/api/v1/police/sos-alerts`, { timeout: 2500 }))
      .catch(() => ({ data: { data: [] } })),

    // 4. Admin stats from Admin microservice or Gateway
    axios.get(`${ADMIN_URL}/api/v1/admin/dashboard/stats`, { timeout: 2500 })
      .catch(() => axios.get(`${GATEWAY_URL}/api/v1/admin/dashboard/stats`, { timeout: 2500 }))
      .catch(() => ({ data: { data: {} } }))
  ]);

  // Normalize complaints
  let complaints = [];
  if (complaintsRes.status === "fulfilled" && complaintsRes.value?.data) {
    const raw = complaintsRes.value.data;
    complaints = Array.isArray(raw) ? raw : (raw.data || raw.content || []);
  }

  // Normalize safe zones
  let safeZones = [];
  if (safeZonesRes.status === "fulfilled" && safeZonesRes.value?.data) {
    const raw = safeZonesRes.value.data;
    safeZones = raw?.data?.content || raw?.content || (Array.isArray(raw.data) ? raw.data : (Array.isArray(raw) ? raw : []));
  }

  // Normalize SOS Alerts
  let sosAlerts = [];
  if (sosAlertsRes.status === "fulfilled" && sosAlertsRes.value?.data) {
    const raw = sosAlertsRes.value.data;
    sosAlerts = raw?.data || (Array.isArray(raw) ? raw : []);
  }

  // Normalize Admin stats
  let adminStats = {};
  if (adminStatsRes.status === "fulfilled" && adminStatsRes.value?.data) {
    adminStats = adminStatsRes.value.data?.data || adminStatsRes.value.data || {};
  }

  // Aggregate statistics for complaints
  const statusCounts = {};
  const categoryCounts = {};
  const locationCounts = {};

  complaints.forEach((c) => {
    const s = (c.status || "PENDING").toUpperCase();
    statusCounts[s] = (statusCounts[s] || 0) + 1;

    const cat = c.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const loc = c.location || "Unknown Location";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const snapshot = {
    timestamp: new Date().toISOString(),
    totalComplaints: complaints.length,
    complaints: complaints.slice(0, 15), // keep top recent for detail context
    statusCounts,
    categoryCounts,
    locationCounts,
    totalSafeZones: safeZones.length,
    safeZones: safeZones.slice(0, 10),
    totalSosAlerts: sosAlerts.length,
    activeSosAlerts: sosAlerts.filter(a => (a.status || "").toUpperCase() === "ACTIVE"),
    sosAlerts: sosAlerts.slice(0, 5),
    adminStats
  };

  cachedSnapshot = snapshot;
  lastFetchTime = Date.now();
  return snapshot;
}

/**
 * Formats live database telemetry into a prompt context for the AI
 */
export function formatDatabaseContextPrompt(snapshot) {
  if (!snapshot) return "";

  const {
    totalComplaints,
    statusCounts,
    categoryCounts,
    locationCounts,
    complaints,
    totalSafeZones,
    safeZones,
    totalSosAlerts,
    activeSosAlerts,
    adminStats
  } = snapshot;

  const categoriesStr = Object.entries(categoryCounts)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(", ") || "None recorded";

  const statusesStr = Object.entries(statusCounts)
    .map(([st, count]) => `${st}: ${count}`)
    .join(", ") || "None recorded";

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([loc, count]) => `${loc} (${count} cases)`)
    .join(", ") || "None recorded";

  const recentIncidentsSnippet = complaints.slice(0, 5).map((c, i) => {
    return `${i + 1}. [${c.status || 'PENDING'}] "${c.title}" in ${c.location || 'N/A'} (Category: ${c.category || 'N/A'}, Reported: ${c.createdAt ? c.createdAt.substring(0, 10) : 'Recent'})`;
  }).join("\n");

  const safeZonesSnippet = safeZones.slice(0, 5).map((z, i) => {
    return `${i + 1}. "${z.name}" (${z.zoneType || 'SAFE_HOUSE'}) at [${z.latitude}, ${z.longitude}], Safety Score: ${z.safetyScore || 90}/100`;
  }).join("\n");

  return `
=== LIVE DATABASE TELEMETRY SNAPSHOT (VELORA DATABASE) ===
- Total Incident Complaints in Database: ${totalComplaints}
  • By Status: ${statusesStr}
  • By Category: ${categoriesStr}
  • Top Incident Hotspots/Locations: ${topLocations}
- Recent Database Incident Records:
${recentIncidentsSnippet || "  (No incident records found)"}

- Total Verified Safe Zones in Database: ${totalSafeZones}
${safeZonesSnippet ? "  Top Safe Zones:\n" + safeZonesSnippet : "  (No safe zone records found)"}

- Emergency SOS Alerts in Database: ${totalSosAlerts} (Active Right Now: ${activeSosAlerts?.length || 0})
- Admin & Police Platform Telemetry:
  • Registered Users: ${adminStats?.totalUsers ?? 'Active'}
  • Active Police Officers: ${adminStats?.activePoliceOfficers ?? 'Active'}
  • System Health: ${adminStats?.systemHealth ?? 'HEALTHY'}
=== END DATABASE SNAPSHOT ===
`;
}
