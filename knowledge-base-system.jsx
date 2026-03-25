import { useState, useEffect, useRef } from "react";

const G = {
  bg: "#070B14", surface: "#0D1526", card: "#111E33", cardHover: "#162240",
  border: "#1E2D47", borderLight: "#253550", borderHover: "#2E4268",
  blue: "#3B82F6", blueDim: "#1D4ED8", blueGlow: "rgba(59,130,246,0.15)",
  blueText: "#60A5FA", cyan: "#22D3EE", teal: "#14B8A6",
  green: "#10B981", greenDim: "#065F46", greenText: "#34D399",
  amber: "#F59E0B", amberDim: "#92400E", amberText: "#FCD34D",
  red: "#EF4444", redDim: "#7F1D1D", redText: "#FCA5A5",
  purple: "#8B5CF6", purpleText: "#C4B5FD",
  text: "#E2E8F0", textSub: "#94A3B8", textMuted: "#475569",
  white: "#F8FAFC",
};


const CATEGORIES = [
  { id: 1, name: "DMS System", icon: "🖥️", color: G.blue, desc: "Dealer Management System issues & guides", count: 12 },
  { id: 2, name: "Order Issues", icon: "📦", color: G.teal, desc: "Order processing, cancellations, status", count: 8 },
  { id: 3, name: "Sync Problems", icon: "🔄", color: G.purple, desc: "Data synchronization & integration errors", count: 6 },
  { id: 4, name: "User Access", icon: "🔐", color: G.amber, desc: "Authentication, permissions, login issues", count: 9 },
  { id: 5, name: "Reporting", icon: "📊", color: G.cyan, desc: "Report generation, export & analytics", count: 5 },
  { id: 6, name: "Network & VPN", icon: "🌐", color: G.green, desc: "Connectivity, VPN access, firewall rules", count: 7 },
  { id: 7, name: "Hardware", icon: "🖨️", color: G.red, desc: "Printers, scanners, terminal issues", count: 4 },
  { id: 8, name: "General FAQ", icon: "❓", color: G.textSub, desc: "Common questions & general support", count: 15 },
];

const TAGS_LIST = ["DMS", "Order", "Sync", "Login", "Password", "VPN", "Printer", "Report", "Error", "Workaround", "Critical", "Escalation"];

