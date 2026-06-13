# Trip Budget Tracker - Test Cases v2

This document outlines the version 2 test cases for the Trip Budget Tracker application, derived from the upgraded Product Requirements Document (PRD v2) and KPI v2 metrics. It covers the new multi-currency, receipt upload, deep-link settlement, category analytics, and PDF export functionalities.

---

## 1. Trip Creation & Member Management (Modified)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-TRM-01 | Create a new trip with base currency | Application is loaded | 1. Enter a valid trip name.<br>2. Select a base currency (e.g., USD).<br>3. Click 'Start Trip'. | A new trip is successfully initialized with the selected base currency. | KPI-TRM-01, KPI-TRM-03 |
| TC-TRM-02 | Add members with UPI and PayPal handles | A trip is created | 1. Enter a valid member name.<br>2. Enter an optional UPI ID (e.g. alice@upi).<br>3. Enter an optional PayPal Username.<br>4. Click 'Add Member'. | The member is added successfully to the trip with payment handles persisted. | KPI-TRM-02 |
| TC-TRM-03 | Reject trip creation without base currency | Application is loaded | 1. Enter a valid trip name.<br>2. Clear or leave base currency unselected (if validation allows).<br>3. Attempt to submit. | The system rejects the initialization with a validation error. | KPI-TRM-03 |

---

## 2. Expense Management with Currency & Category (Modified)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXP-01 | Add a valid foreign-currency expense | A trip exists with base currency INR | 1. Select Payer.<br>2. Select category (e.g. Food).<br>3. Select currency USD.<br>4. Enter amount 100.<br>5. Enter description.<br>6. Submit. | The expense is stored, converted to INR base using the live FX rate, and displayed. | KPI-EXP-01, KPI-FX-02 |
| TC-EXP-02 | Enforce Category Tag | A trip exists | 1. Complete expense form but leave category empty.<br>2. Submit. | The system rejects the submission with a category validation error. | KPI-EXP-03 |
| TC-EXP-03 | Verify currency picker limits | A trip exists | 1. Open the currency selector dropdown. | Only supported currencies (USD, EUR, GBP, INR, JPY, AUD, CAD, SGD, CHF, CNY) are shown. | KPI-EXP-04 |

---

## 3. Receipt Photo Attachment (New Feature)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-REC-01 | Upload valid receipt attachment | Add Expense form open | 1. Choose a JPEG or PNG file ≤ 10MB.<br>2. Submit the expense. | The file is successfully processed as Base64 and saved; thumbnail is visible. | KPI-EXP-05, KPI-EXP-06, KPI-EXP-08 |
| TC-REC-02 | Prevent invalid format upload | Add Expense form open | 1. Choose a PDF or TXT file.<br>2. Attempt to save. | The system blocks upload and displays an inline format validation error. | KPI-EXP-05 |
| TC-REC-03 | Prevent large files exceeding 10MB | Add Expense form open | 1. Choose a JPEG file of size 12MB.<br>2. Attempt to save. | The system blocks upload and displays an inline size validation error. | KPI-EXP-06 |

---

## 4. Currency Engine & Caching (New Feature)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FX-01 | Fetch live FX rates on load | Base currency selected | 1. Mount Add Expense form.<br>2. Measure rate fetch API latency. | Live FX rates are fetched relative to base currency in < 2 seconds. | KPI-FX-01 |
| TC-FX-02 | Offline fallback warning indicator | Network connection disabled | 1. Open the trip app.<br>2. Add an expense in USD (base INR). | Rate is retrieved from cache, warning badge "Rates offline (Cached: date)" is visible. | KPI-FX-04, KPI-FX-05 |
| TC-FX-03 | Block save on stale rates (>24h) | Cache age is 30 hours, network offline | 1. Select a member.<br>2. Try adding USD expense.<br>3. Click save. | App blocks save and displays "FX Rates are older than 24 hours" error dialog. | KPI-FX-04 |

---

## 5. Running Balances & Calculations (Modified)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-BAL-01 | Multi-currency balance aggregation | Trip with base currency EUR exists | 1. Add USD 100 paid by Alice.<br>2. Add GBP 50 paid by Bob.<br>3. View Running Balances. | Both amounts are converted to EUR, aggregated, and displayed correctly. | KPI-BAL-03 |
| TC-BAL-02 | Base currency display consistency | Trip with base currency INR exists | 1. Log USD and EUR expenses.<br>2. View Running Balances list. | All member balances are exclusively prefixed and formatted in INR (no original currency). | KPI-BAL-04 |

---

## 6. Settle Up Deep-Link Settlement (Modified)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SET-01 | UPI deep-link generation | Settlement row has payee with UPI VPA | 1. View Settle Up Summary.<br>2. Inspect UPI anchor link details. | Link href matches `upi://pay?pa=VPA&pn=Name&am=Amount&cu=BaseCurrency`. | KPI-SET-03 |
| TC-SET-02 | PayPal deep-link generation | Settlement row has payee with PayPal handle | 1. View Settle Up Summary.<br>2. Inspect PayPal anchor link details. | Link href matches `https://www.paypal.me/Username/Amount`. | KPI-SET-05 |

---

## 7. Analytics Pie Chart (New Feature)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-ANA-01 | Category spend aggregation accuracy | Multiple expenses logged in different categories | 1. Add USD 50 (Food), USD 30 (Transport).<br>2. View Category Breakdown. | Pie chart shows segments with percentages matching 62.5% Food, 37.5% Transport. | KPI-ANA-01, KPI-ANA-02 |
| TC-ANA-02 | Single category fallback render | Only one category has expenses logged | 1. Add USD 50 (Food).<br>2. View Category Breakdown. | Donut chart renders as a solid single-segment circle representing 100% Food. | KPI-ANA-03 |

---

## 8. PDF Summary Export (New Feature)

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-PDF-01 | Export button state with zero expenses | Active trip with 0 expenses | 1. View dashboard header. | "Export Summary" button is disabled; hovering shows tooltip validation error. | KPI-PDF-03 |
| TC-PDF-02 | Complete printable report layout | Trip has multiple expenses and debts | 1. Click "Export Summary" button. | Browser print page is triggered, isolating a detailed clean invoice summary. | KPI-PDF-01 |
