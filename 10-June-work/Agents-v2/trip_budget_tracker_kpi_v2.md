### STEP – MODULE CHANGE ANALYSIS

**Project Name:** Trip Budget Tracker
**Version:** 2.0
**Date:** 2026-06-13
**Author:** Senior Product Manager

---

**Module Change Classification (v1 → v2):**

| Module | Status | Change Summary |
| --- | --- | --- |
| Create Trip & Add Members | Modified | Add base currency selector — regression KPIs required |
| Add Expense | Modified | Add category, currency picker, FX conversion, receipt photo upload |
| Running Balance | Unchanged | Consumes FX-converted amounts — regression KPIs required |
| Settle-Up Summary | Modified | Add UPI and PayPal deep-link buttons per debt row |
| Currency Engine | New | Live FX fetch, base-currency conversion, cache layer |
| Receipt Attachment | New | Photo upload, format/size validation, secure storage |
| Analytics / Pie Chart | New | Category-based spend aggregation and chart rendering |
| PDF Export | New | Trip summary PDF generation and download |

---

## Module: Create Trip & Add Members

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-TRM-01 | Create Trip & Add Members | Trip Creation Success Rate | Measures the successful initialization of a new trip without system errors. | 100% success rate for valid trip creation attempts. |
| KPI-TRM-02 | Create Trip & Add Members | Member Validation Enforcement | Verifies that the system correctly processes valid member additions and rejects duplicates. | 0 defects in member addition functionality during QA testing. |
| KPI-SEC-01 | Create Trip & Add Members | Data Isolation | Ensures trip data and member lists are strictly isolated to authorized participants. | 100% of unauthorized data access attempts are blocked. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-TRM-03 | Create Trip & Add Members | Base Currency Selection Enforcement | Verifies that a valid ISO 4217 base currency is required and stored on trip creation. | 100% of trip creation attempts without a base currency are rejected with a validation error. |
| KPI-TRM-04 | Create Trip & Add Members | Base Currency Persistence | Confirms the selected base currency is correctly persisted and propagated to all subsequent expense and balance calculations. | 0 discrepancies between stored base currency and currency used in balance calculations across all test scenarios. |

---

## Module: Add Expense

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-EXP-01 | Add Expense | Expense Entry Completion | Tracks the successful recording of an expense containing payer, amount, and description. | 100% of valid expense entries are successfully stored in the database. |
| KPI-EXP-02 | Add Expense | Input Validation | Ensures negative amounts, zero amounts, or missing required fields are rejected. | 100% of invalid expense submissions trigger correct validation error messages. |
| KPI-OP-01 | Add Expense | Concurrent Write Handling | Measures the system's ability to maintain data consistency when multiple users add expenses simultaneously. | 0 instances of data loss or conflicts during concurrent expense additions. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-EXP-03 | Add Expense | Category Tag Enforcement | Verifies that a category is required for every expense and stored correctly. | 100% of expense submissions without a category are rejected; 100% of valid category values are stored accurately. |
| KPI-EXP-04 | Add Expense | Currency Picker Availability | Validates that the currency picker lists only supported ISO 4217 currencies sourced from the FX provider. | 100% of displayed currencies match the FX provider's supported currency list; 0 unsupported currencies selectable. |
| KPI-EXP-05 | Add Expense | Receipt Photo Upload — Format Validation | Ensures only JPEG, PNG, and HEIC files are accepted; all other formats are rejected. | 100% of invalid format uploads are blocked with an inline error; 100% of valid formats are accepted. |
| KPI-EXP-06 | Add Expense | Receipt Photo Upload — Size Validation | Ensures files exceeding 10MB are rejected with an inline error. | 100% of files > 10MB are blocked; 100% of files ≤ 10MB within valid format are accepted. |
| KPI-EXP-07 | Add Expense | Receipt Photo Secure Storage | Validates that uploaded receipt photos are stored in scoped/private storage with no publicly accessible direct URLs. | 0 receipt photos accessible via unauthenticated public URL during security audit. |
| KPI-EXP-08 | Add Expense | Receipt Thumbnail Display | Confirms that a thumbnail of the attached receipt is visible on the expense detail view after upload. | 100% of successfully uploaded receipts render a thumbnail on the expense detail view within 3 seconds. |

---