const KB_ARTICLES = [
  {
    id: 1, catId: 1, title: "How to Reset DMS User Password via Admin Panel",
    desc: "Step-by-step guide for IT admin to reset user passwords in the DMS system without contacting vendor.",
    content: `<h2>Overview</h2><p>This guide covers the standard procedure for resetting user passwords in the DMS Admin Panel. Only IT Admins with Level 2 access can perform this action.</p><h2>Prerequisites</h2><ul><li>Admin access to DMS Portal</li><li>User's employee ID or registered email</li></ul><h2>Steps</h2><ol><li>Login to <strong>DMS Admin Portal</strong> at <code>http://dms.internal/admin</code></li><li>Navigate to <strong>User Management → Active Users</strong></li><li>Search for the user by name or employee ID</li><li>Click the <strong>⋮ Actions</strong> button → Select <strong>Reset Password</strong></li><li>A temporary password will be sent to the user's registered email</li><li>Inform user to change password on first login</li></ol><h2>Notes</h2><p>If the user's email is not accessible, escalate to L2 support for manual override.</p>`,
    author: "Budi Santoso", authorRole: "L2 Support", createdAt: "2024-11-15", updatedAt: "2025-01-08",
    status: "approved", views: 284, helpful: 47, notHelpful: 3,
    tags: ["DMS", "Password", "Admin"], attachments: [{ name: "DMS_Admin_Guide_v2.pdf", size: "1.2 MB" }],
  },
  {
    id: 2, catId: 2, title: "Order Status Stuck on 'Processing' – Resolution Guide",
    desc: "When a customer order remains in 'Processing' status beyond 24 hours, follow this escalation procedure.",
    content: `<h2>Problem Description</h2><p>Orders may get stuck in "Processing" state due to payment gateway timeouts or sync failures between the OMS and DMS.</p><h2>Quick Diagnosis</h2><ol><li>Check order ID in <strong>OMS Dashboard</strong></li><li>Verify payment gateway log under <strong>Finance → Payment Logs</strong></li><li>Run sync check script: <code>./check_sync.sh ORDER_ID</code></li></ol><h2>Resolution Steps</h2><p><strong>Scenario A – Payment confirmed but status not updated:</strong></p><ol><li>Go to OMS → Orders → Manual Override</li><li>Enter Order ID and set status to "Confirmed"</li><li>Trigger re-sync manually</li></ol><p><strong>Scenario B – Payment not captured:</strong></p><ol><li>Escalate to Finance team within 2 hours</li><li>Do NOT manually override in this case</li></ol>`,
    author: "Sari Dewi", authorRole: "L1 Support", createdAt: "2025-01-03", updatedAt: "2025-02-14",
    status: "approved", views: 412, helpful: 89, notHelpful: 7,
    tags: ["Order", "Sync", "Escalation"], attachments: [],
  },
  {
    id: 3, catId: 3, title: "DMS-ERP Sync Failure: Timeout Error Code 504",
    desc: "Common causes and resolution for Error 504 during DMS to ERP synchronization process.",
    content: `<h2>Error Description</h2><p>Error 504 (Gateway Timeout) occurs when the sync service does not receive a response from the ERP within the configured timeout window (default: 30s).</p><h2>Common Causes</h2><ul><li>ERP server under high load during business hours</li><li>Network latency spike between DMS and ERP hosts</li><li>Expired API credentials</li></ul><h2>Resolution</h2><ol><li>Check ERP server health: ping <code>erp.internal</code></li><li>Verify API credentials in DMS config: <code>/etc/dms/config.yml</code></li><li>Retry sync after 15 minutes during off-peak hours</li><li>If persistent, raise ticket to ERP team with error logs</li></ol>`,
    author: "Andi Pratama", authorRole: "L2 Support", createdAt: "2024-12-20", updatedAt: "2025-01-25",
    status: "approved", views: 198, helpful: 34, notHelpful: 2,
    tags: ["Sync", "Error", "DMS"], attachments: [{ name: "sync_error_log_sample.txt", size: "48 KB" }],
  },
  {
    id: 4, catId: 4, title: "VPN Access Setup for Remote Distributors",
    desc: "Complete guide for setting up VPN access for new distributor staff needing remote DMS access.",
    content: `<h2>Overview</h2><p>This guide helps IT support configure VPN access for distributor employees who need remote access to DMS.</p><h2>Requirements</h2><ul><li>Employee ID and department approval email</li><li>Device must be company-issued or registered</li></ul><h2>Setup Steps</h2><ol><li>Submit VPN access request via ITSM portal</li><li>IT admin creates VPN account in FortiClient portal</li><li>Send credentials to user via secure channel</li><li>User installs FortiClient VPN and connects</li></ol>`,
    author: "Rini Wulandari", authorRole: "Network Admin", createdAt: "2025-01-10", updatedAt: "2025-02-01",
    status: "approved", views: 321, helpful: 62, notHelpful: 4,
    tags: ["VPN", "Network", "Remote"], attachments: [{ name: "FortiClient_Setup_Guide.pdf", size: "2.1 MB" }],
  },
  {
    id: 5, catId: 1, title: "DMS Login Page Not Loading After Update v4.2.1",
    desc: "Known issue after DMS v4.2.1 update causing blank login page. Browser cache clear resolves 90% of cases.",
    content: `<h2>Issue</h2><p>After the DMS platform update to v4.2.1, some users report the login page shows as blank or loops without rendering.</p><h2>Root Cause</h2><p>Browser cached old JavaScript bundles conflict with new version hashes.</p><h2>Resolution</h2><ol><li>Hard refresh: <code>Ctrl + Shift + R</code> (Windows) / <code>Cmd + Shift + R</code> (Mac)</li><li>Clear browser cache completely</li><li>If issue persists, try Incognito/Private mode</li><li>Report to L2 if all above fail</li></ol>`,
    author: "Budi Santoso", authorRole: "L2 Support", createdAt: "2025-02-10", updatedAt: "2025-02-10",
    status: "approved", views: 567, helpful: 98, notHelpful: 5,
    tags: ["DMS", "Login", "Bug", "Workaround"], attachments: [],
  },
  {
    id: 6, catId: 5, title: "Monthly Sales Report Export Failing – Fix",
    desc: "Excel export of monthly sales report fails silently. Root cause is date filter timezone mismatch.",
    content: `<h2>Problem</h2><p>Monthly sales report export to Excel fails or produces empty file when date range spans month boundaries in certain timezone settings.</p><h2>Workaround</h2><ol><li>Set browser timezone to WIB (UTC+7) explicitly</li><li>Use date range within same month</li><li>Export in CSV format as alternative</li></ol><h2>Permanent Fix</h2><p>Pending patch from vendor – ETA: Q1 2025. Track ticket #RPT-2241.</p>`,
    author: "Sari Dewi", authorRole: "L1 Support", createdAt: "2025-01-18", updatedAt: "2025-02-05",
    status: "approved", views: 143, helpful: 28, notHelpful: 1,
    tags: ["Report", "Export", "Workaround"], attachments: [],
  },
  {
    id: 7, catId: 2, title: "Duplicate Order Created During System Maintenance",
    desc: "Investigation and resolution procedure when duplicate orders appear in OMS after system maintenance windows.",
    content: `<h2>Background</h2><p>During scheduled maintenance windows, incomplete transactions may be replayed on recovery, causing duplicate orders.</p><h2>Identification</h2><ul><li>Check OMS for orders with same customer ID and timestamp within 5 min window</li><li>Compare order totals and line items</li></ul><h2>Resolution</h2><ol><li>Identify the legitimate order (usually the second one)</li><li>Cancel the duplicate via OMS → Order Cancel</li><li>Notify customer if payment was collected for both</li><li>Escalate to Finance for refund if applicable</li></ol>`,
    author: "Andi Pratama", authorRole: "L2 Support", createdAt: "2025-02-01", updatedAt: "2025-02-01",
    status: "pending", views: 0, helpful: 0, notHelpful: 0,
    tags: ["Order", "Duplicate", "Maintenance"], attachments: [],
  },
  {
    id: 8, catId: 6, title: "Firewall Port Requirements for DMS Integration",
    desc: "Complete list of firewall ports that must be open for DMS system to function correctly in distributor network.",
    content: `<h2>Required Ports</h2><p>The following ports must be whitelisted at the distributor firewall level:</p><ul><li><strong>443 (HTTPS)</strong> – DMS web interface</li><li><strong>8443</strong> – DMS API Gateway</li><li><strong>5432</strong> – PostgreSQL (internal only)</li><li><strong>1194 UDP</strong> – VPN tunnel</li></ul><h2>Verification</h2><p>Run: <code>telnet dms.internal 443</code> to verify connectivity.</p>`,
    author: "Rini Wulandari", authorRole: "Network Admin", createdAt: "2025-01-05", updatedAt: "2025-01-20",
    status: "approved", views: 89, helpful: 19, notHelpful: 0,
    tags: ["Network", "Firewall", "DMS"], attachments: [{ name: "Firewall_Whitelist_Template.xlsx", size: "34 KB" }],
  },
];

const USERS_DATA = [
  { id: 1, name: "Budi Santoso", email: "budi@dms-it.com", role: "admin", canAdd: true, avatar: "BS", active: true },
  { id: 2, name: "Sari Dewi", email: "sari@dms-it.com", role: "user", canAdd: true, avatar: "SD", active: true },
  { id: 3, name: "Andi Pratama", email: "andi@dms-it.com", role: "user", canAdd: true, avatar: "AP", active: true },
  { id: 4, name: "Rini Wulandari", email: "rini@dms-it.com", role: "user", canAdd: false, avatar: "RW", active: true },
  { id: 5, name: "Doni Kusuma", email: "doni@dms-it.com", role: "user", canAdd: false, avatar: "DK", active: false },
];

const DEMO_CREDS = [
  { email: "budi@dms-it.com", pass: "admin123", userId: 1 },
  { email: "sari@dms-it.com", pass: "user123", userId: 2 },
  { email: "rini@dms-it.com", pass: "user123", userId: 4 },
];

// ─── TINY UTILITIES ────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 36, color = G.blue }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "33", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 600, color, flexShrink: 0, fontFamily: "Sora, sans-serif" }}>
      {initials}
    </div>
  );
};

const Badge = ({ label, color = G.blue, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, background: bg || color + "22", color, fontSize: 11, fontWeight: 600, border: `1px solid ${color}44`, letterSpacing: "0.03em", fontFamily: "Sora, sans-serif" }}>
    {label}
  </span>
);

const StatusBadge = ({ status }) => {
  const map = { approved: [G.green, "Approved"], pending: [G.amber, "Pending"], rejected: [G.red, "Rejected"] };
  const [color, label] = map[status] || [G.textMuted, status];
  return <Badge label={label} color={color} />;
};

