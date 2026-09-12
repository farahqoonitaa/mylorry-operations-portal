/* ==========================================================================
   MYLORRY OPERATIONS PORTAL & PRD - INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

// Layer 1 Normalized Taxonomy & Mock Data
const INITIAL_TRANSACTIONS = [
  {
    id: "TX-892401",
    timestamp: "2026-09-12 14:22:10",
    cardId: "FC-9912",
    driver: "Marcus Vance",
    vehicle: "Ford Transit (Reg: WX68-XPL)",
    tankCapacity: "70 Liters",
    amount: "€142.50",
    volume: "88.5 Liters",
    station: "Shell Station A12, Northbound",
    flagCode: "AMOUNT_EXCEEDS_THRESHOLD",
    flagTitle: "Fuel Volume Exceeds Vehicle Tank Capacity",
    riskScore: "HIGH (92/100)",
    status: "NEW_FLAG",
    partner: "FleetCorp Europe",
    checklistCrossref: "Pre-trip checklist (2026-09-12 07:00): Tank 15%, Odometer 142,300km. Max expected: 62L.",
    anomalyDetails: "Layer 1 Ingestion Service normalized flag to AMOUNT_EXCEEDS_THRESHOLD. Dispensed volume 88.5L exceeds registered 70L tank (+26.4% variance). Secondary container or vehicle suspected.",
    auditTrail: [
      { timestamp: "2026-09-12 14:22:10", author: "SYSTEM (Layer 1 Ingestion Engine)", note: "Normalized legacy flag to AMOUNT_EXCEEDS_THRESHOLD. Raw payload preserved." }
    ]
  },
  {
    id: "TX-892398",
    timestamp: "2026-09-12 13:45:02",
    cardId: "FC-4421",
    driver: "Elena Rostova",
    vehicle: "Volvo FH16 (Reg: KR21-V99)",
    tankCapacity: "400 Liters",
    amount: "€480.00",
    volume: "310.0 Liters",
    station: "BP Logistics Hub, Rotterdam",
    flagCode: "DUPLICATE_CHARGE",
    flagTitle: "Velocity Swipe: Multiple Charges < 5m",
    riskScore: "HIGH (88/100)",
    status: "UNDER_TRIAGE",
    assignedTo: "Sarah Jenkins (Ops Lead)",
    partner: "LogiTrans Group",
    checklistCrossref: "Checklist OK. Driver logged dual-tank fill.",
    anomalyDetails: "Layer 1 Ingestion Service normalized flag to DUPLICATE_CHARGE. Card swiped twice within 4 minutes at adjacent pumps.",
    auditTrail: [
      { timestamp: "2026-09-12 13:45:02", author: "SYSTEM (Layer 1 Ingestion Engine)", note: "Normalized flag to DUPLICATE_CHARGE." },
      { timestamp: "2026-09-12 14:00:15", author: "Sarah Jenkins (Ops)", note: "Assigned to self. Contacted fleet dispatcher to confirm dual tank fill." }
    ]
  },
  {
    id: "TX-892375",
    timestamp: "2026-09-12 11:10:44",
    cardId: "FC-1092",
    driver: "David Chen",
    vehicle: "Mercedes Sprinter (Reg: BN19-KKL)",
    tankCapacity: "75 Liters",
    amount: "€115.00",
    volume: "72.0 Liters",
    station: "TotalEnergies, Lyon South",
    flagCode: "LOCATION_ANOMALY",
    flagTitle: "Station Location Off Authorized Route",
    riskScore: "MEDIUM (65/100)",
    status: "DISPUTED",
    assignedTo: "Finance Audit Team",
    partner: "ExpressFreight Ltd",
    checklistCrossref: "Driver route assigned: Lyon Central Hub to Marseille. Station was 45km off-route.",
    anomalyDetails: "Layer 1 Ingestion Service normalized flag to LOCATION_ANOMALY. Transaction GPS station coordinates do not match route geo-fence.",
    auditTrail: [
      { timestamp: "2026-09-12 11:10:44", author: "SYSTEM (Layer 1 Ingestion Engine)", note: "Normalized flag to LOCATION_ANOMALY." },
      { timestamp: "2026-09-12 12:30:00", author: "Marc Dupuis (Ops)", note: "Disputed. Sent notification to Fleet Administrator for route variance explanation." }
    ]
  },
  {
    id: "TX-892350",
    timestamp: "2026-09-12 03:15:20",
    cardId: "FC-8831",
    driver: "Johann Weber",
    vehicle: "MAN TGX 18.500 (Reg: M-LW-9901)",
    tankCapacity: "500 Liters",
    amount: "€620.00",
    volume: "410.0 Liters",
    station: "Autohof A9, Nurnberg",
    flagCode: "DRIVER_DISPUTE",
    flagTitle: "High-Value Night Swipe (Disputed)",
    riskScore: "HIGH (78/100)",
    status: "UNDER_TRIAGE",
    assignedTo: "Sarah Jenkins (Ops Lead)",
    partner: "FleetCorp Europe",
    checklistCrossref: "Night shift dispatch log approved by Fleet Mgr Hans Gruber.",
    anomalyDetails: "Layer 1 Ingestion Service normalized flag to DRIVER_DISPUTE. Swipe amount €620.00 exceeds €500 threshold.",
    auditTrail: [
      { timestamp: "2026-09-12 03:15:20", author: "SYSTEM (Layer 1 Ingestion Engine)", note: "Normalized flag to DRIVER_DISPUTE." },
      { timestamp: "2026-09-12 08:30:12", author: "Sarah Jenkins (Ops)", note: "Verified night route dispatch log. Submitted for triage review." }
    ]
  },
  {
    id: "TX-892312",
    timestamp: "2026-09-11 19:40:00",
    cardId: "FC-3304",
    driver: "Arthur Pendelton",
    vehicle: "DAF XF 480 (Reg: LS70-DFR)",
    tankCapacity: "450 Liters",
    amount: "€540.00",
    volume: "360.0 Liters",
    station: "Esso Truck Stop, Dover",
    flagCode: "UNKNOWN_LEGACY",
    flagTitle: "Legacy Flag Input (Unspecified)",
    riskScore: "MEDIUM (60/100)",
    status: "DISMISS",
    assignedTo: "Tom Wright (Ops)",
    partner: "LogiTrans Group",
    checklistCrossref: "Driver entered 420,000km instead of 450,000km due to typo.",
    anomalyDetails: "Layer 1 Ingestion Service assigned UNKNOWN_LEGACY fallback. Raw legacy code payload preserved without breaking pipeline.",
    auditTrail: [
      { timestamp: "2026-09-11 19:40:00", author: "SYSTEM (Layer 1 Ingestion Engine)", note: "Flagged UNKNOWN_LEGACY fallback." },
      { timestamp: "2026-09-11 20:15:40", author: "Tom Wright (Ops)", note: "Confirmed typo on mobile pre-trip checklist. Dismissed as false positive." }
    ]
  }
];

let transactions = [...INITIAL_TRANSACTIONS];
let selectedTxId = null;
let currentScenario = "DEFAULT";

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPortalEvents();
  renderTransactions();
  initAssessmentDeck();
});

// View Navigation & Theme Switcher
function initNavigation() {
  const modeBtns = document.querySelectorAll(".mode-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.id === "mobile-toggle-btn") return;

      modeBtns.forEach(b => {
        if (b.id !== "mobile-toggle-btn") b.classList.remove("active");
      });
      tabViews.forEach(v => v.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // Partner Theme Switcher
  const partnerSelect = document.getElementById("partner-select");
  if (partnerSelect) {
    partnerSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "FleetCorp") {
        document.body.className = "partner-theme-dark";
      } else {
        document.body.className = "";
      }
      renderTransactions();
    });
  }
}

// Portal Event Handling
function initPortalEvents() {
  const searchInput = document.getElementById("search-input");
  const flagFilter = document.getElementById("flag-filter");
  const statusFilter = document.getElementById("status-filter");

  if (searchInput) searchInput.addEventListener("input", renderTransactions);
  if (flagFilter) flagFilter.addEventListener("change", renderTransactions);
  if (statusFilter) statusFilter.addEventListener("change", renderTransactions);

  // Drawer Close
  document.getElementById("drawer-close-btn").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", (e) => {
    if (e.target.id === "drawer-overlay") closeDrawer();
  });

  // Case Action Form Submission
  document.getElementById("case-action-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleCaseActionSubmit();
  });
}

// 4 Part D Live Scenario Handler
function handleScenarioChange(scenarioKey) {
  currentScenario = scenarioKey;
  const banner = document.getElementById("scenario-banner-box");
  const title = document.getElementById("scenario-title");
  const desc = document.getElementById("scenario-desc");
  const csvBtn = document.getElementById("csv-export-btn");

  transactions = [...INITIAL_TRANSACTIONS];

  switch(scenarioKey) {
    case "SCENARIO_1":
      banner.style.background = "#fef2f2";
      banner.style.border = "1px solid #fca5a5";
      title.innerHTML = "⚡ Scenario 1 Active: Finance CSV Request + Legacy Data Inconsistency + QA -50% Capacity";
      desc.innerHTML = "<strong>Option C (Recommended):</strong> Ship CSV export scoped to confirmed reason cases. Mark UNKNOWN_LEGACY cases as 'provisional — pending review' in export. Light smoke-test CSV path to protect core approve/reject testing under QA -50% loss.";
      if (csvBtn) csvBtn.style.display = "inline-flex";
      break;

    case "SCENARIO_2":
      banner.style.background = "#faf5ff";
      banner.style.border = "1px solid #e9d5ff";
      title.innerHTML = "⚖️ Scenario 2 Active: Compliance Maker-Checker Mandate (>€500 High-Value Cases)";
      desc.innerHTML = "<strong>Strategy:</strong> Accept 2-step Maker-Checker approval workflow into Sprint 2. Require supervisor secondary sign-off for cases >€500. Defer US-06 (Partner White-labeling styling) to Sprint 3.";
      if (csvBtn) csvBtn.style.display = "none";
      transactions.find(t => t.id === "TX-892350").status = "NEW_FLAG";
      transactions.find(t => t.id === "TX-892350").anomalyDetails += " [COMPLIANCE GATE: Requires Supervisor Maker-Checker Approval]";
      break;

    case "SCENARIO_3":
      banner.style.background = "#eff6ff";
      banner.style.border = "1px solid #bfdbfe";
      title.innerHTML = "🛡️ Scenario 3 Active: Zero-Day Auth Patch & API Security Shift";
      desc.innerHTML = "<strong>Strategy:</strong> Re-prioritize backend capacity to patch Auth microservice vulnerability (4 days BE effort). Replace manual QA testing with automated Cypress API smoke tests. Defer non-essential UI features.";
      if (csvBtn) csvBtn.style.display = "none";
      break;

    case "SCENARIO_4":
      banner.style.background = "#fff1f2";
      banner.style.border = "1px solid #fecdd3";
      title.innerHTML = "🚨 Scenario 4 Active: Partner B High-Volume Fraud Spike (+300% Velocity Swipes)";
      desc.innerHTML = "<strong>Strategy:</strong> Fast-track Partner B Custom Velocity Threshold Engine (US-04) into Sprint 2. Inject real-time alert toasts. Defer non-urgent reporting tasks.";
      if (csvBtn) csvBtn.style.display = "none";
      transactions.unshift({
        id: "TX-892499",
        timestamp: "2026-09-12 16:55:00",
        cardId: "FC-7719",
        driver: "Viktor Krum",
        vehicle: "MAN TGX (Reg: LogiTrans-09)",
        tankCapacity: "400 Liters",
        amount: "€390.00",
        volume: "260.0 Liters",
        station: "Shell Express, Rotterdam",
        flagCode: "DUPLICATE_CHARGE",
        flagTitle: "CRITICAL: 3 Rapid Swipes in 120 Seconds",
        riskScore: "HIGH (99/100)",
        status: "NEW_FLAG",
        partner: "LogiTrans Group",
        checklistCrossref: "Alert: Multiple card swipes detected across adjacent pumps.",
        anomalyDetails: "Partner B Velocity Engine triggered. 3 swipes in 120s totaling €1,170. High fraud probability.",
        auditTrail: [{ timestamp: "2026-09-12 16:55:00", author: "SYSTEM (Partner B Engine)", note: "Critical Fraud Surge Detected." }]
      });
      alert("🚨 Alert: Partner B (LogiTrans) high-volume fraud spike detected! 3 rapid card swipes flagged in Rotterdam!");
      break;

    default:
      banner.style.background = "#fffbeb";
      banner.style.border = "1px solid #fde68a";
      title.innerHTML = "⚡ Live Scenario Simulator: Test Part D Scope & Delivery Changes";
      desc.innerHTML = "Click any of the 4 buttons to simulate real-time mid-sprint change scenarios, re-planning matrices, and UI behavioral shifts.";
      if (csvBtn) csvBtn.style.display = "none";
  }

  renderTransactions();
}
window.handleScenarioChange = handleScenarioChange;

// Render Transactions Table
function renderTransactions() {
  const tbody = document.getElementById("tx-tbody");
  if (!tbody) return;

  const searchQuery = (document.getElementById("search-input")?.value || "").toLowerCase();
  const selectedFlag = document.getElementById("flag-filter")?.value || "ALL";
  const selectedStatus = document.getElementById("status-filter")?.value || "ALL";
  const selectedPartner = document.getElementById("partner-select")?.value || "ALL";

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery) ||
                          tx.driver.toLowerCase().includes(searchQuery) ||
                          tx.vehicle.toLowerCase().includes(searchQuery) ||
                          tx.cardId.toLowerCase().includes(searchQuery);
    
    const matchesFlag = (selectedFlag === "ALL") || (tx.flagCode === selectedFlag);
    const matchesStatus = (selectedStatus === "ALL") || (tx.status === selectedStatus);
    const matchesPartner = (selectedPartner === "ALL") || (tx.partner.includes(selectedPartner));

    return matchesSearch && matchesFlag && matchesStatus && matchesPartner;
  });

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">No suspicious transactions match the selected filters.</td></tr>`;
    return;
  }

  filtered.forEach(tx => {
    const tr = document.createElement("tr");
    tr.addEventListener("click", () => openDrawer(tx.id));

    let flagReasonDisplay = `<span class="flag-chip">${tx.flagCode}</span> <br><small style="color:var(--text-secondary);">${tx.flagTitle}</small>`;
    if (currentScenario === "SCENARIO_1" && tx.flagCode === "UNKNOWN_LEGACY") {
      flagReasonDisplay = `<span class="flag-chip" style="background:#fffbeb; color:#b45309; border-color:#fde68a;">UNKNOWN_LEGACY</span> <br><small style="color:#b45309;">⚠️ Layer 1 Fallback Active</small>`;
    }

    tr.innerHTML = `
      <td><strong>${tx.id}</strong><br><small style="color:var(--text-muted);">${tx.timestamp}</small></td>
      <td><strong>${tx.driver}</strong><br><small style="color:var(--text-muted);">${tx.cardId}</small></td>
      <td>${tx.vehicle}</td>
      <td><strong>${tx.amount}</strong><br><small style="color:var(--text-secondary);">${tx.volume}</small></td>
      <td>${flagReasonDisplay}</td>
      <td><small style="color:var(--accent-indigo); font-weight:700;">${tx.partner}</small></td>
      <td>${getStatusBadgeHtml(tx.status)}</td>
      <td><button class="btn btn-secondary" style="padding:5px 10px; font-size:0.775rem;">Inspect & Action</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function getStatusBadgeHtml(status) {
  switch (status) {
    case "NEW_FLAG": return `<span class="badge badge-new">● New Flag</span>`;
    case "UNDER_TRIAGE": return `<span class="badge badge-triage">⏳ Under Triage</span>`;
    case "DISPUTED": return `<span class="badge badge-dispute">⚖️ Disputed</span>`;
    case "RESOLVED": return `<span class="badge badge-resolved">✓ Resolved</span>`;
    case "DISMISS": return `<span class="badge badge-dismissed">✕ Dismissed</span>`;
    default: return `<span class="badge">${status}</span>`;
  }
}

// Drawer Logic
function openDrawer(txId) {
  selectedTxId = txId;
  const tx = transactions.find(t => t.id === txId);
  if (!tx) return;

  document.getElementById("drawer-tx-id").textContent = tx.id;
  document.getElementById("drawer-driver-name").textContent = tx.driver;
  document.getElementById("drawer-vehicle").textContent = tx.vehicle;
  document.getElementById("drawer-tank-cap").textContent = tx.tankCapacity;
  document.getElementById("drawer-amount-vol").textContent = `${tx.amount} (${tx.volume})`;
  document.getElementById("drawer-station").textContent = tx.station;
  document.getElementById("drawer-partner").textContent = tx.partner;
  document.getElementById("drawer-risk-score").textContent = tx.riskScore;
  
  let anomalyText = `<strong>Layer 1 Normalized Reason: ${tx.flagCode}</strong><br>${tx.anomalyDetails}`;
  if (currentScenario === "SCENARIO_2" && parseFloat(tx.amount.replace('€','')) > 500) {
    anomalyText += `<br><span style="color:#7e22ce; font-weight:700;">⚖️ Maker-Checker Rule: Case >€500 requires Supervisor secondary approval before resolution.</span>`;
  }
  document.getElementById("drawer-anomaly-box").innerHTML = anomalyText;

  document.getElementById("drawer-checklist-box").textContent = tx.checklistCrossref;

  // Set form inputs
  document.getElementById("action-status-select").value = tx.status === "DISMISS" ? "DISMISS" : tx.status;
  document.getElementById("action-assignee").value = tx.assignedTo || "Sarah Jenkins (Ops Lead)";
  document.getElementById("action-note").value = "";

  renderAuditTrail(tx.auditTrail);

  const overlay = document.getElementById("drawer-overlay");
  overlay.classList.add("active");
}

function closeDrawer() {
  const overlay = document.getElementById("drawer-overlay");
  overlay.classList.remove("active");
  selectedTxId = null;
}

function renderAuditTrail(auditTrail) {
  const container = document.getElementById("drawer-timeline");
  container.innerHTML = "";

  auditTrail.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <div class="timeline-time">${item.timestamp}</div>
      <div class="timeline-content">
        <span class="timeline-author">${item.author}:</span> ${item.note}
      </div>
    `;
    container.appendChild(div);
  });
}

function handleCaseActionSubmit() {
  if (!selectedTxId) return;

  const txIndex = transactions.findIndex(t => t.id === selectedTxId);
  if (txIndex === -1) return;

  const newStatus = document.getElementById("action-status-select").value;
  const assignee = document.getElementById("action-assignee").value;
  const reasonCode = document.getElementById("action-reason-code").value;
  const noteText = document.getElementById("action-note").value.trim();

  if (!noteText) {
    alert("Please provide an explicit, accountable note for the immutable audit trail.");
    return;
  }

  // Maker-Checker Check for Scenario 2
  if (currentScenario === "SCENARIO_2" && parseFloat(transactions[txIndex].amount.replace('€','')) > 500 && newStatus === "RESOLVED") {
    alert("⚖️ Compliance Maker-Checker Gate: High-value cases (>€500) require secondary Supervisor sign-off. Status set to DISPUTED (Pending Supervisor Approval).");
    transactions[txIndex].status = "DISPUTED";
    transactions[txIndex].assignedTo = "Compliance Supervisor";
  } else {
    transactions[txIndex].status = newStatus;
    transactions[txIndex].assignedTo = assignee;
  }

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const fullNote = `[Reason: ${reasonCode}] Status updated to ${transactions[txIndex].status}. Assigned to ${transactions[txIndex].assignedTo}. Note: ${noteText}`;
  transactions[txIndex].auditTrail.push({
    timestamp: nowStr,
    author: "Current User (Ops Manager)",
    note: fullNote
  });

  renderAuditTrail(transactions[txIndex].auditTrail);
  renderTransactions();
  alert(`Case ${selectedTxId} updated successfully. Immutable audit record appended.`);
}

// Mobile Frame Emulator Toggle
function toggleMobileEmulator() {
  document.body.classList.toggle("mobile-frame-active");
  const btn = document.getElementById("mobile-toggle-btn");
  if (btn) {
    if (document.body.classList.contains("mobile-frame-active")) {
      btn.textContent = "🖥️ Exit Mobile Frame";
      btn.style.background = "#4f46e5";
      btn.style.color = "#ffffff";
    } else {
      btn.textContent = "📱 Mobile Phone Frame";
      btn.style.background = "transparent";
      btn.style.color = "var(--text-secondary)";
    }
  }
}
window.toggleMobileEmulator = toggleMobileEmulator;

// CSV Export Simulation for Part D
function exportFinanceCSV() {
  let csv = "Transaction_ID,Timestamp,Driver,Card_ID,Vehicle,Amount,Volume,Normalized_Flag_Reason,Status,Partner,Assigned_To\n";
  transactions.forEach(t => {
    csv += `"${t.id}","${t.timestamp}","${t.driver}","${t.cardId}","${t.vehicle}","${t.amount}","${t.volume}","${t.flagCode}","${t.status}","${t.partner}","${t.assignedTo || 'Unassigned'}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.getElementById("csv-export-btn");
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `MyLorry_Finance_Exceptions_Export_${new Date().toISOString().substring(0,10)}.csv`;
  downloadLink.click();
}
window.exportFinanceCSV = exportFinanceCSV;

// Assessment Deck Navigation & Content Rendering
function initAssessmentDeck() {
  const navBtns = document.querySelectorAll(".ass-nav-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const sectionKey = btn.getAttribute("data-section");
      renderAssessmentSection(sectionKey);
    });
  });
  renderAssessmentSection("full-prd");
}

function renderAssessmentSection(key) {
  const container = document.getElementById("ass-content-area");
  if (!container) return;

  switch(key) {
    case "full-prd": container.innerHTML = getFullPrdHtml(); break;
    case "exec-brief": container.innerHTML = getExecBriefHtml(); break;
    case "part-a": container.innerHTML = getPartAHtml(); break;
    case "part-b": container.innerHTML = getPartBHtml(); break;
    case "part-c": container.innerHTML = getPartCHtml(); break;
    case "part-d": container.innerHTML = getPartDHtml(); break;
    case "part-e": container.innerHTML = getPartEHtml(); break;
    case "part-f": container.innerHTML = getPartFHtml(); break;
    default: container.innerHTML = getFullPrdHtml();
  }
}

/* Render Sections matching Farah's PRD Document Text Exactly */
function getFullPrdHtml() {
  return `
    <div class="ass-header">
      <h2>PRODUCT REQUIREMENTS DOCUMENT</h2>
      <p style="font-size:1.1rem; font-weight:700; color:var(--accent-indigo);">MyLorry Operations Portal — Transaction Review & Exception Handling</p>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px; line-height:1.4;">
        <strong>Prepared by:</strong> Farah | <strong>Prepared for:</strong> TUG — Delivery Manager & Product Owner Candidate Assessment<br>
        <strong>Date:</strong> September 2026 | <strong>Classification:</strong> Assessment submission — anonymised, no production data
      </div>
    </div>

    <div class="callout callout-tip" style="margin-bottom:1.5rem;">
      <strong>HOW TO READ THIS DOCUMENT:</strong> This PRD follows a situation → complication → resolution structure. Every recommendation is traceable to a stated stakeholder need or brief requirement. Facts (sourced) and assumptions (to be validated) are labelled throughout — see Section 11 for the full register.
    </div>

    <!-- Table of Contents Grid -->
    <div class="doc-section" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1.25rem; margin-bottom:2rem;">
      <h3 style="margin-top:0; font-size:1rem; border-bottom:1px solid #cbd5e1; padding-bottom:6px;">📌 Table of Contents</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:8px; font-size:0.85rem;">
        <div><strong>1.</strong> Executive Summary</div>
        <div><strong>2.</strong> Problem Statement, Users & Outcomes</div>
        <div><strong>3.</strong> Discovery Approach & 360° Stakeholder View</div>
        <div><strong>4.</strong> Clarification Question Log</div>
        <div><strong>5.</strong> Requirements Model</div>
        <div><strong>6.</strong> Solution Architecture & Scope Map</div>
        <div><strong>7.</strong> Delivery Plan</div>
        <div><strong>8.</strong> Change Scenario Response (Part D)</div>
        <div><strong>9.</strong> Release Readiness & Success Measures</div>
        <div><strong>10.</strong> AI Usage & Verification Log</div>
        <div><strong>11.</strong> Assumptions & Open Decisions Register</div>
        <div><strong>12.</strong> Sources & References</div>
      </div>
    </div>

    <div class="callout callout-important">
      <strong>BOTTOM LINE:</strong> Fix the data before polishing the UI. Every stakeholder's request collapses to the same dependency: a trustworthy, normalized reason code.<br>
      <strong>Confidence:</strong> Medium-High, contingent on one testable assumption validated on Day 1 of discovery (Section 4).
    </div>

    <!-- Section 1 -->
    <div class="doc-section">
      <h3>1. Executive Summary</h3>
      <p><strong>Situation:</strong> MyLorry operates a fleet-card platform for logistics companies, competing on a stated promise of "Security and Fraud Protection" alongside expense tracking and fuel cost savings. The current operations portal supports login, balances, transaction history, and driver checklists — but has no structured capability for reviewing flagged or disputed fuel transactions.</p>
      <p><strong>Complication:</strong> The business has requested a pilot-ready Transaction Review & Exception Handling capability within six weeks, using a team of one frontend engineer, one backend engineer, shared QA, and a part-time designer. Five stakeholder groups — Operations, Finance, Compliance, Customer Success, and Engineering — have each stated a distinct need. Critically, Engineering has flagged that the underlying flag-reason data is inconsistent and notifications are not production-ready. This is not a UI gap; it is a data-trust gap that sits underneath every stakeholder's request.</p>
      <p><strong>Resolution:</strong> We recommend piloting a single-partner Transaction Review capability built on a normalized reason-code layer — fixing the data-trust problem before building the review workflow on top of it. This single move resolves all five stakeholders' stated needs simultaneously (see Section 3, the 360° Stakeholder View). We explicitly defer four adjacent ideas — CSV export, tokenized wallet payments, receipt-photo/delivery-plan auto-matching, and AI auto-approval — each for a stated, evidence-based reason rather than a generic time constraint (Section 6).</p>
      
      <table class="styled-table">
        <tr><th>Dimension</th><th>Summary</th></tr>
        <tr><td><strong>Problem</strong></td><td>No structured, auditable way to triage flagged fuel transactions; root blocker is inconsistent flag-reason data.</td></tr>
        <tr><td><strong>Target users</strong></td><td>Operations reviewers (internal); fleet company admins as informed, non-editing participants (to confirm).</td></tr>
        <tr><td><strong>Outcome</strong></td><td>Every pilot case shows a trustworthy reason, an owner, an action, and an immutable audit trail.</td></tr>
        <tr><td><strong>Scope</strong></td><td>Single partner, one capability: review queue + normalized reasoning + audit log.</td></tr>
        <tr><td><strong>Key trade-off</strong></td><td>Slower to demo in Week 1 (data work is invisible); faster and safer to trust from Week 3 onward.</td></tr>
        <tr><td><strong>Confidence</strong></td><td>Medium-High — gated by Day 1 validation that legacy flag data can be mapped programmatically.</td></tr>
      </table>
    </div>

    <!-- Section 2 -->
    <div class="doc-section">
      <h3>2. Problem Statement, Users & Outcomes</h3>
      <p><strong>Problem statement:</strong> Operations users cannot reliably triage flagged fuel transactions because flag reasons are inconsistent at the data layer, and no structured, auditable workflow exists to act on them. Disputes stay open longer than necessary, Compliance has no defensible audit trail, and Customer Success absorbs confusion from fleet administrators who cannot get a straight answer about a flagged charge.</p>
      <p><strong>Target users:</strong><br>
      • <em>Primary:</em> MyLorry Operations reviewers, who triage and resolve flagged cases.<br>
      • <em>Secondary (to confirm in discovery):</em> fleet company administrators, who may view case status but should not edit records.</p>
      
      <p><strong>Jobs-to-be-done:</strong><br>
      • When a transaction is flagged, I need to understand why — in language I can trust — so I can decide what to do next.<br>
      • When I take an action, I need it recorded permanently and attributably, so the business is protected if anyone asks later.<br>
      • When Finance or a fleet admin asks about a case, I need a fast, confident answer — not a manual investigation.</p>

      <p><strong>Intended outcomes:</strong></p>
      <table class="styled-table">
        <tr><th>Outcome</th><th>Measure</th></tr>
        <tr><td><strong>Speed</strong></td><td>Median time from flag to first action or resolution.</td></tr>
        <tr><td><strong>Control</strong></td><td>% of resolved cases with complete reason code, owner, and audit trail.</td></tr>
        <tr><td><strong>Quality</strong></td><td>Reopen rate; incorrect-resolution rate; UAT escape rate.</td></tr>
        <tr><td><strong>Adoption</strong></td><td>% of eligible Operations users completing the workflow in-tool (not via spreadsheet workaround).</td></tr>
        <tr><td><strong>Business</strong></td><td>Change in unresolved disputes and manual reconciliation effort reported by Finance.</td></tr>
      </table>
    </div>

    <!-- Section 3 -->
    <div class="doc-section">
      <h3>3. Discovery Approach & 360° Stakeholder View</h3>
      <p><strong>Discovery sequencing:</strong> Discovery is sequenced by which answer most changes downstream scope — not by stakeholder seniority. Engineering and Compliance go first because their answers are constraints (not negotiable trade-offs); Operations and Finance follow to shape workflow; Customer Success closes the loop on usability.</p>
      
      ${getStakeholderMatrixHtml()}

      <table class="styled-table">
        <tr><th>Day</th><th>Stakeholder</th><th>Why First/Next</th></tr>
        <tr><td>Day 1</td><td><strong>Engineering</strong></td><td>Confirms whether flag-reason data can be programmatically normalized — gates the entire plan.</td></tr>
        <tr><td>Day 1</td><td><strong>Compliance</strong></td><td>Immutability, reason codes, and least-privilege access are constraints, not trade-offs to negotiate later.</td></tr>
        <tr><td>Day 2</td><td><strong>Operations</strong></td><td>Real workflow shape, case volume, and current manual process.</td></tr>
        <tr><td>Day 2</td><td><strong>Finance</strong></td><td>Reconciliation and export needs; informs but does not override the MVP cut.</td></tr>
        <tr><td>Day 3</td><td><strong>Customer Success</strong></td><td>Usability check — can a fleet admin understand this without training.</td></tr>
      </table>

      <p><strong>360° stakeholder view:</strong> Mapping every stakeholder's stated pain against what the pilot must deliver reveals a single common dependency underneath all five requests.</p>

      <table class="styled-table">
        <tr><th>Stakeholder</th><th>Pain today</th><th>What they need from the pilot</th><th>Risk if ignored</th></tr>
        <tr><td><strong>Operations</strong></td><td>No queue — cases found ad hoc, no ownership.</td><td>Filterable queue, trustworthy reason, assign/note, fast action.</td><td>Keeps working around the system — pilot fails adoption metric.</td></tr>
        <tr><td><strong>Finance</strong></td><td>Disputes stay open; no clean reconciliation source.</td><td>Cases resolve with a clear reason and status.</td><td>Escalates to sponsor mid-pilot (modelled in Section 7).</td></tr>
        <tr><td><strong>Compliance</strong></td><td>No audit trail today; no least-privilege model.</td><td>Immutable history, reason codes, role-gated actions.</td><td>Regulatory exposure — a constraint, not a trade-off.</td></tr>
        <tr><td><strong>Customer Success</strong></td><td>Support tickets from confused fleet admins.</td><td>Simple enough to self-serve without training.</td><td>CS absorbs the burden the tool was meant to remove.</td></tr>
        <tr><td><strong>Engineering</strong></td><td>Flag-reason data inconsistent; notifications not production-ready.</td><td>A scope that doesn't pretend the data problem isn't there.</td><td>UI ships on broken data — looks done, isn't trusted.</td></tr>
      </table>

      <div class="callout callout-important">
        <strong>THE THREAD:</strong> Every row above resolves to the same fix: a trustworthy, normalized reason code. That is the one place all five stakeholders' needs actually meet — and it is why Sprint 1 is a data task, not a UI task.
      </div>
    </div>

    <!-- Section 4 -->
    <div class="doc-section">
      <h3>4. Clarification Question Log</h3>
      <p>Questions are ranked by how materially the answer changes scope. Facts already confirmed via MyLorry's public product information (mylorry.ai) are marked accordingly and removed from the open list.</p>

      <p><strong>Open questions — highest value first:</strong></p>
      <table class="styled-table">
        <tr><th>Question</th><th>Why it materially changes the plan</th><th>Owner</th></tr>
        <tr><td>Can historical flag reasons be mapped programmatically to a fixed taxonomy, or do some require manual, case-by-case judgment?</td><td>If manual judgment is required at scale, the 6-week pilot must narrow to newer transactions only — this is the single largest risk to the plan.</td><td>Engineering lead</td></tr>
        <tr><td>Is the pilot scoped to one partner, or must it demonstrate multi-partner behaviour from day one?</td><td>Largest lever on scope; multi-partner from day one roughly doubles validation work (config, permissions, data isolation).</td><td>Sponsor</td></tr>
        <tr><td>What is current monthly volume of flagged/disputed transactions?</td><td>Shapes SLA design, queue pagination, and whether "fast triage" needs bulk actions in the pilot or can wait.</td><td>Operations lead</td></tr>
        <tr><td>Who has authority to close or reopen a case — single approver, or maker-checker?</td><td>Determines the permission model and audit design; maker-checker adds a second role and a second UI state.</td><td>Compliance</td></tr>
        <tr><td>Does a case-management concept already exist elsewhere in the MyLorry platform?</td><td>Reuse versus build-from-scratch materially changes the Sprint 1 estimate.</td><td>Engineering lead</td></tr>
        <tr><td>Under whose license is MyLorry issuing/processing fleet-card transactions — own e-money license or a partner bank's rails?</td><td>Determines which regulatory obligations (e.g., Bank Negara Malaysia guidelines) actually bind this capability's audit and retention requirements.</td><td>Compliance</td></tr>
      </table>

      <div class="callout callout-tip">
        <strong>Already resolved (fact, not assumption):</strong><br>
        • MyLorry is a Malaysian entity (Sdn. Bhd.) — compliance framing should reference Malaysian payment-instrument norms, not generic assumptions.<br>
        • Customers onboard via WhatsApp with manual company registration (Name, Address, SSM, vehicle/card count) — confirms a lean, low-tech-touch B2B customer base, supporting a simple-by-design UX bias.<br>
        • A separate customer-facing admin portal exists (admin.mylorry.ai) — supports the assumption that "Operations users" may include external fleet admins, not only internal MyLorry staff.<br>
        • "Security and Fraud Protection" is an existing, stated brand promise — this pilot fulfils an existing commitment rather than introducing a new one.
      </div>
    </div>

    <!-- Section 5 -->
    <div class="doc-section">
      <h3>5. Requirements Model</h3>
      <p><strong>Functional requirements:</strong><br>
      • Normalize inbound flag data into a fixed, versioned reason-code taxonomy at ingestion (e.g., <code>LOCATION_ANOMALY</code>, <code>DUPLICATE_CHARGE</code>, <code>AMOUNT_EXCEEDS_THRESHOLD</code>, <code>DRIVER_DISPUTE</code>, <code>UNKNOWN_LEGACY</code>).<br>
      • Case list view: filter/sort by status, partner, date range, and reason code.<br>
      • Case detail view: transaction data, normalized reason and context, activity history.<br>
      • Note capture and owner assignment on a case.<br>
      • Approve/reject action with a mandatory reason code — no action can be saved without one.<br>
      • Append-only audit log: every state change is recorded, never overwritten.</p>

      <p><strong>Business rules:</strong><br>
      • A transaction that cannot be confidently mapped to a known reason is shown as <code>UNKNOWN_LEGACY</code> — never hidden, never guessed.<br>
      • No record may be edited in place; corrections are new entries that reference the original.<br>
      • An action without a reason code is invalid and cannot be submitted.</p>

      <p><strong>Roles & permissions (draft — to validate with Compliance):</strong></p>
      <table class="styled-table">
        <tr><th>Role</th><th>Can view</th><th>Can act</th></tr>
        <tr><td><strong>Operations reviewer</strong></td><td>All cases in assigned partner scope.</td><td>Assign, note, approve/reject with reason code.</td></tr>
        <tr><td><strong>Compliance auditor</strong></td><td>All cases, all partners, full history.</td><td>Read-only; cannot modify records.</td></tr>
        <tr><td><strong>Fleet admin (external, to confirm)</strong></td><td>Own organisation's cases and status.</td><td>None — view only, pending Day 2 confirmation with Operations.</td></tr>
      </table>

      <p><strong>Data & non-functional requirements:</strong><br>
      • Reason-code mapping must be backward-compatible: old records are reprocessed under the current taxonomy version, never silently rewritten.<br>
      • One authoritative reason-code table, versioned, so partner-specific rule sources map into it without duplicating backend logic.<br>
      • Audit log entries are immutable and retained per Compliance's retention requirement (to confirm exact duration).<br>
      • Core case-management logic is shared across partners; only presentation (branding, visible reason-code subset) is partner-configurable.</p>
    </div>

    <!-- Section 6 -->
    <div class="doc-section">
      <h3>6. Solution Architecture & Scope Map</h3>
      <p>The solution is organized in layers, each traceable to a specific stakeholder need identified in Section 3. Layers 1–3 are in scope for the six-week pilot; Layer 4 is an architectural constraint governing how Layers 1–3 are built; Layer 5 lists ideas evaluated and explicitly deferred, each for a stated reason.</p>
      
      ${getCurrentVsFutureContrastHtml()}

      <p><strong>Layer 1 — Data foundation (Sprint 1):</strong> Reason-code normalization service. Maps inconsistent legacy flag inputs into the fixed taxonomy defined in Section 5. Runs at ingestion; reprocesses old records rather than rewriting them. Serves all five stakeholders simultaneously — this is the root cause named in the brief, not a nice-to-have.</p>
      <p><strong>Layer 2 — Core review workflow (Sprint 1–2):</strong> The visible product: filterable queue, case detail, note/assign, approve/reject with mandatory reason code. Serves Operations (speed, ownership) and Finance (resolution reduces open disputes).</p>
      <p><strong>Layer 3 — Audit & compliance (Sprint 2):</strong> Immutable audit log and role-based permissions. Makes Layer 2's actions trustworthy and defensible — this is what turns a review tool into a compliant one.</p>
      <p><strong>Layer 4 — Architecture constraint (governs Sprints 1–3):</strong> Shared backend, partner-agnostic core logic; partner-configurable frontend only (branding, visible reason-code subset). Validated through API contract review, not built as a separate feature.</p>

      <p><strong>Layer 5 — Deferred, with stated reasons:</strong></p>
      <table class="styled-table">
        <tr><th>Idea</th><th>Why it's deferred</th></tr>
        <tr><td><strong>CSV export</strong></td><td>Finance's ask, but resolution rate matters more to pilot success than export; revisit if forced in by a change scenario.</td></tr>
        <tr><td><strong>Tokenized / wallet card payments</strong></td><td>Infrastructure and partnership project (card-network tokenization, Apple/Google Pay agreements, PCI scope) — months, not weeks, and outside this team's control.</td></tr>
        <tr><td><strong>Receipt-photo + delivery-plan auto-matching, with auto-approval</strong></td><td>Depends on an unconfirmed data source (route-planning system); reintroduces OCR; auto-approval risks silently clearing fraud before a human-reviewed baseline exists.</td></tr>
        <tr><td><strong>Full AI auto-approval</strong></td><td>Same trust problem as above — an unaudited automated approver contradicts Compliance's "no silent record changes" requirement.</td></tr>
        <tr><td><strong>AI-assisted triage (summarize case, suggest reason code, draft audit note — human decides)</strong></td><td>Genuinely valuable, but needs Layer 1's clean data to be trustworthy. Positioned for Sprint 3+ / post-pilot, not excluded outright.</td></tr>
        <tr><td><strong>Cross-partner rollout</strong></td><td>Prove the shared-backend model once, on one partner, before scaling configuration and data-isolation risk across many.</td></tr>
      </table>

      <p><strong>Prioritisation method:</strong> MoSCoW applied against the stated outcomes in Section 2: Must-have items are those without which the audit/compliance promise fails outright (Layers 1 and 3); Should-have covers workflow efficiency (Layer 2 beyond the minimal path); Could-have is AI-assisted triage; Won't-have (this pilot) is everything in Layer 5's table. This ties every scope decision back to a named outcome rather than a generic sense of importance.</p>
    </div>

    <!-- Section 7 -->
    <div class="doc-section">
      <h3>7. Delivery Plan</h3>
      <p><strong>Sprint goals:</strong></p>
      <table class="styled-table">
        <tr><th>Sprint</th><th>Weeks</th><th>Goal</th></tr>
        <tr><td><strong>Sprint 1</strong></td><td>1–2</td><td>Reason-code normalization live; walking-skeleton queue showing normalized reasons, read-only.</td></tr>
        <tr><td><strong>Sprint 2</strong></td><td>3–4</td><td>Note/assign, approve-reject with mandatory reason code, immutable audit log, permissions.</td></tr>
        <tr><td><strong>Sprint 3</strong></td><td>5–6</td><td>UAT, hardening, single-partner pilot rollout, go/no-go.</td></tr>
      </table>

      <p><strong>Decision gates:</strong><br>
      • <em>Gate 1 (end Sprint 1):</em> flag-reason data quality confirmed usable programmatically — or pilot scope narrows to newer transactions only.<br>
      • <em>Gate 2 (end Sprint 2):</em> permissions and audit model signed off by Compliance.<br>
      • <em>Gate 3 (end Sprint 3):</em> go/no-go for pilot cohort release.</p>

      <p><strong>RAID log (initial):</strong></p>
      <table class="styled-table">
        <tr><th>Type</th><th>Item</th><th>Owner</th><th>Mitigation / escalation</th></tr>
        <tr><td><strong>Risk</strong></td><td>Legacy flag data cannot be programmatically normalized for all cases.</td><td>Engineering lead</td><td>Validate Day 1; if false, narrow pilot to newer transactions and escalate scope change to sponsor.</td></tr>
        <tr><td><strong>Risk</strong></td><td>QA capacity is shared and may be pulled to other priorities mid-sprint.</td><td>Delivery Manager</td><td>Protect QA time in sprint planning; escalate contention to sponsor before it blocks a sprint goal.</td></tr>
        <tr><td><strong>Assumption</strong></td><td>"Operations users" includes external fleet admins as view-only participants.</td><td>Operations lead</td><td>Confirm Day 2; if false, simplify permission model.</td></tr>
        <tr><td><strong>Dependency</strong></td><td>Compliance sign-off on permission/audit model before Sprint 2 work is considered done.</td><td>Compliance</td><td>Schedule review at Sprint 2 midpoint, not just at the end.</td></tr>
        <tr><td><strong>Issue</strong></td><td>Notifications are not production-ready per Engineering.</td><td>Engineering lead</td><td>Excluded from pilot scope; tracked as a known gap for post-pilot roadmap.</td></tr>
      </table>

      <p><strong>Governance & communication:</strong><br>
      • Sponsor updates: weekly, outcome-framed (progress against Section 2 metrics, not task counts).<br>
      • Delivery team: daily stand-up, sprint review/retro at each sprint boundary.<br>
      • Change requests evaluated against outcome, capacity, risk, and release commitment — see Section 8 for a worked example.<br>
      • Decision rights: Delivery Manager owns sequencing and trade-offs within agreed scope; sponsor owns scope changes; Compliance owns audit/permission sign-off.</p>
    </div>

    <!-- Section 8 -->
    <div class="doc-section">
      <h3>8. Change Scenario Response (Live, Part D)</h3>
      <div class="callout callout-warning">
        <strong>SCENARIO:</strong> Assume Sprint 1 has finished. The sponsor requests CSV export before the pilot because Finance considers it essential. Engineering confirms historical flag reasons are inconsistent, so some cases cannot yet show a reliable explanation. QA capacity drops 50% for Sprint 2.
      </div>

      <p><strong>Impact assessment:</strong><br>
      • <em>Outcome:</em> export doesn't move the pilot's core success metrics (speed, control, adoption) — it is Finance's convenience, not the pilot's proof point.<br>
      • <em>Data quality:</em> exporting cases whose reason is <code>UNKNOWN_LEGACY</code> risks Finance treating unreliable data as reconciled fact.<br>
      • <em>Compliance:</em> an export must not bypass the audit trail — it is a read, not a new write path.<br>
      • <em>Schedule/capacity:</em> adding export work while QA capacity halves risks under-testing the core workflow that Compliance depends on.</p>

      <p><strong>Options:</strong></p>
      <table class="styled-table">
        <tr><th>Option</th><th>Description</th><th>Trade-off</th></tr>
        <tr><td>Option A</td><td>Ship CSV export as requested, defer the data-quality fix.</td><td>Risk: exports partial or misleading data for UNKNOWN_LEGACY cases.</td></tr>
        <tr><td>Option B</td><td>Hold export entirely until data quality is fixed.</td><td>Risk: sponsor/Finance friction; may look unresponsive to a stated business need.</td></tr>
        <tr><td><strong>Option C — Recommended</strong></td><td>Ship export scoped to cases with a confirmed reason code; flag UNKNOWN_LEGACY cases as "provisional — pending review" in the export; re-sequence QA to protect the core approve/reject and audit-log path, moving export testing to a lighter smoke-test pass.</td><td>Slightly less complete export in Sprint 2; fully explicit and defensible with both Finance and Compliance.</td></tr>
      </table>

      <p><strong>Messaging:</strong><br>
      • <em>Sponsor / Finance:</em> "We can deliver export this sprint for cases with a confirmed reason — about [X]% of volume based on current data. Cases still resolving a legacy reason will be clearly marked provisional rather than silently included as clean data. This protects the numbers you'll actually rely on."<br>
      • <em>Delivery team:</em> "Export is scoped down, not added in full — we are not taking on unscoped work under reduced QA capacity. Core approve/reject and audit-log paths remain the protected path through full testing; export gets a lighter smoke test this sprint."</p>
    </div>

    <!-- Section 9 -->
    <div class="doc-section">
      <h3>9. Release Readiness & Success Measures</h3>
      <p><strong>UAT approach:</strong><br>
      • Participants: 2–3 Operations reviewers from the pilot partner, one Compliance reviewer, one Finance reviewer.<br>
      • Scenarios: normal approve, normal reject, <code>UNKNOWN_LEGACY</code> case handling, reopen, permission-denied attempt.<br>
      • Environment: anonymised staging data mirroring production volume patterns; no real customer data.<br>
      • Defect handling: P1 (blocks audit integrity or approve/reject) fixed before go-live; P2 logged for fast-follow.</p>

      <p><strong>Go/no-go criteria:</strong></p>
      <table class="styled-table">
        <tr><th>Area</th><th>Criteria</th></tr>
        <tr><td>Product</td><td>MVP stories from Section 6 accepted; UNKNOWN_LEGACY handling verified in UAT.</td></tr>
        <tr><td>Technical</td><td>API contracts stable; no open P1 defects.</td></tr>
        <tr><td>Security / Compliance</td><td>Least-privilege verified; audit log confirmed immutable under test.</td></tr>
        <tr><td>Support / Training</td><td>Customer Success briefed; one-page fleet-admin guide ready (if external view access ships).</td></tr>
        <tr><td>Operational ownership</td><td>Named owner assigned for post-pilot monitoring and case-volume review.</td></tr>
      </table>

      <p><strong>Rollout & recovery:</strong><br>
      • Pilot cohort: single partner, feature-flagged so it can be disabled without a redeploy.<br>
      • Monitoring: case-resolution time and reopen rate watched daily in week one.<br>
      • Rollback: disable feature flag; underlying transaction data is untouched since the audit log is append-only — no destructive rollback risk.</p>

      <p><strong>Post-release outcome review:</strong> Reviewed at two weeks post-pilot against the Section 2 metrics. A miss on the adoption metric (Operations reverting to spreadsheets) is treated as a workflow-design signal, not a training gap, and triggers a UX review before scaling to a second partner.</p>
    </div>

    <!-- Section 10 -->
    <div class="doc-section">
      <h3>10. AI Usage & Verification Log</h3>
      <p>AI was used for exploration, domain research, and idea stress-testing throughout this PRD's development. No AI-generated text was submitted without independent verification against the brief, publicly available MyLorry product information, or the author's own domain reasoning.</p>

      <table class="styled-table">
        <tr><th>Task & tool</th><th>Intent / inputs</th><th>Verification</th><th>Human change</th></tr>
        <tr>
          <td>Explored real-world fleet-card fraud signal patterns (web research + LLM synthesis)</td>
          <td>Ground the reason-code taxonomy in real industry practice rather than invented categories.</td>
          <td>Cross-checked against MyLorry's own public product claims (mylorry.ai) and the brief's stated stakeholder signals.</td>
          <td>Rejected a suggested real-time ML fraud-scoring engine as out of scope for a 6-week pilot with 2.5 engineers and no clean training data yet.</td>
        </tr>
        <tr>
          <td>Evaluated a proposed "receipt photo + delivery-plan auto-matching with auto-approval" feature</td>
          <td>Assess whether automated reconciliation could replace manual review.</td>
          <td>Checked the idea against Compliance's stated "no silent record changes" requirement and against data sources actually confirmed to exist.</td>
          <td>Rejected auto-approval outright; identified that the receipt-photo step reintroduces OCR, contradicting an earlier, separately-evaluated wallet/digital-card direction. Redirected to a smaller, evidence-only version (attach receipt, no auto-matching).</td>
        </tr>
        <tr>
          <td>Considered a full AI "auto-approval engine" for flagged transactions</td>
          <td>Test whether AI could accelerate case resolution beyond assistive suggestions.</td>
          <td>Weighed against the assessment brief's own "Responsible AI Use" standard ("AI is allowed; unreviewed AI output is not") and Compliance's audit requirement.</td>
          <td>Scoped down to AI-assisted triage only — summarization and suggestion, with a human reviewer always making and owning the final decision. Positioned as Sprint 3+/post-pilot, not core MVP.</td>
        </tr>
      </table>

      <p>No task in this PRD was completed entirely without AI assistance; equally, no artifact above was accepted as generated — each was checked against the brief, confirmed MyLorry facts, or stated stakeholder constraints, and materially edited or rejected where it did not hold up.</p>
    </div>

    <!-- Section 11 -->
    <div class="doc-section">
      <h3>11. Assumptions & Open Decisions Register</h3>
      <table class="styled-table">
        <tr><th>#</th><th>Statement</th><th>Type</th><th>Validation path</th><th>If false, what changes</th></tr>
        <tr><td>1</td><td>Legacy flag data can be mapped programmatically to a fixed reason-code taxonomy.</td><td>Assumption</td><td>Engineering discovery, Day 1</td><td>Pilot narrows to newer transactions only; timeline or scope revised at Gate 1.</td></tr>
        <tr><td>2</td><td>"Operations users" includes external fleet admins as view-only.</td><td>Assumption</td><td>Operations discovery, Day 2</td><td>Permission model simplifies to internal-only users.</td></tr>
        <tr><td>3</td><td>Pilot is scoped to a single partner.</td><td>Open decision</td><td>Sponsor confirmation, Day 1–2</td><td>Multi-partner-from-day-one roughly doubles validation scope.</td></tr>
        <tr><td>4</td><td>MyLorry issues fleet cards under its own e-money license or a partner bank's rails.</td><td>Open decision</td><td>Compliance discovery, Day 1</td><td>Determines which specific regulatory retention/audit rules bind this capability.</td></tr>
        <tr><td>5</td><td>Current case volume is low enough that bulk actions are not needed in the pilot.</td><td>Assumption</td><td>Operations discovery, Day 2</td><td>Bulk actions may need to move from Layer 5 (deferred) into MVP scope.</td></tr>
      </table>
    </div>

    <!-- Section 12 -->
    <div class="doc-section">
      <h3>12. Sources & References</h3>
      <p>• MyLorry Technology Solutions Sdn. Bhd. — corporate site, product benefits, and onboarding flow: <strong>mylorry.ai</strong> (accessed September 2026).<br>
      • MyLorry — About Us page: <strong>mylorry.ai/about-us</strong> (accessed September 2026).<br>
      • TUG Delivery Manager Assessment brief — MyLorry Operations Portal case (source document for this PRD).</p>
    </div>
  `;
}

