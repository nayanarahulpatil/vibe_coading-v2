# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Trip Budget Tracker
**Version:** 2.0
**Date:** 2026-06-13
**Author:** Senior Product Manager

## 0. Change Summary

### Request Type

* Enhancement
* Phase Upgrade

### Summary

Gap analysis identified 5 missing capabilities versus v1: multi-currency support with live FX rates, receipt photo attachment per expense, settlement via UPI/PayPal deep-link, expense categories with pie chart breakdown, and trip summary PDF export. PRD v2 documents only these net-new and modified requirements on top of the existing v1 baseline.

---

## 1. Existing Modules / Features

| Module | Feature | Current Behavior |
| --- | --- | --- |
| Trip Management | Create Trip + Add Members | User creates a trip and adds participant names |
| Expense Entry | Add Expense | Records who paid, amount (single currency), and description |
| Balance Tracking | Running Balance per Person | Calculates and displays per-person balance in real time |
| Settlement | Settle-Up Summary | Shows a text list of who owes whom and how much |

---

## 2. New / Modified Modules & Features

| Module | Type | Description |
| --- | --- | --- |
| Expense Entry | Modified | Add category tag, receipt photo attachment, and currency selector per expense |
| Currency Engine | New | Multi-currency input with live FX rate conversion to a base trip currency |
| Settlement | Modified | Augment settle-up summary with UPI/PayPal deep-link per payable debt |
| Analytics | New | Expense category breakdown displayed as an interactive pie chart |
| Export | New | Generate and download a trip summary PDF containing all balances and expenses |

---

## 3. Problem Statement

* **The Issue:** v1 only supports single-currency trips with no receipt proof, no payment shortcuts, no visual spend breakdown, and no exportable record — limiting usability for international trips and post-trip reconciliation.
* **Target User:** Friend groups on domestic or international trips needing transparent, provable, and actionable expense tracking.
* **Impact:** Users abandon the tool for spreadsheets when trips cross currencies; disputes arise without receipt evidence; settlement friction remains high without direct payment links; no shareable trip record exists for auditing.

---

## 4. Solution Overview

### Existing Functionality Impact

* **Unchanged:** Trip creation, member management, per-person balance calculation logic, settle-up debt minimisation algorithm.
* **Modified:** Expense entry form — add currency picker, category selector, and photo upload field. Settle-up summary — append deep-link payment buttons per debt row.
* **Deprecated:** None.

### New Functionality

* **Multi-Currency + Live FX:** Each expense records an original currency and amount. A currency engine fetches live FX rates and converts all amounts to the trip's base currency for balance calculation.
* **Receipt Photo Attachment:** Each expense supports one photo attachment (upload or camera capture). Stored and linked to the expense record.
* **UPI/PayPal Deep-Link Settlement:** Each debt in the settle-up summary renders a "Pay via UPI" and/or "Pay via PayPal" button that opens the respective payment app pre-filled with the payee and amount.
* **Expense Categories + Pie Chart:** Each expense is tagged with a category (Food, Transport, Accommodation, Entertainment, Other). A pie chart screen visualises total spend per category.
* **Trip Summary PDF Export:** A downloadable PDF containing: trip name, dates, member list, all expenses (with categories and amounts in base currency), and the final settle-up balances.

### Out of Scope

* In-app payment processing or escrow (deep-links only; no transaction handling within the app).
* Multi-photo attachments per expense.
* FX rate history or locked rates.
* Push notifications for settlement reminders.
* User authentication / accounts (remains session/link-based as in v1).

---

## 5. User Flow

### Existing Flow

1. Open app → Create trip → Add members.
2. Any member adds expense (who paid, amount, description).
3. View running balance per person.
4. View settle-up summary (text).

### Updated Flow

1. Open app → Create trip → Set **base currency** → Add members. *(modified)*
2. Any member adds expense:
   - Select **category** → Enter amount → Select **expense currency** (auto-converts to base) → Add description → Optionally **attach receipt photo**. *(modified)*
3. View running balance per person (all values in base currency). *(unchanged)*
4. View **pie chart** of spend by category. *(new)*
5. View settle-up summary → Tap **"Pay via UPI"** or **"Pay via PayPal"** per debt row. *(modified)*
6. Tap **"Export PDF"** → Download trip summary PDF. *(new)*

---

## 6. Impact Analysis

### UI Impact

| Screen | Change Type | Description |
| --- | --- | --- |
| Add Expense Form | Modified | Add currency picker dropdown, category selector, receipt photo upload field |
| Settle-Up Summary | Modified | Add UPI deep-link button and PayPal deep-link button per debt row |
| Analytics / Charts | New | Pie chart screen showing spend breakdown by category |
| PDF Export | New | Export button on trip summary screen; triggers PDF generation and download |
| Trip Creation Form | Modified | Add base currency selector field |

### Database Impact