const Tag = ({ label, onClick }) => (
  <span onClick={onClick} style={{ padding: "3px 10px", borderRadius: 20, background: G.border, color: G.textSub, fontSize: 12, cursor: onClick ? "pointer" : "default", border: `1px solid ${G.borderLight}`, fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}
    onMouseEnter={e => onClick && (e.target.style.borderColor = G.blue, e.target.style.color = G.blueText)}
    onMouseLeave={e => onClick && (e.target.style.borderColor = G.borderLight, e.target.style.color = G.textSub)}>
    #{label}
  </span>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, style: sx }) => {
  const base = { cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 8, fontFamily: "Sora, sans-serif", fontWeight: 600, transition: "all 0.2s", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6 };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "9px 20px", fontSize: 13 }, lg: { padding: "12px 28px", fontSize: 14 } };
  const variants = {
    primary: { background: G.blue, color: "#fff" },
    ghost: { background: "transparent", color: G.textSub, border: `1px solid ${G.border}` },
    danger: { background: G.red + "22", color: G.red, border: `1px solid ${G.red}44` },
    success: { background: G.green + "22", color: G.green, border: `1px solid ${G.green}44` },
    outline: { background: "transparent", color: G.blueText, border: `1px solid ${G.blue}55` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; }}>
      {children}
    </button>
  );
};

