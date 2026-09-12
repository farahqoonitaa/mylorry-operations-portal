# Live Web Application Visual Walkthrough

Experience the **MyLorry Operations Portal** and **Candidate Assessment Presentation Deck** live on `http://localhost:8085`.

````carousel
![MyLorry Operations Mobile App - Phone UI Preview](/Users/admin/.gemini/antigravity/brain/b29784e9-09a2-4f9d-9558-8f30f2b9b981/mylorry_mobile_phone_ui_1789172591190.jpg)
<!-- slide -->
![MyLorry Operations Portal - Fuel Transaction Review & Exception Handling](/Users/admin/.gemini/antigravity/brain/b29784e9-09a2-4f9d-9558-8f30f2b9b981/mylorry_product_ui_1789122771753.jpg)
<!-- slide -->
![Candidate Assessment Presentation Deck & Strategy Hub](/Users/admin/.gemini/antigravity/brain/b29784e9-09a2-4f9d-9558-8f30f2b9b981/mylorry_deck_ui_1789122798953.jpg)
````

---

## 1. Mode 1: Fuel Transaction Review & Exception Handling Portal

When you switch to **Product Prototype View**, you interact with the software feature built to solve the MyLorry business problem:

```
+-----------------------------------------------------------------------------------------------+
|  Active Flags: 14     |  Median Triage: 18.4m  |  Disputes: €4,250.00  |  Audit Log: 100%     |
+-----------------------------------------------------------------------------------------------+
|  [ Search Card/Driver/Tx... ]   [ Flag Reason Filter ▾ ]   [ Lifecycle Status Filter ▾ ]      |
+-----------------------------------------------------------------------------------------------+
|  TX ID      | Driver       | Vehicle Reg    | Volume  | Flag Reason       | Status          |
|  TX-892401  | Marcus Vance | Ford Transit   | 88.5 L  | OVER_CAPACITY     | ● NEW_FLAG      |
|  TX-892398  | Elena R.     | Volvo FH16     | 310.0 L | VELOCITY_SWIPE    | ⏳ UNDER_TRIAGE  |
|  TX-892375  | David Chen   | Merc Sprinter  | 72.0 L  | UNAUTH_GRADE      | ⚖️ DISPUTED     |
+-----------------------------------------------------------------------------------------------+
```

### Key Interactions to Test Live:
1. **Row Inspection:** Click any transaction row in the table to open the **Slide-Out Case Action Drawer**.
2. **Accountable Triage Action:** Select a new status (e.g. `DISPUTED`), assign a case owner, choose a mandatory reason code (`RC-101`), and type an accountable note. Click **Save Action** to append to the immutable timeline.
3. **Multi-Tenant White-Labeling:** Select `LogiTrans Group` in the top right header dropdown to instantly switch the UI theme from Dark Mode to Partner White-Label Light Theme.
4. **Live Scenario Simulation:** Click `Simulate Sprint 2 Change Scenario` to trigger the Finance CSV export button and legacy flag inconsistency warnings.

---

## 2. Mode 2: Candidate Assessment Presentation Deck

When you switch to **Candidate Assessment Deck**, you navigate through the interactive defense modules required for your presentation:

```
+--------------------------+--------------------------------------------------------------------+
| DECK MODULES             |  Part B — Product Ownership & Backlog Slicing                      |
| • 📋 Executive Brief     |                                                                    |
| • 🔍 Part A: Discovery   |  Sprint 1 (Weeks 1-2): Core Triage Slice                          |
| • 📦 Part B: Product     |  • US-01 [BE]: Ingestion API & Normalized Flag Schema              |
| • 🚀 Part C: Delivery    |  • US-02 [FE]: Triage Table & Risk Anomaly Badges                  |
| • ⚡ Part D: Scenario    |  • US-03 [FE/BE]: Case Action Drawer & Immutable Audit Log         |
| • 🛡️ Part E: Quality    |                                                                    |
| • 🤖 Part F: AI Log      |  Sprint 2 (Weeks 3-4): Resolution & CSV Export                     |
+--------------------------+--------------------------------------------------------------------+
```

### Key Modules to Review Live:
- **Part A Discovery:** Stakeholder map, 12 clarification questions with plan impact, and Figma UX/Architectural audit findings.
- **Part B Product:** User story map, 3-sprint backlog roadmap, vertical slices, and Given-When-Then acceptance criteria.
- **Part C Delivery:** 6-week release plan, team capacity matrix, RACI governance matrix, and RAID risk log.
- **Part D Live Scenario:** Re-planning matrix for Sprint 2 (Finance CSV + QA 50% capacity drop + legacy flag fallback), plus sponsor and team communication scripts.
- **Part F Responsible AI:** Transparent AI log detailing prompts, verification methods, and 2 explicit human corrections.

---

### Access Link
- **Local Application URL:** `http://localhost:8085`
- **Application Files:** [index.html](file:///Users/admin/.gemini/antigravity/scratch/mylorry-delivery-assessment/index.html) | [styles.css](file:///Users/admin/.gemini/antigravity/scratch/mylorry-delivery-assessment/styles.css) | [app.js](file:///Users/admin/.gemini/antigravity/scratch/mylorry-delivery-assessment/app.js)