## Module: Currency Engine (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-FX-01 | Currency Engine | Live FX Rate Fetch Latency | Measures the time taken to retrieve a live FX rate from the external API. | FX rate fetched and available in < 2 seconds on a standard mobile connection. |
| KPI-FX-02 | Currency Engine | FX Conversion Accuracy | Validates that converted amounts match the fetched live mid-market rate within tolerance. | Converted amounts within ±0.01% of the live mid-market rate for all tested currency pairs. |
| KPI-FX-03 | Currency Engine | FX Cache Hit Rate | Measures the proportion of FX lookups served from cache to reduce API call volume. | ≥ 80% of FX lookups served from cache during normal usage within cache TTL window. |
| KPI-FX-04 | Currency Engine | FX API Unavailability Fallback | Verifies that the system degrades gracefully when the FX API is unreachable. | When FX API is unreachable: cached rate is used with a visible timestamp warning; expense save is blocked if cache age > 24 hours. |
| KPI-FX-05 | Currency Engine | Stale Rate Indicator Display | Confirms that expenses converted using a cached (not live) rate display a "Rate from [date]" indicator in the UI. | 100% of expenses using a cached FX rate display the rate date indicator on both the expense detail and balance screens. |
| KPI-FX-06 | Currency Engine | FX API Key Security | Ensures the FX provider API key is never exposed to the client-side application. | 0 instances of API key present in client-side source, network responses, or browser storage during security audit. |

---

## Module: Running Balance

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-BAL-01 | Running Balance | Balance Calculation Accuracy | Validates that running balances mathematically match the sum of all submitted expenses for each member. | 100% calculation accuracy in a 3-person trip scenario with multiple expenses. |
| KPI-BAL-02 | Running Balance | Calculation Latency | Measures the time taken to update all member balances after an expense is added. | Balances update and reflect in the system within < 500ms of an expense entry. |
| KPI-AUD-01 | Running Balance | Rounding Consistency | Ensures proper handling of indivisible amounts (e.g., $10 split 3 ways) to prevent fractional cent loss. | 0 discrepancies found in rounding logic over comprehensive automated testing. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-BAL-03 | Running Balance | Multi-Currency Balance Accuracy | Validates that balances correctly aggregate amounts from multiple currencies after FX conversion to base currency. | 100% calculation accuracy in a mixed-currency trip scenario (≥ 3 currencies, ≥ 5 expenses) verified against manually computed expected values. |
| KPI-BAL-04 | Running Balance | Base Currency Display Consistency | Confirms all balance values on the balance screen are displayed in the trip's base currency regardless of the original expense currency. | 0 instances of non-base-currency amounts displayed on the Running Balance screen across all tested scenarios. |

---

## Module: Settle-Up Summary

#### Existing KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-SET-01 | Settle-Up Summary | Settlement Algorithm Accuracy | Verifies the generated settle-up summary provides the most efficient debt resolution paths (who owes whom). | 100% accurate debt resolution summaries generated based on running balances. |
| KPI-SET-02 | Settle-Up Summary | UI Rendering and Visibility | Measures the correct and consistent display of the settle-up summary to all trip members. | Settle-up summary correctly rendered on all supported views without data truncation. |

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-SET-03 | Settle-Up Summary | UPI Deep-Link Generation Accuracy | Validates that the UPI deep-link is correctly constructed with the payee VPA and debt amount for each debt row. | 100% of generated UPI deep-links contain the correct payee and amount; 0 mismatches across all test debt scenarios. |
| KPI-SET-04 | Settle-Up Summary | UPI App Launch Success | Measures successful launch of the UPI payment app via deep-link on supported devices. | UPI app opens pre-filled within 3 seconds on ≥ 95% of tested supported devices; fallback browser URL activates when app is not installed. |
| KPI-SET-05 | Settle-Up Summary | PayPal Deep-Link Generation Accuracy | Validates that the PayPal deep-link is correctly constructed with the payee and debt amount for each debt row. | 100% of generated PayPal deep-links contain the correct payee and amount; 0 mismatches across all test debt scenarios. |
| KPI-SET-06 | Settle-Up Summary | PayPal App Launch Success | Measures successful launch of the PayPal app or browser fallback via deep-link on supported devices. | PayPal app or PayPal.me browser URL opens within 3 seconds on ≥ 95% of tested supported devices. |
| KPI-SET-07 | Settle-Up Summary | Deep-Link Parameter Isolation | Ensures deep-link parameters (amount, payee) are read-only and cannot be intercepted or modified within the app. | 0 instances of deep-link parameter tampering possible via app-layer interception during security audit. |

---

## Module: Analytics / Pie Chart (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-ANA-01 | Analytics / Pie Chart | Category Aggregation Accuracy | Validates that the total spend per category on the pie chart matches the sum of all base-currency expense amounts for that category. | 100% accuracy between pie chart segment values and manually computed category totals across all test scenarios. |
| KPI-ANA-02 | Analytics / Pie Chart | Pie Chart Render Completeness | Confirms all defined categories with at least one expense are represented as segments in the pie chart. | 0 missing segments for categories with ≥ 1 expense; 0 phantom segments for categories with 0 expenses. |
| KPI-ANA-03 | Analytics / Pie Chart | Single-Category Edge Case Rendering | Validates that a pie chart with a single category renders correctly as a full circle with label. | 100% correct rendering (full circle + category label + amount) when only 1 category has expenses. |
| KPI-ANA-04 | Analytics / Pie Chart | Chart Render Latency | Measures time to render the pie chart after the analytics screen is opened. | Pie chart visible and interactive within < 1.5 seconds for trips with up to 100 expenses. |