const Input = ({ placeholder, value, onChange, icon, type = "text", style: sx }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    {icon && <span style={{ position: "absolute", left: 12, color: G.textMuted, fontSize: 16, pointerEvents: "none" }}>{icon}</span>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ width: "100%", padding: icon ? "10px 14px 10px 38px" : "10px 14px", background: G.surface, border: `1px solid ${G.border}`, borderRadius: 8, color: G.text, fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box", ...sx }}
      onFocus={e => e.target.style.borderColor = G.blue}
      onBlur={e => e.target.style.borderColor = G.border} />
  </div>
);

const Card = ({ children, onClick, style: sx, hover = true }) => (
  <div onClick={onClick} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: "20px 24px", cursor: onClick ? "pointer" : "default", transition: "all 0.25s", ...sx }}
    onMouseEnter={e => { if (hover && onClick) { e.currentTarget.style.background = G.cardHover; e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.transform = "translateY(-2px)"; }}}
    onMouseLeave={e => { e.currentTarget.style.background = G.card; e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = ""; }}>
    {children}
  </div>
);

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
const Navbar = ({ user, page, setPage, notifCount = 0 }) => {
  const [dropdown, setDropdown] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60, background: G.surface + "F0", backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div onClick={() => setPage("dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${G.blue}, ${G.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: G.white, letterSpacing: "-0.02em" }}>IT<span style={{ color: G.blueText }}>Knowledgebase</span></span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["dashboard", "Home"], ["categories", "Browse"], ...(user?.canAdd || user?.role === "admin" ? [["add-kb", "Add KB"]] : []), ...(user?.role === "admin" ? [["admin", "Admin"]] : [])].map(([p, label]) => (
            <span key={p} onClick={() => setPage(p)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontFamily: "DM Sans, sans-serif", cursor: "pointer", color: page === p ? G.blueText : G.textSub, background: page === p ? G.blueGlow : "transparent", fontWeight: page === p ? 600 : 400, transition: "all 0.15s" }}
              onMouseEnter={e => { if (page !== p) e.target.style.color = G.text; }}
              onMouseLeave={e => { if (page !== p) e.target.style.color = G.textSub; }}>
              {label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        {user?.role === "admin" && notifCount > 0 && (
          <div onClick={() => setPage("admin")} style={{ position: "relative", cursor: "pointer", padding: "6px 10px", borderRadius: 8, background: G.amber + "22", border: `1px solid ${G.amber}44`, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: G.amberText, fontFamily: "Sora, sans-serif", fontWeight: 600 }}>
            🔔 <span>{notifCount} pending</span>
          </div>
        )}
        <div onClick={() => setDropdown(!dropdown)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", borderRadius: 10, border: `1px solid ${G.border}`, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = G.borderHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
          <Avatar name={user?.name || "U"} size={28} color={user?.role === "admin" ? G.amber : G.blue} />
          <span style={{ fontSize: 13, color: G.text, fontFamily: "DM Sans, sans-serif" }}>{user?.name?.split(" ")[0]}</span>
          <span style={{ fontSize: 10, color: G.textMuted }}>▼</span>
        </div>
        {dropdown && (
          <div style={{ position: "absolute", top: 46, right: 0, width: 200, background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: 8, zIndex: 200, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }}>
            <div style={{ padding: "10px 12px", borderBottom: `1px solid ${G.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.text, fontFamily: "Sora, sans-serif" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>{user?.email}</div>
              <Badge label={user?.role === "admin" ? "Admin" : "User"} color={user?.role === "admin" ? G.amber : G.blue} />
            </div>
            <div style={{ padding: "8px 0" }}>
              {[["profile", "👤 My Profile"], ["settings", "⚙️ Settings"]].map(([k, v]) => (
                <div key={k} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: G.textSub, fontFamily: "DM Sans, sans-serif" }}
                  onMouseEnter={e => e.target.style.background = G.border}
                  onMouseLeave={e => e.target.style.background = "transparent"}>{v}</div>
              ))}
              <div onClick={() => { setDropdown(false); setPage("logout"); }} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: G.red, fontFamily: "DM Sans, sans-serif" }}
                onMouseEnter={e => e.target.style.background = G.red + "22"}
                onMouseLeave={e => e.target.style.background = "transparent"}>🚪 Sign Out</div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      const found = DEMO_CREDS.find(c => c.email === email && c.pass === pass);
      if (found) { const u = USERS_DATA.find(u => u.id === found.userId); onLogin(u); }
      else { setErr("Invalid email or password. Try the credentials shown below."); }
      setLoading(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: G.blue + "0A", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 300, height: 300, borderRadius: "50%", background: G.purple + "0A", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg, ${G.blue}, ${G.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🧠</div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 26, fontWeight: 800, color: G.white, margin: "0 0 6px", letterSpacing: "-0.03em" }}>IT Knowledgebase</h1>
          <p style={{ color: G.textMuted, fontSize: 14, fontFamily: "DM Sans, sans-serif", margin: 0 }}>L1 DMS Support Portal</p>
        </div>
        <Card hover={false} style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.textSub, fontFamily: "Sora, sans-serif", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Email Address</label>
            <Input placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} icon="✉️" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.textSub, fontFamily: "Sora, sans-serif", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Password</label>
            <Input placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} type="password" icon="🔒" />
          </div>
          {err && <div style={{ background: G.red + "22", border: `1px solid ${G.red}44`, borderRadius: 8, padding: "10px 14px", color: G.redText, fontSize: 12, fontFamily: "DM Sans, sans-serif", marginBottom: 16 }}>{err}</div>}
          <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}>{loading ? "Signing in..." : "Sign In →"}</Btn>
        </Card>
        <Card hover={false} style={{ marginTop: 16, padding: 16 }}>
          <p style={{ fontSize: 11, color: G.textMuted, fontFamily: "Sora, sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>Demo Credentials</p>
          {[["Admin Account", "budi@dms-it.com", "admin123", G.amber], ["User (Can Add KB)", "sari@dms-it.com", "user123", G.blue], ["User (View Only)", "rini@dms-it.com", "user123", G.textSub]].map(([role, em, pw, col]) => (
            <div key={em} onClick={() => { setEmail(em); setPass(pw); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4, background: G.bg, border: `1px solid ${G.border}` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = col + "66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: col, fontFamily: "Sora, sans-serif" }}>{role}</div>
                <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>{em} / {pw}</div>
              </div>
              <span style={{ fontSize: 11, color: G.textMuted }}>click to fill</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = ({ setPage, setSelectedCat, setSelectedKB, searchQuery, setSearchQuery, articles, user }) => {
  const approvedArticles = articles.filter(a => a.status === "approved");
  const filtered = searchQuery.trim().length > 1
    ? approvedArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

  const totalViews = approvedArticles.reduce((s, a) => s + a.views, 0);
  const statsArr = [
    { icon: "📚", label: "Total Articles", val: approvedArticles.length, color: G.blue },
    { icon: "👁", label: "Total Views", val: totalViews.toLocaleString(), color: G.teal },
    { icon: "📁", label: "Categories", val: CATEGORIES.length, color: G.purple },
    { icon: "⭐", label: "Avg Helpful Rate", val: Math.round(approvedArticles.reduce((s, a) => s + (a.helpful / Math.max(a.helpful + a.notHelpful, 1) * 100), 0) / approvedArticles.length) + "%", color: G.amber },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 0 32px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: G.blue + "06", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 36, fontWeight: 800, color: G.white, margin: "0 0 10px", letterSpacing: "-0.04em", position: "relative" }}>
          How can we <span style={{ color: G.blueText }}>help you today?</span>
        </h1>
        <p style={{ color: G.textSub, fontSize: 15, fontFamily: "DM Sans, sans-serif", margin: "0 0 28px", position: "relative" }}>Search the IT Support Knowledge Base for DMS, orders, sync issues, and more.</p>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <Input placeholder="🔍  Search articles, guides, and FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "14px 18px", fontSize: 15, borderRadius: 12, border: `1.5px solid ${G.border}` }} />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim().length > 1 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: G.textSub, fontFamily: "DM Sans, sans-serif", marginBottom: 14 }}>
            {filtered.length > 0 ? `Found ${filtered.length} result(s) for "${searchQuery}"` : `No results for "${searchQuery}"`}
          </div>
          {filtered.map(a => (
            <div key={a.id} onClick={() => { setSelectedKB(a); setPage("detail"); }} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.background = G.cardHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = G.card; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: G.text, fontFamily: "Sora, sans-serif", marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: G.textSub, fontFamily: "DM Sans, sans-serif" }}>{a.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16 }}>
                  {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
        {statsArr.map(s => (
          <div key={s.label} style={{ background: G.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${G.border}` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: G.text, margin: 0 }}>Browse by Category</h2>
        <Btn variant="ghost" size="sm" onClick={() => setPage("categories")}>View All →</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {CATEGORIES.map(cat => {
          const count = articles.filter(a => a.catId === cat.id && a.status === "approved").length;
          return (
            <Card key={cat.id} onClick={() => { setSelectedCat(cat); setPage("category"); }} style={{ padding: "22px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.icon}</div>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{cat.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: cat.color, fontWeight: 600, fontFamily: "Sora, sans-serif" }}>{count} articles</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: G.text, margin: 0 }}>Most Viewed Articles</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {approvedArticles.sort((a, b) => b.views - a.views).slice(0, 6).map(a => {
          const cat = CATEGORIES.find(c => c.id === a.catId);
          return (
            <div key={a.id} onClick={() => { setSelectedKB(a); setPage("detail"); }} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s", display: "flex", gap: 14, alignItems: "flex-start" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.background = G.cardHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = G.card; }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{cat?.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.desc}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>👁 {a.views} views</span>
                  <span style={{ fontSize: 11, color: G.green, fontFamily: "DM Sans, sans-serif" }}>✓ {a.helpful} helpful</span>
                  <Badge label={cat?.name} color={cat?.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── CATEGORY PAGE ─────────────────────────────────────────────────────────────
const CategoryPage = ({ cat, setPage, setSelectedKB, articles }) => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [view, setView] = useState("card");

  const items = articles
    .filter(a => a.catId === cat.id && a.status === "approved")
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
    .filter(a => !activeTag || a.tags.includes(activeTag));

  const allTags = [...new Set(articles.filter(a => a.catId === cat.id).flatMap(a => a.tags))];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Btn variant="ghost" size="sm" onClick={() => setPage("dashboard")}>← Back</Btn>
        <div style={{ fontSize: 28 }}>{cat.icon}</div>
        <div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: G.white, margin: "0 0 2px", letterSpacing: "-0.03em" }}>{cat.name}</h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textSub, margin: 0 }}>{cat.desc}</p>
        </div>
        <div style={{ marginLeft: "auto", padding: "6px 16px", borderRadius: 20, background: cat.color + "22", color: cat.color, fontSize: 13, fontWeight: 600, fontFamily: "Sora, sans-serif", border: `1px solid ${cat.color}44` }}>
          {items.length} articles
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <div style={{ flex: 1 }}><Input placeholder="Search in this category..." value={search} onChange={e => setSearch(e.target.value)} icon="🔍" /></div>
        <div style={{ display: "flex", gap: 4, background: G.surface, borderRadius: 8, padding: 4, border: `1px solid ${G.border}` }}>
          {[["card", "⊞"], ["list", "☰"]].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: view === v ? G.blue : "transparent", color: view === v ? "#fff" : G.textMuted, cursor: "pointer", fontSize: 14, transition: "all 0.15s" }}>{icon}</button>
          ))}
        </div>
      </div>
      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <span onClick={() => setActiveTag(null)} style={{ padding: "4px 12px", borderRadius: 20, background: !activeTag ? G.blue : G.border, color: !activeTag ? "#fff" : G.textSub, fontSize: 12, cursor: "pointer", border: `1px solid ${!activeTag ? G.blue : G.borderLight}`, fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}>All</span>
          {allTags.map(t => (
            <span key={t} onClick={() => setActiveTag(t === activeTag ? null : t)} style={{ padding: "4px 12px", borderRadius: 20, background: t === activeTag ? G.blue + "33" : G.border, color: t === activeTag ? G.blueText : G.textSub, fontSize: 12, cursor: "pointer", border: `1px solid ${t === activeTag ? G.blue + "66" : G.borderLight}`, fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}>#{t}</span>
          ))}
        </div>
      )}
      {view === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {items.map(a => (
            <Card key={a.id} onClick={() => { setSelectedKB(a); setPage("detail"); }} style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, margin: 0, lineHeight: 1.4, flex: 1 }}>{a.title}</h3>
              </div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textSub, margin: "0 0 14px", lineHeight: 1.6 }}>{a.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>
                  <span>👁 {a.views}</span>
                  <span>✓ {a.helpful}</span>
                  <span>🗓 {a.updatedAt}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          {items.map((a, i) => (
            <div key={a.id} onClick={() => { setSelectedKB(a); setPage("detail"); }} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 10, padding: "14px 20px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.background = G.cardHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = G.card; }}>
              <span style={{ fontSize: 13, fontFamily: "Sora, sans-serif", color: G.textMuted, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 600, color: G.text }}>{a.title}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted }}>{a.desc}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>{a.tags.slice(0, 2).map(t => <Tag key={t} label={t} />)}</div>
              <div style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif", minWidth: 80, textAlign: "right" }}>👁 {a.views}</div>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: G.textSub }}>No articles found</div>
          <div style={{ fontSize: 13 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
};

// ─── KB DETAIL PAGE ─────────────────────────────────────────────────────────────
const DetailPage = ({ article: initialArticle, setPage, user, articles, setArticles }) => {
  const [article, setArticle] = useState(initialArticle);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const cat = CATEGORIES.find(c => c.id === article.catId);

  const handleFeedback = (type) => {
    if (feedback) return;
    setFeedback(type);
    const updated = articles.map(a => a.id === article.id ? { ...a, helpful: a.helpful + (type === "yes" ? 1 : 0), notHelpful: a.notHelpful + (type === "no" ? 1 : 0) } : a);
    setArticles(updated);
    setArticle(prev => ({ ...prev, helpful: prev.helpful + (type === "yes" ? 1 : 0), notHelpful: prev.notHelpful + (type === "no" ? 1 : 0) }));
  };

  const handleCopy = () => {
    const text = article.title + "\n\n" + article.content.replace(/<[^>]+>/g, "");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleApprove = (status) => {
    const updated = articles.map(a => a.id === article.id ? { ...a, status } : a);
    setArticles(updated);
    setArticle(prev => ({ ...prev, status }));
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Btn variant="ghost" size="sm" onClick={() => setPage("dashboard")}>← Back</Btn>
        <span style={{ color: G.textMuted, fontSize: 13 }}>/</span>
        <span onClick={() => setPage("category")} style={{ fontSize: 13, color: G.blueText, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>{cat?.name}</span>
        <span style={{ color: G.textMuted, fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: G.textMuted, fontFamily: "DM Sans, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{article.title}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        {/* Main Content */}
        <div>
          <Card hover={false} style={{ padding: "28px 32px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <Badge label={cat?.name} color={cat?.color} />
              <StatusBadge status={article.status} />
              {article.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: G.white, margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.35 }}>{article.title}</h1>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: G.textSub, margin: "0 0 20px", lineHeight: 1.7 }}>{article.desc}</p>
            <div style={{ display: "flex", gap: 20, alignItems: "center", paddingTop: 16, borderTop: `1px solid ${G.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={article.author} size={30} color={G.blue} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: G.text, fontFamily: "Sora, sans-serif" }}>{article.author}</div>
                  <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>{article.authorRole}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>Created: {article.createdAt}</div>
              <div style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>Updated: {article.updatedAt}</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm" onClick={handleCopy}>{copied ? "✅ Copied!" : "📋 Copy"}</Btn>
              </div>
            </div>
          </Card>

          <Card hover={false} style={{ padding: "28px 32px", marginBottom: 16 }}>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: G.text, lineHeight: 1.9 }}
              dangerouslySetInnerHTML={{ __html: article.content.replace(/<h2>/g, `<h2 style="font-family:Sora,sans-serif;font-size:17px;font-weight:700;color:${G.white};margin:24px 0 10px;border-bottom:1px solid ${G.border};padding-bottom:8px">`).replace(/<h3>/g, `<h3 style="font-family:Sora,sans-serif;font-size:15px;font-weight:600;color:${G.text};margin:18px 0 8px">`).replace(/<p>/g, `<p style="color:${G.textSub};margin:0 0 14px">`).replace(/<ul>/g, `<ul style="color:${G.textSub};padding-left:20px;margin:0 0 14px">`).replace(/<ol>/g, `<ol style="color:${G.textSub};padding-left:20px;margin:0 0 14px">`).replace(/<li>/g, `<li style="margin-bottom:6px">`).replace(/<code>/g, `<code style="background:${G.bg};border:1px solid ${G.border};padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:${G.cyan}">`) }} />
          </Card>

          {article.attachments.length > 0 && (
            <Card hover={false} style={{ padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, margin: "0 0 12px" }}>📎 Attachments</h3>
              {article.attachments.map((att, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: G.bg, border: `1px solid ${G.border}`, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: G.text, fontFamily: "Sora, sans-serif" }}>{att.name}</div>
                    <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>{att.size}</div>
                  </div>
                  <Btn variant="outline" size="sm">⬇ Download</Btn>
                </div>
              ))}
            </Card>
          )}

          <Card hover={false} style={{ padding: "20px 24px" }}>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, margin: "0 0 6px" }}>Was this article helpful?</h3>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textMuted, margin: "0 0 14px" }}>Your feedback helps us improve our knowledge base.</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Btn variant={feedback === "yes" ? "success" : "ghost"} onClick={() => handleFeedback("yes")} disabled={!!feedback}>👍 Yes, helpful ({article.helpful})</Btn>
              <Btn variant={feedback === "no" ? "danger" : "ghost"} onClick={() => handleFeedback("no")} disabled={!!feedback}>👎 Not helpful ({article.notHelpful})</Btn>
              {feedback && <span style={{ fontSize: 13, color: G.greenText, fontFamily: "DM Sans, sans-serif" }}>Thanks for your feedback!</span>}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card hover={false} style={{ padding: "18px 20px", marginBottom: 14 }}>
            <h4 style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 700, color: G.textSub, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>Article Stats</h4>
            {[["👁 Views", article.views], ["👍 Helpful", article.helpful], ["👎 Not Helpful", article.notHelpful]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${G.border}` }}>
                <span style={{ fontSize: 13, color: G.textSub, fontFamily: "DM Sans, sans-serif" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: G.text, fontFamily: "Sora, sans-serif" }}>{v}</span>
              </div>
            ))}
          </Card>

          {user?.role === "admin" && article.status === "pending" && (
            <Card hover={false} style={{ padding: "18px 20px", marginBottom: 14, border: `1px solid ${G.amber}44` }}>
              <h4 style={{ fontFamily: "Sora, sans-serif", fontSize: 11, fontWeight: 700, color: G.amberText, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>⚠ Pending Approval</h4>
              <p style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif", margin: "0 0 12px" }}>This article requires admin review before publishing.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="success" size="sm" onClick={() => handleApprove("approved")} style={{ flex: 1, justifyContent: "center" }}>✓ Approve</Btn>
                <Btn variant="danger" size="sm" onClick={() => handleApprove("rejected")} style={{ flex: 1, justifyContent: "center" }}>✕ Reject</Btn>
              </div>
            </Card>
          )}

          <Card hover={false} style={{ padding: "18px 20px" }}>
            <h4 style={{ fontFamily: "Sora, sans-serif", fontSize: 11, fontWeight: 700, color: G.textSub, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tags</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {article.tags.map(t => <Tag key={t} label={t} />)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── ADD KB PAGE ───────────────────────────────────────────────────────────────
const AddKBPage = ({ setPage, user, articles, setArticles }) => {
  const [form, setForm] = useState({ title: "", catId: "", desc: "", content: "", tags: [], attachment: null });
  const [tagInput, setTagInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) { set("tags", [...form.tags, t]); setTagInput(""); }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.catId) e.catId = "Please select a category";
    if (!form.desc.trim()) e.desc = "Description is required";
    if (!form.content.trim()) e.content = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newArticle = {
      id: Math.max(...articles.map(a => a.id)) + 1,
      catId: parseInt(form.catId), title: form.title, desc: form.desc,
      content: `<p>${form.content.replace(/\n/g, "</p><p>")}</p>`,
      author: user.name, authorRole: user.role === "admin" ? "Admin" : "L1 Support",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      status: user.role === "admin" ? "approved" : "pending",
      views: 0, helpful: 0, notHelpful: 0, tags: form.tags,
      attachments: form.attachment ? [{ name: form.attachment.name, size: Math.round(form.attachment.size / 1024) + " KB" }] : [],
    };
    setArticles(prev => [...prev, newArticle]);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 24, fontWeight: 800, color: G.white, margin: "0 0 10px" }}>Article Submitted!</h2>
      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: G.textSub, margin: "0 0 24px", maxWidth: 400 }}>
        {user.role === "admin" ? "Your article has been published immediately." : "Your article is now pending admin approval before publishing."}
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Btn onClick={() => setPage("dashboard")}>Go to Dashboard</Btn>
        <Btn variant="ghost" onClick={() => { setForm({ title: "", catId: "", desc: "", content: "", tags: [], attachment: null }); setSubmitted(false); }}>Add Another</Btn>
      </div>
    </div>
  );

  const Field = ({ label, error, children, required }) => (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: G.textSub, fontFamily: "Sora, sans-serif", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}{required && <span style={{ color: G.red }}>*</span>}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: G.red, fontFamily: "DM Sans, sans-serif", marginTop: 4 }}>⚠ {error}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Btn variant="ghost" size="sm" onClick={() => setPage("dashboard")}>← Back</Btn>
        <div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: G.white, margin: 0 }}>Add Knowledge Base Article</h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textMuted, margin: 0 }}>
            {user.role === "admin" ? "As admin, your article will be published immediately." : "Your article will require admin approval before publishing."}
          </p>
        </div>
      </div>

      {user.role !== "admin" && (
        <div style={{ background: G.amber + "15", border: `1px solid ${G.amber}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span style={{ fontSize: 13, color: G.amberText, fontFamily: "DM Sans, sans-serif" }}>Articles submitted by users require admin approval before they appear publicly in the knowledge base.</span>
        </div>
      )}

      <Card hover={false} style={{ padding: "28px 32px" }}>
        <Field label="Title" required error={errors.title}>
          <Input placeholder="e.g. How to reset DMS user password" value={form.title} onChange={e => set("title", e.target.value)} />
        </Field>
        <Field label="Category" required error={errors.catId}>
          <select value={form.catId} onChange={e => set("catId", e.target.value)}
            style={{ width: "100%", padding: "10px 14px", background: G.surface, border: `1px solid ${errors.catId ? G.red : G.border}`, borderRadius: 8, color: form.catId ? G.text : G.textMuted, fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none" }}>
            <option value="">Select a category...</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </Field>
        <Field label="Short Description" required error={errors.desc}>
          <textarea placeholder="Brief summary of what this article covers (shown in search and category listings)" value={form.desc} onChange={e => set("desc", e.target.value)} rows={3}
            style={{ width: "100%", padding: "10px 14px", background: G.surface, border: `1px solid ${errors.desc ? G.red : G.border}`, borderRadius: 8, color: G.text, fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = G.blue} onBlur={e => e.target.style.borderColor = errors.desc ? G.red : G.border} />
        </Field>
        <Field label="Content" required error={errors.content}>
          <div style={{ marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["# Heading", "## Sub", "**Bold**", "`Code`", "- List item"].map(cmd => (
              <button key={cmd} onClick={() => set("content", form.content + (form.content ? "\n" : "") + cmd)} style={{ padding: "4px 10px", background: G.bg, border: `1px solid ${G.border}`, borderRadius: 6, color: G.textSub, fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>{cmd}</button>
            ))}
          </div>
          <textarea placeholder="Write the full content here. Describe the problem, cause, and resolution steps in detail. Supports basic markdown formatting." value={form.content} onChange={e => set("content", e.target.value)} rows={12}
            style={{ width: "100%", padding: "14px", background: G.bg, border: `1px solid ${errors.content ? G.red : G.border}`, borderRadius: 8, color: G.text, fontSize: 14, fontFamily: "monospace", lineHeight: 1.8, outline: "none", resize: "vertical", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = G.blue} onBlur={e => e.target.style.borderColor = errors.content ? G.red : G.border} />
          <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif", marginTop: 4 }}>{form.content.length} characters</div>
        </Field>
        <Field label="Tags">
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {form.tags.map(t => (
              <span key={t} style={{ padding: "4px 10px", borderRadius: 20, background: G.blue + "22", color: G.blueText, fontSize: 12, border: `1px solid ${G.blue}44`, display: "flex", alignItems: "center", gap: 6, fontFamily: "DM Sans, sans-serif" }}>
                #{t} <span onClick={() => set("tags", form.tags.filter(x => x !== t))} style={{ cursor: "pointer", color: G.red, lineHeight: 1 }}>×</span>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input placeholder="Add a tag and press Enter..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                style={{ onKeyDown: e => e.key === "Enter" && addTag() }} />
            </div>
            <Btn variant="outline" onClick={addTag}>Add Tag</Btn>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>Suggestions:</span>
            {TAGS_LIST.filter(t => !form.tags.includes(t)).slice(0, 6).map(t => (
              <span key={t} onClick={() => set("tags", [...form.tags, t])} style={{ padding: "2px 8px", borderRadius: 20, background: G.border, color: G.textSub, fontSize: 11, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>+{t}</span>
            ))}
          </div>
        </Field>
        <Field label="Attachments">
          <div style={{ border: `2px dashed ${G.border}`, borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => document.getElementById("file-upload").click()}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G.blue; e.currentTarget.style.background = G.blueGlow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = "transparent"; }}>
            <input id="file-upload" type="file" style={{ display: "none" }} onChange={e => set("attachment", e.target.files[0])} />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{form.attachment ? "📎" : "📁"}</div>
            <div style={{ fontSize: 14, color: G.textSub, fontFamily: "DM Sans, sans-serif" }}>{form.attachment ? form.attachment.name : "Click to upload file (PDF, images, documents)"}</div>
            {form.attachment && <div style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif", marginTop: 4 }}>{Math.round(form.attachment.size / 1024)} KB</div>}
          </div>
        </Field>
        <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: `1px solid ${G.border}` }}>
          <Btn onClick={handleSubmit} size="lg">
            {user.role === "admin" ? "✓ Publish Article" : "📤 Submit for Approval"}
          </Btn>
          <Btn variant="ghost" onClick={() => setPage("dashboard")} size="lg">Cancel</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminPanel = ({ setPage, articles, setArticles, setSelectedKB, users, setUsers }) => {
  const [tab, setTab] = useState("overview");
  const pending = articles.filter(a => a.status === "pending");
  const approved = articles.filter(a => a.status === "approved");
  const topViewed = [...approved].sort((a, b) => b.views - a.views).slice(0, 5);

  const handleApprove = (id, status) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleUserPerm = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, canAdd: !u.canAdd } : u));
  };

  const tabs = [["overview", "📊 Overview"], ["pending", `⏳ Pending (${pending.length})`], ["articles", "📚 All Articles"], ["users", "👥 Users"]];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: G.amber + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙️</div>
        <div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: G.white, margin: 0 }}>Admin Panel</h1>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textMuted, margin: 0 }}>Manage knowledge base, users & approvals</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, background: G.surface, borderRadius: 10, padding: 4, border: `1px solid ${G.border}`, marginBottom: 24, width: "fit-content" }}>
        {tabs.map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: tab === k ? G.card : "transparent", color: tab === k ? G.text : G.textSub, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: tab === k ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap" }}>{v}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
            {[[approved.length, "Published Articles", G.green, "✅"], [pending.length, "Pending Approval", G.amber, "⏳"], [articles.filter(a => a.status === "rejected").length, "Rejected", G.red, "❌"], [articles.reduce((s, a) => s + a.views, 0).toLocaleString(), "Total Views", G.blue, "👁"]].map(([v, l, c, i]) => (
              <div key={l} style={{ background: G.card, borderRadius: 14, padding: "20px", border: `1px solid ${G.border}` }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{i}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card hover={false} style={{ padding: "20px 24px" }}>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, margin: "0 0 16px" }}>🔥 Most Viewed Articles</h3>
              {topViewed.map((a, i) => (
                <div key={a.id} onClick={() => { setSelectedKB(a); setPage("detail"); }} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${G.border}`, cursor: "pointer", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "4px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                  <span style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 800, color: [G.amber, G.blue, G.teal, G.textSub, G.textMuted][i], minWidth: 24 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 600, color: G.text }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>👁 {a.views} views · ✓ {a.helpful} helpful</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card hover={false} style={{ padding: "20px 24px" }}>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: G.text, margin: "0 0 16px" }}>📁 Articles by Category</h3>
              {CATEGORIES.map(cat => {
                const count = approved.filter(a => a.catId === cat.id).length;
                const pct = Math.round((count / Math.max(approved.length, 1)) * 100);
                return (
                  <div key={cat.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textSub }}>{cat.icon} {cat.name}</span>
                      <span style={{ fontFamily: "Sora, sans-serif", fontSize: 12, fontWeight: 600, color: cat.color }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: G.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}

      {tab === "pending" && (
        <div>
          {pending.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: G.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600, color: G.textSub }}>All caught up!</div>
              <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>No pending articles to review.</div>
            </div>
          ) : pending.map(a => {
            const cat = CATEGORIES.find(c => c.id === a.catId);
            return (
              <Card key={a.id} hover={false} style={{ marginBottom: 14, padding: "20px 24px", border: `1px solid ${G.amber}33` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <Badge label={cat?.name} color={cat?.color} />
                      <StatusBadge status="pending" />
                    </div>
                    <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: G.text, margin: "0 0 6px" }}>{a.title}</h3>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: G.textSub, margin: "0 0 10px" }}>{a.desc}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>
                      <span>By {a.author}</span>
                      <span>Submitted: {a.createdAt}</span>
                      {a.tags.map(t => <Tag key={t} label={t} />)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Btn variant="ghost" size="sm" onClick={() => { setSelectedKB(a); setPage("detail"); }}>👁 Preview</Btn>
                    <Btn variant="success" size="sm" onClick={() => handleApprove(a.id, "approved")}>✓ Approve</Btn>
                    <Btn variant="danger" size="sm" onClick={() => handleApprove(a.id, "rejected")}>✕ Reject</Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "articles" && (
        <div>
          <div style={{ marginBottom: 16 }}><Input placeholder="Search articles..." icon="🔍" /></div>
          <div style={{ background: G.card, borderRadius: 12, border: `1px solid ${G.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 100px 80px 120px 100px", padding: "12px 16px", background: G.bg, borderBottom: `1px solid ${G.border}`, gap: 12 }}>
              {["Title", "Author", "Category", "Views", "Status", "Actions"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: G.textMuted, fontFamily: "Sora, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>
            {articles.map(a => {
              const cat = CATEGORIES.find(c => c.id === a.catId);
              return (
                <div key={a.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 100px 80px 120px 100px", padding: "12px 16px", borderBottom: `1px solid ${G.border}`, gap: 12, alignItems: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = G.surface}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <div>
                    <div style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 600, color: G.text, marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: G.textMuted }}>{a.updatedAt}</div>
                  </div>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textSub }}>{a.author}</span>
                  <Badge label={cat?.name} color={cat?.color} />
                  <span style={{ fontFamily: "Sora, sans-serif", fontSize: 13, color: G.text }}>👁 {a.views}</span>
                  <StatusBadge status={a.status} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="ghost" size="sm" onClick={() => { setSelectedKB(a); setPage("detail"); }}>View</Btn>
                    {a.status === "pending" && <Btn variant="success" size="sm" onClick={() => handleApprove(a.id, "approved")}>✓</Btn>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div>
          <div style={{ background: G.card, borderRadius: 12, border: `1px solid ${G.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 100px 120px 120px 120px", padding: "12px 16px", background: G.bg, borderBottom: `1px solid ${G.border}`, gap: 12 }}>
              {["User", "Email", "Role", "Can Add KB", "Status", "Action"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: G.textMuted, fontFamily: "Sora, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>
            {users.map(u => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 100px 120px 120px 120px", padding: "14px 16px", borderBottom: `1px solid ${G.border}`, gap: 12, alignItems: "center", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = G.surface}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={u.name} size={32} color={u.role === "admin" ? G.amber : G.blue} />
                  <span style={{ fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 600, color: G.text }}>{u.name}</span>
                </div>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted }}>{u.email}</span>
                <Badge label={u.role === "admin" ? "Admin" : "User"} color={u.role === "admin" ? G.amber : G.blue} />
                <div>
                  <button onClick={() => u.role !== "admin" && toggleUserPerm(u.id)} style={{ width: 44, height: 24, borderRadius: 12, background: u.canAdd ? G.green : G.border, border: "none", cursor: u.role === "admin" ? "default" : "pointer", position: "relative", transition: "all 0.25s" }}>
                    <span style={{ position: "absolute", top: 3, left: u.canAdd ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.25s" }} />
                  </button>
                </div>
                <Badge label={u.active ? "Active" : "Inactive"} color={u.active ? G.green : G.textMuted} />
                <Btn variant="ghost" size="sm">{u.role === "admin" ? "👑 Admin" : "Edit"}</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ALL CATEGORIES PAGE ───────────────────────────────────────────────────────
const CategoriesPage = ({ setPage, setSelectedCat, articles }) => (
  <div>
    <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 24, fontWeight: 800, color: G.white, margin: "0 0 6px" }}>All Categories</h1>
    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: G.textMuted, margin: "0 0 28px" }}>Browse all knowledge base categories for DMS L1 Support.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
      {CATEGORIES.map(cat => {
        const count = articles.filter(a => a.catId === cat.id && a.status === "approved").length;
        return (
          <Card key={cat.id} onClick={() => { setSelectedCat(cat); setPage("category"); }} style={{ padding: "26px 22px" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: cat.color + "22", border: `1px solid ${cat.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{cat.icon}</div>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, color: G.text, margin: "0 0 6px" }}>{cat.name}</h3>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: G.textMuted, margin: "0 0 14px", lineHeight: 1.6 }}>{cat.desc}</p>
            <div style={{ height: 3, background: G.border, borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(count * 10, 100)}%`, background: cat.color, borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: cat.color, fontFamily: "Sora, sans-serif" }}>{count} articles →</div>
          </Card>
        );
      })}
    </div>
  </div>
);

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage_] = useState("dashboard");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedKB, setSelectedKB] = useState(null);
  const [articles, setArticles] = useState(KB_ARTICLES);
  const [users, setUsers] = useState(USERS_DATA);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    document.body.style.background = G.bg;
    document.body.style.margin = "0";
  }, []);

  const setPage = (p) => {
    setPage_(p);
    setSearchQuery("");
    if (p === "logout") { setUser(null); setPage_("dashboard"); }
  };

  const pendingCount = articles.filter(a => a.status === "pending").length;

  if (!user) return <LoginPage onLogin={u => { setUser(u); setPage_("dashboard"); }} />;

  const currentArticle = articles.find(a => a.id === selectedKB?.id) || selectedKB;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard setPage={setPage} setSelectedCat={setSelectedCat} setSelectedKB={setSelectedKB} searchQuery={searchQuery} setSearchQuery={setSearchQuery} articles={articles} user={user} />;
      case "categories": return <CategoriesPage setPage={setPage} setSelectedCat={setSelectedCat} articles={articles} />;
      case "category": return selectedCat ? <CategoryPage cat={selectedCat} setPage={setPage} setSelectedKB={setSelectedKB} articles={articles} /> : null;
      case "detail": return currentArticle ? <DetailPage article={currentArticle} setPage={setPage} user={user} articles={articles} setArticles={setArticles} /> : null;
      case "add-kb": return <AddKBPage setPage={setPage} user={user} articles={articles} setArticles={setArticles} />;
      case "admin": return user.role === "admin" ? <AdminPanel setPage={setPage} articles={articles} setArticles={setArticles} setSelectedKB={setSelectedKB} users={users} setUsers={setUsers} /> : null;
      default: return <Dashboard setPage={setPage} setSelectedCat={setSelectedCat} setSelectedKB={setSelectedKB} searchQuery={searchQuery} setSearchQuery={setSearchQuery} articles={articles} user={user} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "DM Sans, sans-serif" }}>
      <Navbar user={user} page={page} setPage={setPage} notifCount={pendingCount} />
      <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1200, margin: "0 auto", padding: "80px 28px 60px" }}>
        {renderPage()}
      </div>
      <div style={{ borderTop: `1px solid ${G.border}`, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: G.surface }}>
        <span style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>🧠 IT Knowledgebase · L1 DMS Support Portal</span>
        <span style={{ fontSize: 12, color: G.textMuted, fontFamily: "DM Sans, sans-serif" }}>Built for IT Support Teams</span>
      </div>
    </div>
  );
}
