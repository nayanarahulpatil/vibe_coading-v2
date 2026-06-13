## 1. Goal & Problem Statement

* **The Problem:** v1 only supports single-currency trips with no receipt proof, no payment shortcuts, no visual spend breakdown, and no exportable record — limiting usability for international trips and post-trip reconciliation.
* **The Solution:** Extend the Trip Budget Tracker with multi-currency FX conversion, receipt photo attachment, UPI/PayPal deep-link settlement, category-based pie chart analytics, and a downloadable PDF trip summary.

---

## 2. Tech Stack

* **Frontend:** React, Tailwind, TypeScript
* **Database & Caching:** Firebase Firestore, Local Storage (cache)

---

## 3. Existing Features (Reference Only)

| Feature Number | Feature Name | Description |
| --- | --- | --- |
| EF-001 | Create Trip & Add Members | User creates a named trip and adds participant names; trip data is isolated to authorized participants. |
| EF-002 | Add Expense | Records who paid, the amount (single currency), and a description; validates required fields and rejects negative/zero amounts. |
| EF-003 | Running Balance per Person | Calculates and displays each member's real-time balance based on all submitted expenses; handles rounding on indivisible splits. |
| EF-004 | Settle-Up Summary | Generates a text list of the minimum debt-resolution transactions (who owes whom and how much) from the running balances. |

---

## 4. New / Modified Features & Acceptance Criteria

| Feature Number | Type | Feature Name | Description | Acceptance Criteria |
| --- | --- | --- | --- | --- |
| MF-001 | Modified | Base Currency on Trip Creation | Add a required ISO 4217 base currency selector to the trip creation form; all balances are calculated and displayed in this currency. | GIVEN a user creates a trip, WHEN no base currency is selected, THEN the form is rejected with a validation error; GIVEN a base currency is selected, THEN it is persisted and used in all balance calculations. |
| MF-002 | Modified | Expense Currency Picker | Add a currency selector to the Add Expense form; the selected currency is converted to the trip's base currency using the live FX rate at the time of entry. | GIVEN a trip with base currency INR, WHEN a member adds an expense in USD, THEN the amount is auto-converted using the live FX rate and displayed in INR on the balance screen. |
| MF-003 | Modified | Expense Category Tag | Add a required category field to the Add Expense form (Food, Transport, Accommodation, Entertainment, Other); category must be stored with every expense. | GIVEN an expense form is submitted without a category, THEN the submission is rejected with a validation error; GIVEN a valid category is selected, THEN it is stored accurately against the expense. |
| MF-004 | Modified | Receipt Photo Attachment | Add an optional receipt photo upload field (camera or file picker) to the Add Expense form; accepts JPEG, PNG, HEIC only; max 10MB; stored in private/scoped storage; thumbnail shown on expense detail. | GIVEN a user uploads a JPEG receipt ≤ 10MB, THEN the photo is attached and a thumbnail is visible on the expense detail within 3 seconds; GIVEN a file > 10MB or an unsupported format is selected, THEN an inline error is shown and the upload is blocked. |
| MF-005 | Modified | UPI Deep-Link Settlement | Augment each debt row in the Settle-Up Summary with a "Pay via UPI" button; constructs a `upi://pay` deep-link pre-filled with the payee VPA and debt amount; falls back to browser URL if the UPI app is not installed. | GIVEN a settle-up debt exists, WHEN the payer taps "Pay via UPI", THEN the UPI app opens pre-filled with the correct payee and amount within 3 seconds; GIVEN the UPI app is not installed, THEN a browser fallback URL activates. |
| MF-006 | Modified | PayPal Deep-Link Settlement | Augment each debt row in the Settle-Up Summary with a "Pay via PayPal" button; constructs a PayPal deep-link or PayPal.me URL pre-filled with payee and amount; falls back to browser if app not installed. | GIVEN a settle-up debt exists, WHEN the payer taps "Pay via PayPal", THEN the PayPal app or PayPal.me browser URL opens pre-filled with the correct payee and amount within 3 seconds. |
| NF-001 | New | Currency Engine — Live FX Fetch | A server-side currency conversion service that fetches live mid-market FX rates from the external provider, caches rates with a TTL, and exposes conversion to the expense entry flow. | GIVEN the FX API is available, WHEN a foreign-currency expense is entered, THEN the rate is fetched in < 2 seconds and the converted amount is within ±0.01% of the live mid-market rate. |
| NF-002 | New | FX Offline Fallback | When the FX API is unreachable, the system uses the last cached rate and displays a "Rate from [date]" warning; blocks expense save if the cache is older than 24 hours. | GIVEN the FX API is unreachable, WHEN a member attempts to add a foreign-currency expense, THEN the app displays a cached rate warning; GIVEN cache age > 24 hours, THEN the save is blocked. |
| NF-003 | New | Analytics — Category Pie Chart | A new Analytics screen displaying an interactive pie chart of total spend per category in the base currency; all categories with ≥ 1 expense are shown as segments. | GIVEN at least one expense exists, WHEN the user views the Analytics screen, THEN a pie chart displays the percentage and total per category in base currency within < 1.5 seconds; GIVEN only one category has expenses, THEN a full circle with label is rendered. |
| NF-004 | New | Trip Summary PDF Export | An "Export PDF" button on the trip summary screen that generates and downloads a PDF containing trip name, dates, member list, all expenses (with categories and base-currency amounts), and the final settle-up balances. | GIVEN a trip has ≥ 1 expense, WHEN the user taps "Export PDF", THEN a PDF downloads within < 5 seconds containing all required content; GIVEN a trip has 0 expenses, THEN the Export PDF button is disabled with tooltip "Add at least one expense to export". |

### Feature Types

* **New** → Completely new functionality
* **Modified** → Existing functionality being enhanced
* **Deprecated** → Functionality planned for removal
* **Removed** → Functionality removed from the system

---

## 5. UI/UX Standards

* **Theme & Style:** Mobile-first dark mode with curated HSL color palette; glassmorphism card surfaces for expense and balance panels; high-contrast typography for financial figures.
* **Layout:** Responsive single-column layout on mobile, two-column on tablet/desktop; micro-animations on expense entry, balance update, and pie chart segment render; inline error states on all form fields.

---

## 6. Out of Scope

* In-app payment processing or escrow — deep-links only; no transaction handling within the app.
* Multi-photo attachments per expense — one receipt photo per expense only.
* FX rate history, locked rates, or rate comparison views.
* Push notifications for settlement reminders.
* User authentication or persistent accounts — session/link-based access as in v1.
* PDF customisation (templates, branding) — standard fixed layout only.
* Automated settlement confirmation or payment status tracking after deep-link launch.