/* Render Sections matching Farah's PRD Document Text Exactly */
function getExecBriefHtml() {
  return `
    <div class="ass-header">
      <h2>PRODUCT REQUIREMENTS DOCUMENT</h2>
      <p>MyLorry Operations Portal — Transaction Review & Exception Handling</p>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
        <strong>Prepared by:</strong> Farah | <strong>Prepared for:</strong> TUG — Delivery Manager & Product Owner Candidate Assessment | <strong>Date:</strong> September 2026
      </div>
    </div>

    <div class="callout callout-important">
      <strong>BOTTOM LINE:</strong> Fix the data before polishing the UI. Every stakeholder's request collapses to the same dependency: a trustworthy, normalized reason code.<br>
      <strong>Confidence:</strong> Medium-High — gated by Day 1 validation that legacy flag data can be mapped programmatically.
    </div>

    <div class="doc-section">
      <h3>1. Executive Summary</h3>
      <p><strong>Situation:</strong> MyLorry operates a fleet-card platform for logistics companies, competing on a stated promise of "Security and Fraud Protection" alongside expense tracking and fuel cost savings. The current operations portal supports login, balances, transaction history, and driver checklists — but has no structured capability for reviewing flagged or disputed fuel transactions.</p>
      <p><strong>Complication:</strong> The business has requested a pilot-ready Transaction Review & Exception Handling capability within six weeks, using a team of one frontend engineer, one backend engineer, shared QA, and a part-time designer. Five stakeholder groups — Operations, Finance, Compliance, Customer Success, and Engineering — have each stated a distinct need. Critically, Engineering has flagged that the underlying flag-reason data is inconsistent and notifications are not production-ready. This is not a UI gap; it is a data-trust gap that sits underneath every stakeholder's request.</p>
      <p><strong>Resolution:</strong> We recommend piloting a single-partner Transaction Review capability built on a normalized reason-code layer — fixing the data-trust problem before building the review workflow on top of it. This single move resolves all five stakeholders' stated needs simultaneously (see 360° Stakeholder View).</p>
      
      <table class="styled-table">
        <tr><th>Dimension</th><th>Summary</th></tr>
        <tr><td><strong>Problem</strong></td><td>No structured, auditable way to triage flagged fuel transactions; root blocker is inconsistent flag-reason data.</td></tr>
        <tr><td><strong>Target Users</strong></td><td>Operations reviewers (internal); fleet company admins as informed, non-editing participants (to confirm).</td></tr>
        <tr><td><strong>Outcome</strong></td><td>Every pilot case shows a trustworthy reason, an owner, an action, and an immutable audit trail.</td></tr>
        <tr><td><strong>Scope</strong></td><td>Single partner, one capability: review queue + normalized reasoning + audit log.</td></tr>
        <tr><td><strong>Key Trade-off</strong></td><td>Slower to demo in Week 1 (data work is invisible); faster and safer to trust from Week 3 onward.</td></tr>
        <tr><td><strong>Confidence</strong></td><td>Medium-High — gated by Day 1 validation that legacy flag data can be mapped programmatically.</td></tr>
      </table>
    </div>
  `;
}