| Entity | Change Type | Description |
| --- | --- | --- |
| Expense | Modified | Add fields: `currency` (string), `amount_original` (decimal), `amount_base` (decimal), `fx_rate` (decimal), `category` (enum), `receipt_photo_url` (string nullable) |
| Trip | Modified | Add field: `base_currency` (string, ISO 4217) |
| FX Rate Cache | New | Store: `from_currency`, `to_currency`, `rate`, `fetched_at` (TTL-based cache to reduce API calls) |

### Security Impact

| Area | Impact |
| --- | --- |
| Receipt Photo Storage | Photos must be stored in a private/scoped storage bucket; no public URLs without signed access |
| Deep-Link Parameters | Amount and payee values passed via deep-link must be read-only and not processable within the app |
| FX API Key | API key for live FX service must be stored server-side; never exposed to client |

---

## 7. Edge Cases & Error Handling

| Scenario | Expected Behavior |
| --- | --- |
| FX API unavailable | Show last cached rate with timestamp warning; block expense save if cache > 24 hours old |
| Unsupported currency selected | Restrict currency picker to supported ISO 4217 currencies from FX provider list |
| Receipt photo > size limit (e.g. 10MB) | Display inline error; block upload; prompt user to compress or retake |
| Invalid photo format | Accept JPEG/PNG/HEIC only; reject other formats with inline error |
| UPI deep-link — app not installed | Fallback to UPI payment page URL in browser |
| PayPal deep-link — app not installed | Fallback to PayPal.me URL in browser |
| PDF export with 0 expenses | Disable export button; show tooltip "Add at least one expense to export" |
| Expense in non-base currency with stale FX | Flag converted amount in UI with "Rate from [date]" indicator |
| Pie chart with single category | Render full circle with single segment and category label |
| Concurrent expense additions (existing risk) | Unchanged — handled by v1 data consistency mechanism |

---

## 8. KPIs & Acceptance Criteria

### KPIs

| KPI | Target |
| --- | --- |
| FX conversion accuracy | Converted amounts within ±0.01% of live mid-market rate |
| FX rate fetch latency | < 2 seconds on standard mobile connection |
| Receipt upload success rate | ≥ 98% for files within size/format limits |
| PDF export generation time | < 5 seconds for trips with up to 100 expenses |
| Deep-link resolution rate | UPI/PayPal app opens within 3 seconds on supported devices |

### Acceptance Criteria

| Feature | Acceptance Criteria |
| --- | --- |
| Multi-Currency | GIVEN a trip with base currency INR, WHEN a member adds an expense in USD, THEN the amount is auto-converted using live FX rate and displayed in INR on the balance screen |
| FX Offline Fallback | GIVEN the FX API is unreachable, WHEN a member attempts to add a foreign-currency expense, THEN the app displays a cached rate warning and prevents save if cache is stale (> 24h) |
| Receipt Attachment | GIVEN an expense form is open, WHEN a user uploads a JPEG receipt ≤ 10MB, THEN the photo is attached and a thumbnail is visible on the expense detail |
| Category Pie Chart | GIVEN at least one expense exists, WHEN the user views the Analytics screen, THEN a pie chart displays percentage and total per category in base currency |
| UPI Settlement | GIVEN a settle-up debt exists, WHEN the payer taps "Pay via UPI", THEN the UPI app opens pre-filled with the payee VPA and amount |
| PayPal Settlement | GIVEN a settle-up debt exists, WHEN the payer taps "Pay via PayPal", THEN the PayPal app or browser opens pre-filled with payee and amount |
| PDF Export | GIVEN a trip has ≥ 1 expense, WHEN the user taps "Export PDF", THEN a PDF downloads containing trip name, all expenses with categories, and final balances |
| PDF Export Disabled | GIVEN a trip has 0 expenses, WHEN the user views the trip summary, THEN the Export PDF button is disabled with a tooltip |

---

## 9. Limitations & Risks

### Technical Risks

* Live FX API dependency introduces latency and potential downtime; requires robust caching and graceful degradation.
* PDF generation on the client side may be slow for large trips; consider server-side generation for trips > 50 expenses.
* Receipt photo storage costs scale with usage; requires storage quota policy.
* Deep-link behaviour varies by OS version and installed app version — thorough device matrix testing required.

### Business Risks

* FX rates displayed are indicative only; disclaimer required to avoid liability for financial discrepancies.
* UPI/PayPal deep-links depend on third-party apps; broken links impact settlement UX but are outside product control.
* GDPR/data privacy compliance required for receipt photo storage (contains personal financial data).

### Dependencies

* **External:** Live FX rate API (e.g. Open Exchange Rates, ExchangeRate-API) — requires API key and SLA review.
* **External:** UPI intent scheme (`upi://pay`) — platform/OS support matrix to be validated.
* **External:** PayPal deep-link / PayPal.me URL scheme — requires PayPal developer account for production use.
* **External:** PDF generation library (e.g. jsPDF, pdfmake, or server-side Puppeteer).
* **Existing Modules:** v1 balance calculation engine — consumed unchanged; FX conversion must feed into the same pipeline.

---