---

## Module: PDF Export (New)

#### Existing KPI

*No existing KPIs — new module.*

#### New KPI

| KPI Number | Module | KPI Name | Description | Criteria |
| --- | --- | --- | --- | --- |
| KPI-PDF-01 | PDF Export | Export Content Completeness | Validates that the generated PDF contains all required sections: trip name, dates, member list, all expenses (with category and base-currency amount), and final settle-up balances. | 100% of required content sections present in the generated PDF across all test scenarios. |
| KPI-PDF-02 | PDF Export | Export Generation Time | Measures the time from tapping "Export PDF" to the PDF being available for download. | PDF generated and available for download within < 5 seconds for trips with up to 100 expenses. |
| KPI-PDF-03 | PDF Export | Export Disabled State — Zero Expenses | Verifies that the Export PDF button is disabled and shows the correct tooltip when a trip has 0 expenses. | 100% of trips with 0 expenses render the Export PDF button in a disabled state with tooltip "Add at least one expense to export". |
| KPI-PDF-04 | PDF Export | Amount Accuracy in PDF | Validates that all expense amounts and balance figures in the PDF match the in-app displayed values in the base currency. | 0 discrepancies between PDF amounts and in-app amounts across all tested export scenarios. |

---

# Development Timeline

| Sprint | Focus Area | Deliverables |
| --- | --- | --- |
| Sprint 1 | Core Data Models & Trip Setup *(v1 — unchanged)* | Trip creation logic, member addition, basic data isolation rules. |
| Sprint 2 | Expense Recording & Validation *(v1 — unchanged)* | Add expense module, input validation, concurrent write handling. |
| Sprint 3 | Balances & Settlement Logic *(v1 — unchanged)* | Running balance engine, rounding consistency, settle-up algorithm, UAT sign-off. |
| Sprint 4 | Currency Engine & Modified Expense Entry | Base currency field on trip, currency picker on expense, live FX fetch, cache layer, stale-rate indicator, FX security controls. |
| Sprint 5 | Receipt Attachment & Storage | Photo upload (format + size validation), secure storage, thumbnail display. |
| Sprint 6 | Settlement Deep-Links | UPI and PayPal deep-link generation, app-launch validation, browser fallback, parameter security audit. |
| Sprint 7 | Analytics & PDF Export | Category pie chart, category aggregation, PDF generation, export content validation, disabled-state handling. |
| Sprint 8 | Regression, Integration & UAT | Full regression across v1 modules, end-to-end multi-currency trip scenario, UAT sign-off. |

---

# Success Criteria

| Category | Success Metric | Target |
| --- | --- | --- |
| Accuracy (v1) | Calculation Errors | 0 calculation errors reported during QA and UAT phases. |
| Reliability (v1) | Concurrent Processing | 100% data consistency maintained during simultaneous expense entry testing. |
| Usability (v1) | Scenario Completion | System successfully handles the baseline 3-person, 3-expense test scenario with accurate output. |
| Accuracy (v2) | Multi-Currency Balance | 100% balance accuracy in mixed-currency (≥ 3 currencies) trip scenario. |
| Accuracy (v2) | FX Conversion Precision | Converted amounts within ±0.01% of live mid-market rate for all tested currency pairs. |
| Performance (v2) | FX Rate Fetch | Live FX rate fetched within < 2 seconds on standard mobile connection. |
| Performance (v2) | PDF Export | Trip summary PDF generated within < 5 seconds for trips with up to 100 expenses. |
| Reliability (v2) | FX Offline Degradation | System blocks expense save and displays cached rate warning when FX API is unreachable and cache > 24 hours old. |
| Security (v2) | Receipt Storage | 0 receipt photos accessible via unauthenticated public URL. |
| Security (v2) | FX API Key | 0 instances of API key exposed in client-side code, network responses, or browser storage. |
| Security (v2) | Deep-Link Integrity | 0 instances of deep-link parameter tampering possible at the app layer. |
| Usability (v2) | Settlement Deep-Link Launch | UPI/PayPal app opens within 3 seconds on ≥ 95% of supported test devices. |
| Usability (v2) | Analytics Render | Pie chart visible and interactive within < 1.5 seconds for trips with up to 100 expenses. |

---