function getStakeholderMatrixHtml() {
  return `
    <div style="margin-top:1rem; margin-bottom:1.5rem;">
      <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">📊 Stakeholder Map & Discovery Order (Influence vs. Interest Matrix)</h4>
      <p style="font-size:0.825rem; color:var(--text-secondary); margin-bottom:0.75rem;">Visualizing stakeholder influence vs. interest quadrants to sequence discovery interviews by downstream impact.</p>
      
      <div class="stakeholder-matrix-wrapper">
        <!-- Matrix 2x2 Canvas -->
        <div class="matrix-canvas-box">
          <div class="matrix-axis-label-y">HIGH INFLUENCE</div>
          <div class="matrix-axis-label-x-left">LOW INTEREST</div>
          <div class="matrix-axis-label-x-right">HIGH INTEREST</div>

          <div class="matrix-grid-4">
            <!-- Top-Left: High Influence, Low Interest -->
            <div class="matrix-quadrant-box top-left">
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:700; position:absolute; top:4px; left:6px;">High Inf / Low Int</span>
              <div class="stakeholder-dot-item">
                <span class="stakeholder-dot dot-compliance"></span>
                <span>Compliance (Day 1)</span>
              </div>
            </div>

            <!-- Top-Right: High Influence, High Interest -->
            <div class="matrix-quadrant-box top-right">
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:700; position:absolute; top:4px; right:6px;">High Inf / High Int</span>
              <div class="stakeholder-dot-item">
                <span class="stakeholder-dot dot-finance"></span>
                <span>Finance (Day 2)</span>
              </div>
            </div>

            <!-- Bottom-Left: Low Influence, Low Interest -->
            <div class="matrix-quadrant-box bottom-left">
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:700; position:absolute; bottom:4px; left:6px;">Low Inf / Low Int</span>
              <div class="stakeholder-dot-item">
                <span class="stakeholder-dot dot-engineering"></span>
                <span>Engineering (Day 1)</span>
              </div>
            </div>

            <!-- Bottom-Right: Low Influence, High Interest -->
            <div class="matrix-quadrant-box bottom-right">
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:700; position:absolute; bottom:4px; right:6px;">Low Inf / High Int</span>
              <div class="stakeholder-dot-item">
                <span class="stakeholder-dot dot-operations"></span>
                <span>Operations (Day 2)</span>
              </div>
              <div class="stakeholder-dot-item">
                <span class="stakeholder-dot dot-cs"></span>
                <span>Customer Success (Day 3)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Discovery Sequencing Logic Panel -->
        <div class="sequencing-logic-panel">
          <div class="sequencing-logic-title">Discovery sequencing logic</div>
          
          <div class="sequencing-step">
            <div class="sequencing-step-num">1</div>
            <div><strong>Engineering first</strong> — confirms flag-reason data quality; gates everything downstream.</div>
          </div>

          <div class="sequencing-step">
            <div class="sequencing-step-num">2</div>
            <div><strong>Compliance next</strong> — immutability & access rules are constraints, not trade-offs.</div>
          </div>

          <div class="sequencing-step">
            <div class="sequencing-step-num">3</div>
            <div><strong>Operations</strong> — real workflow shape, case volume, and manual triage process.</div>
          </div>

          <div class="sequencing-step">
            <div class="sequencing-step-num">4</div>
            <div><strong>Finance</strong> — reconciliation & export needs; informs but does not override MVP cut.</div>
          </div>

          <div class="sequencing-step">
            <div class="sequencing-step-num">5</div>
            <div><strong>Customer Success</strong> — usability check for external fleet company admins.</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getPartAHtml() {
  return `
    <div class="ass-header">
      <h2>2. Problem Statement, Users & Outcomes</h2>
      <p>PRD Sections 2, 3 & 4 — Discovery & 360° Stakeholder View</p>
    </div>

    <div class="doc-section">
      <h3>Problem Statement</h3>
      <p>Operations users cannot reliably triage flagged fuel transactions because flag reasons are inconsistent at the data layer, and no structured, auditable workflow exists to act on them. Disputes stay open longer than necessary, Compliance has no defensible audit trail, and Customer Success absorbs confusion from fleet administrators who cannot get a straight answer about a flagged charge.</p>
    </div>

    <div class="doc-section">
      <h3>Target Users & Jobs-to-be-Done</h3>
      <p><strong>Primary:</strong> MyLorry Operations reviewers, who triage and resolve flagged cases.<br>
      <strong>Secondary:</strong> Fleet company administrators, who may view case status but should not edit records.</p>
      <ul>
        <li>When a transaction is flagged, I need to understand why — in language I can trust — so I can decide what to do next.</li>
        <li>When I take an action, I need it recorded permanently and attributably, so the business is protected if anyone asks later.</li>
        <li>When Finance or a fleet admin asks about a case, I need a fast, confident answer — not a manual investigation.</li>
      </ul>
    </div>

    <div class="doc-section">
      <h3>Discovery Sequencing & 360° Stakeholder View</h3>
      
      ${getStakeholderMatrixHtml()}

      <table class="styled-table">
        <tr><th>Day</th><th>Stakeholder</th><th>Why First/Next</th></tr>
        <tr><td>Day 1</td><td><strong>Engineering</strong></td><td>Confirms whether flag-reason data can be programmatically normalized — gates the entire plan.</td></tr>
        <tr><td>Day 1</td><td><strong>Compliance</strong></td><td>Immutability, reason codes, and least-privilege access are constraints, not trade-offs to negotiate later.</td></tr>
        <tr><td>Day 2</td><td><strong>Operations</strong></td><td>Real workflow shape, case volume, and current manual process.</td></tr>
        <tr><td>Day 2</td><td><strong>Finance</strong></td><td>Reconciliation and export needs; informs but does not override the MVP cut.</td></tr>
        <tr><td>Day 3</td><td><strong>Customer Success</strong></td><td>Usability check — can a fleet admin understand this without training.</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>Clarification Question Log (Highest Value Open Questions)</h3>
      <table class="styled-table">
        <tr><th>Question</th><th>Why It Materially Changes The Plan</th><th>Owner</th></tr>
        <tr><td>Can historical flag reasons be mapped programmatically to a fixed taxonomy, or do some require manual judgment?</td><td>If manual judgment is required at scale, the 6-week pilot must narrow to newer transactions only — single largest risk.</td><td>Engineering Lead</td></tr>
        <tr><td>Is the pilot scoped to one partner, or must it demonstrate multi-partner behavior from day one?</td><td>Largest lever on scope; multi-partner from day one doubles validation work (config, permissions, data isolation).</td><td>Sponsor</td></tr>
        <tr><td>What is current monthly volume of flagged/disputed transactions?</td><td>Shapes SLA design, queue pagination, and whether fast triage needs bulk actions in pilot.</td><td>Operations Lead</td></tr>
        <tr><td>Who has authority to close or reopen a case — single approver, or maker-checker?</td><td>Determines permission model and audit design; maker-checker adds a second role and UI state.</td><td>Compliance</td></tr>
      </table>

      <div class="callout callout-tip">
        <strong>Already Resolved Facts (MyLorry Sdn. Bhd. Context):</strong><br>
        • MyLorry is a Malaysian entity (Sdn. Bhd.) — compliance framing references Malaysian payment-instrument norms.<br>
        • Onboarding via WhatsApp with manual company registration (Name, Address, SSM, vehicle count) — confirms a lean B2B customer base.<br>
        • Separate customer portal (admin.mylorry.ai) — confirms Operations users include external fleet admins as view-only.
      </div>
    </div>
  `;
}

function getCurrentVsFutureContrastHtml() {
  return `
    <div class="contrast-card-container">
      <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem; display:flex; align-items:center; gap:8px;">
        <span>🔄 Real Contrast Matrix: Current State (Now) vs. Future Journey by Layer</span>
      </h4>
      <p style="font-size:0.825rem; color:var(--text-secondary); margin-bottom:1rem;">Direct comparison illustrating how each layer transforms MyLorry's current operational pain into a pilot-ready, auditable capability.</p>

      <div style="overflow-x:auto;">
        <table class="contrast-table-styled">
          <thead>
            <tr>
              <th style="width:18%;">Layer & Dimension</th>
              <th style="width:38%;"><span class="contrast-badge-now">🔴 Current State (Happening Now)</span></th>
              <th style="width:44%;"><span class="contrast-badge-future">🟢 Future Journey (Target Solution & Vision)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Layer 1:<br>Data Foundation</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Data Trust & Reasons</span></td>
              <td class="now-col">
                <strong>Broken Data & Inconsistent Flags:</strong> Raw flag inputs vary by partner DB, unreadable legacy codes (e.g. <code>ERR_FLAG_99</code>), corrupted or missing parameters. Engineering flagged that data cannot be trusted.
              </td>
              <td class="future-col">
                <strong>Normalized Reason Microservice:</strong> Stateless service normalizes incoming flags at ingestion into 5 fixed taxonomy codes (<code>LOCATION_ANOMALY</code>, <code>DUPLICATE_CHARGE</code>, <code>AMOUNT_EXCEEDS_THRESHOLD</code>, <code>DRIVER_DISPUTE</code>, <code>UNKNOWN_LEGACY</code>) without rewriting historical DB.
              </td>
            </tr>

            <tr>
              <td><strong>Layer 2:<br>Core Review Workflow</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Triage & Operations</span></td>
              <td class="now-col">
                <strong>Ad-Hoc Manual Chaos:</strong> No central queue. Flagged cases found via emails, WhatsApp chats, or spreadsheets. No assigned owners. Disputes stay open for weeks (&gt;4 hours median response).
              </td>
              <td class="future-col">
                <strong>Centralized Queue & Action Drawer:</strong> Filterable case queue (status, partner, reason code), 1-click owner assignment, driver checklist cross-referencing, and mandatory reason code actions (<code>RC-101</code>–<code>RC-999</code>). <strong>Target SLA: &lt;30 mins triage</strong>.
              </td>
            </tr>

            <tr>
              <td><strong>Layer 3:<br>Audit & Compliance</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Audit Trail & Governance</span></td>
              <td class="now-col">
                <strong>Zero Audit Trail & Silent Edits:</strong> Records edited in place or cleared without trace. Compliance has zero defensible audit logs. Regulatory risk under Bank Negara Malaysia guidelines.
              </td>
              <td class="future-col">
                <strong>Immutable Append-Only Log & RBAC:</strong> Every status transition, note, and assignment appends a permanent record (<code>user_id</code>, <code>timestamp</code>, <code>reason_code</code>). Zero edit/delete permissions. Maker-Checker validation for &gt;€500 cases.
              </td>
            </tr>

            <tr>
              <td><strong>Layer 4:<br>Architecture Constraint</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Platform Scalability</span></td>
              <td class="now-col">
                <strong>Fragmented Codebase:</strong> Custom duplicate backend logic per partner fleet. Onboarding new logistics fleets requires months of custom engineering.
              </td>
              <td class="future-col">
                <strong>Shared Backend + Partner Frontend Config:</strong> Single shared backend microservice API; partner-configurable white-label frontend layer (branding, visible reason codes). Reduces partner onboarding to hours.
              </td>
            </tr>

            <tr>
              <td><strong>Layer 5:<br>Deferred Scope & Vision</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">Automation & AI Roadmap</span></td>
              <td class="now-col">
                <strong>Unaudited Workarounds & OCR Risks:</strong> Manual CSV workarounds, risky manual fraud clearing, re-introducing OCR errors via receipt photo matching without baseline data.
              </td>
              <td class="future-col">
                <strong>Phased Innovation Roadmap:</strong><br>
                • <em>Sprint 2:</em> Scoped CSV export for confirmed reasons (Part D trigger).<br>
                • <em>Sprint 3+:</em> AI-assisted triage (summarize case & suggest reason code; human reviewer owns final decision).<br>
                • <em>Post-Pilot:</em> Wallet tokenization & partner expansion.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function getPartBHtml() {
  return `
    <div class="ass-header">
      <h2>6. Solution Architecture & Scope Map</h2>
      <p>5-Layer Consolidated Solution Map & MoSCoW Prioritization</p>
    </div>

    <div class="doc-section">
      <h3>The Solutioning by Layer & Real Contrast Matrix</h3>
      
      ${getCurrentVsFutureContrastHtml()}

      <table class="styled-table">
        <tr><th>Layer</th><th>Description & Scope</th><th>Serves Stakeholders</th><th>Pilot Status</th></tr>
        <tr><td><strong>Layer 1: Data Foundation</strong></td><td>Reason-code normalization service. Maps legacy inputs into fixed taxonomy (<code>LOCATION_ANOMALY</code>, <code>DUPLICATE_CHARGE</code>, <code>AMOUNT_EXCEEDS_THRESHOLD</code>, <code>DRIVER_DISPUTE</code>, <code>UNKNOWN_LEGACY</code>). Runs at ingestion; reprocesses old records without rewriting them.</td><td>All 5 Stakeholders simultaneously</td><td>In Scope (Sprint 1)</td></tr>
        <tr><td><strong>Layer 2: Core Review Workflow</strong></td><td>Filterable case queue (status, partner, date, reason code), case detail view, note/assign owner, approve/reject action with mandatory reason code.</td><td>Operations & Finance</td><td>In Scope (Sprints 1–2)</td></tr>
        <tr><td><strong>Layer 3: Audit & Compliance</strong></td><td>Immutable audit log — every state change is an append, never an edit. Role-based permissions (maker-checker validation). Non-negotiable scope.</td><td>Compliance & Finance</td><td>In Scope (Sprint 2)</td></tr>
        <tr><td><strong>Layer 4: Architecture Constraint</strong></td><td>Shared backend service, partner-agnostic core logic; partner-configurable frontend layer only (branding, visible reason codes).</td><td>Engineering & Customer Success</td><td>Governs Sprints 1–3</td></tr>
        <tr><td><strong>Layer 5: Deferred Scope</strong></td><td>Explicitly deferred: CSV export (Part D trigger), Tokenized wallet payments, Receipt OCR auto-matching, AI auto-approval, AI-assisted triage, Cross-partner rollout.</td><td>MVP Trade-off Evidence</td><td>Deferred to Post-Pilot</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>Layer 5 — Deferred Ideas with Stated Reasons</h3>
      <table class="styled-table">
        <tr><th>Idea</th><th>Why It's Out of the 6-Week Pilot</th></tr>
        <tr><td><strong>CSV Export</strong></td><td>Finance's ask, but resolution rate matters more to pilot success than export; revisit if forced by Part D scenario.</td></tr>
        <tr><td><strong>Tokenized / Wallet Card Payments</strong></td><td>Infrastructure & partnership project (card network tokenization, Apple/Google Pay agreements, PCI scope) — months, not weeks.</td></tr>
        <tr><td><strong>Receipt Photo + Delivery-Plan Auto-Matching</strong></td><td>Depends on unconfirmed data source (route system); reintroduces OCR; auto-approval risks silently clearing fraud.</td></tr>
        <tr><td><strong>AI Auto-Approval</strong></td><td>Same trust problem as above — an unaudited automated approver contradicts Compliance core ask.</td></tr>
        <tr><td><strong>AI-Assisted Triage</strong></td><td>Genuinely useful, but needs Layer 1 clean data to be trustworthy. Sprint 3+ / post-pilot.</td></tr>
      </table>
    </div>
  `;
}

function getPartCHtml() {
  return `
    <div class="ass-header">
      <h2>7. Delivery Plan & Governance</h2>
      <p>PRD Section 7 — Sprint Goals, RAID Log & Operational Controls</p>
    </div>

    <div class="doc-section">
      <h3>Sprint Goals & Decision Gates</h3>
      <table class="styled-table">
        <tr><th>Sprint</th><th>Weeks</th><th>Sprint Goal</th><th>Decision Gate</th></tr>
        <tr><td>Sprint 1</td><td>1–2</td><td>Reason-code normalization live; walking-skeleton queue showing normalized reasons, read-only.</td><td><strong>Gate 1:</strong> Data quality confirmed usable programmatically — or scope narrows to newer transactions.</td></tr>
        <tr><td>Sprint 2</td><td>3–4</td><td>Note/assign, approve-reject with mandatory reason code, immutable audit log, permissions.</td><td><strong>Gate 2:</strong> Permissions and audit model signed off by Compliance.</td></tr>
        <tr><td>Sprint 3</td><td>5–6</td><td>UAT, hardening, single-partner pilot rollout, go/no-go.</td><td><strong>Gate 3:</strong> Final Go/No-Go sign-off for pilot release.</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>Initial RAID Log</h3>
      <table class="styled-table">
        <tr><th>Type</th><th>Item</th><th>Owner</th><th>Mitigation / Escalation</th></tr>
        <tr><td>Risk</td><td>Legacy flag data cannot be programmatically normalized.</td><td>Engineering Lead</td><td>Validate Day 1; if false, narrow pilot to newer transactions and escalate to sponsor.</td></tr>
        <tr><td>Risk</td><td>QA capacity is shared and may be pulled mid-sprint.</td><td>Delivery Manager</td><td>Protect QA time in sprint planning; escalate contention to sponsor before blocking sprint goal.</td></tr>
        <tr><td>Assumption</td><td>Operations users includes external fleet admins as view-only.</td><td>Operations Lead</td><td>Confirm Day 2; if false, simplify permission model.</td></tr>
        <tr><td>Dependency</td><td>Compliance sign-off on permission/audit model before Sprint 2.</td><td>Compliance</td><td>Schedule review at Sprint 2 midpoint.</td></tr>
        <tr><td>Issue</td><td>Notifications are not production-ready per Engineering.</td><td>Engineering Lead</td><td>Excluded from pilot scope; tracked for post-pilot.</td></tr>
      </table>
    </div>
  `;
}

function getPartDHtml() {
  return `
    <div class="ass-header">
      <h2>8. Change Scenario Response (Live, Part D)</h2>
      <p>PRD Section 8 — Sprint 2 Mid-Sprint Change Assessment & Option C</p>
    </div>

    <div class="callout callout-warning">
      <strong>SCENARIO TRIGGER:</strong> Finance requests CSV export prior to pilot launch. Engineering confirms historical flag reasons are inconsistent (some cases cannot show reliable explanation). QA capacity drops 50% for Sprint 2.
    </div>

    <div class="doc-section">
      <h3>Options Assessment & Recommendation</h3>
      <table class="styled-table">
        <tr><th>Option</th><th>Description</th><th>Trade-off & Assessment</th></tr>
        <tr><td>Option A</td><td>Ship CSV export as requested, defer data-quality fix.</td><td>Risk: Exports partial or misleading data for UNKNOWN_LEGACY cases.</td></tr>
        <tr><td>Option B</td><td>Hold export entirely until data quality is fixed.</td><td>Risk: Sponsor/Finance friction; looks unresponsive to business need.</td></tr>
        <tr><td><strong>Option C (Recommended)</strong></td><td>Ship export scoped to cases with confirmed reason code; flag UNKNOWN_LEGACY cases as "provisional — pending review" in export; re-sequence QA to protect core approve/reject and audit path with light smoke testing for CSV.</td><td><strong>Best Balance:</strong> Explicit and defensible with both Finance and Compliance while protecting release date.</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>Stakeholder Messaging</h3>
      <div class="callout callout-important">
        <strong>Message to Sponsor / Finance:</strong><br>
        "We can deliver export this sprint for cases with a confirmed reason — about 80% of volume based on current data. Cases still resolving a legacy reason will be clearly marked provisional rather than silently included as clean data. This protects the numbers you'll actually rely on."<br><br>
        <strong>Message to Delivery Team:</strong><br>
        "Export is scoped down, not added in full — we are not taking on unscoped work under reduced QA capacity. Core approve/reject and audit-log paths remain the protected path through full testing; export gets a lighter smoke test this sprint."
      </div>
    </div>
  `;
}

function getPartEHtml() {
  return `
    <div class="ass-header">
      <h2>9. Release Readiness & Success Measures</h2>
      <p>PRD Section 9 — UAT, Go/No-Go Criteria & Post-Release Review</p>
    </div>

    <div class="doc-section">
      <h3>Go/No-Go Criteria Table</h3>
      <table class="styled-table">
        <tr><th>Area</th><th>Criteria</th><th>Status</th></tr>
        <tr><td>Product</td><td>MVP stories from Section 6 accepted; UNKNOWN_LEGACY handling verified in UAT.</td><td><span class="badge badge-resolved">PASSED</span></td></tr>
        <tr><td>Technical</td><td>API contracts stable; no open P1 defects.</td><td><span class="badge badge-resolved">PASSED</span></td></tr>
        <tr><td>Security / Compliance</td><td>Least-privilege verified; audit log confirmed immutable under test.</td><td><span class="badge badge-resolved">PASSED</span></td></tr>
        <tr><td>Support / Training</td><td>Customer Success briefed; 1-page fleet-admin guide ready.</td><td><span class="badge badge-resolved">PASSED</span></td></tr>
        <tr><td>Operational Ownership</td><td>Named owner assigned for post-pilot monitoring and case volume review.</td><td><span class="badge badge-resolved">PASSED</span></td></tr>
      </table>
    </div>
  `;
}

function getPartFHtml() {
  return `
    <div class="ass-header">
      <h2>10. AI Usage & Verification Log</h2>
      <p>PRD Section 10 — Transparent Prompting, Inputs, Verification & Human Changes</p>
    </div>

    <div class="doc-section">
      <table class="styled-table">
        <tr><th>Task & Tool</th><th>Intent / Inputs</th><th>Verification Method</th><th>Human Change & Rationale</th></tr>
        <tr>
          <td><strong>Explored real-world fleet-card fraud patterns</strong><br>(LLM synthesis)</td>
          <td>Ground reason-code taxonomy in real industry practice rather than invented categories.</td>
          <td>Cross-checked against MyLorry public product claims (mylorry.ai) and brief stakeholder signals.</td>
          <td><strong>REJECTED</strong> suggested real-time ML fraud-scoring engine as out of scope for a 6-week pilot with 2.5 engineers and no clean training data.</td>
        </tr>
        <tr>
          <td><strong>Evaluated receipt photo + delivery-plan auto-matching</strong><br>(LLM synthesis)</td>
          <td>Assess whether automated reconciliation could replace manual review.</td>
          <td>Checked idea against Compliance "no silent record changes" requirement and confirmed data sources.</td>
          <td><strong>REJECTED</strong> auto-approval outright; identified receipt photo step reintroduces OCR. Redirected to smaller evidence-only version (attach receipt, no auto-matching).</td>
        </tr>
        <tr>
          <td><strong>Considered full AI auto-approval engine</strong><br>(LLM synthesis)</td>
          <td>Test whether AI could accelerate case resolution beyond assistive suggestions.</td>
          <td>Weighed against assessment brief Responsible AI standard and Compliance audit requirement.</td>
          <td><strong>SCOPED DOWN</strong> to AI-assisted triage only (summarize & suggest, human decides). Positioned for Sprint 3+/post-pilot.</td>
        </tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>11. Assumptions & Open Decisions Register</h3>
      <table class="styled-table">
        <tr><th>#</th><th>Statement</th><th>Type</th><th>Validation Path</th><th>If False, What Changes</th></tr>
        <tr><td>1</td><td>Legacy flag data can be mapped programmatically to fixed taxonomy.</td><td>Assumption</td><td>Engineering discovery, Day 1</td><td>Pilot narrows to newer transactions only; timeline revised at Gate 1.</td></tr>
        <tr><td>2</td><td>Operations users includes external fleet admins as view-only.</td><td>Assumption</td><td>Operations discovery, Day 2</td><td>Permission model simplifies to internal-only users.</td></tr>
        <tr><td>3</td><td>Pilot is scoped to a single partner.</td><td>Open decision</td><td>Sponsor confirmation, Day 1–2</td><td>Multi-partner from day one doubles validation scope.</td></tr>
        <tr><td>4</td><td>MyLorry issues cards under own license or partner bank's rails.</td><td>Open decision</td><td>Compliance discovery, Day 1</td><td>Determines specific regulatory retention/audit rules.</td></tr>
        <tr><td>5</td><td>Current case volume is low enough that bulk actions aren't needed in pilot.</td><td>Assumption</td><td>Operations discovery, Day 2</td><td>Bulk actions move from Layer 5 into MVP scope.</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h3>12. Sources & References</h3>
      <p>• MyLorry Technology Solutions Sdn. Bhd. — corporate site, product benefits, and onboarding flow: mylorry.ai (accessed September 2026).<br>
      • MyLorry — About Us page: mylorry.ai/about-us (accessed September 2026).<br>
      • TUG Delivery Manager Assessment brief — MyLorry Operations Portal case (source document for this PRD).</p>
    </div>
  `;
}
