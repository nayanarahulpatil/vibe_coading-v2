# Test Execution Report

| Test ID | Test Name | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-TRM-01 | Create a new trip with base currency | Trip is created successfully with base currency persisted in slice. | Trip is created with base currency successfully. | PASS |
| TC-TRM-02 | Add members with UPI and PayPal handles | Member is saved with name, upiId, and paypalUsername. | Member added with payment handles visible in dashboard. | PASS |
| TC-TRM-03 | Reject trip creation without base currency | Form fails submission and shows validation error. | Form blocks submit; displays required error message. | PASS |
| TC-EXP-01 | Add a valid foreign-currency expense | Expense is converted to base currency and saved to state. | Expense is converted via rate and displayed in base currency. | PASS |
| TC-EXP-02 | Enforce Category Tag | Empty category blocks form submit. | Category dropdown enforces selection. | PASS |
| TC-EXP-03 | Verify currency picker limits | Renders only standard supported currencies. | Selector filters down to exactly 10 supported currencies. | PASS |
| TC-REC-01 | Upload valid receipt attachment | PNG/JPEG is converted to base64 and renders thumbnail. | Image upload is accepted and thumbnail renders in form. | PASS |
| TC-REC-02 | Prevent invalid format upload | File input rejects PDF/TXT with inline error message. | Input block is flagged with format warning error. | PASS |
| TC-REC-03 | Prevent large files exceeding 10MB | File input blocks >10MB upload and displays error. | Upload blocks with size validation error message. | PASS |
| TC-FX-01 | Fetch live FX rates on load | Live FX rates fetch completes under 2 seconds. | FX rates fetched successfully from public API. | PASS |
| TC-FX-02 | Offline fallback warning indicator | Uses cache rate when offline, displaying cached warning tag. | App renders cached alert tag next to the form. | PASS |
| TC-FX-03 | Block save on stale rates (>24h) | Save blocks if cached rate age is > 24 hours. | Form displays error and blocks saving. | PASS |
| TC-BAL-01 | Multi-currency balance aggregation | running balance aggregates base-currency converted totals. | Balances adjust accurately based on USD and GBP inputs. | PASS |
| TC-BAL-02 | Base currency display consistency | Balances screen displays only values with base currency code. | Screen displays values using active base currency code prefix. | PASS |
| TC-SET-01 | UPI deep-link generation | Settle row generates correct upi:// intent link. | Intent matches scheme format pre-filled with amount. | PASS |
| TC-SET-02 | PayPal deep-link generation | Settle row generates correct paypal.me URL. | URL correctly structures username and amount parameters. | PASS |
| TC-ANA-01 | Category spend aggregation accuracy | Pie chart aggregates Food, Transport, Accommodation. | Chart percentages divide categories accurately. | PASS |
| TC-ANA-02 | Single category fallback render | Pie chart renders as solid circle when 1 category exists. | Chart renders single Food segment at 100%. | PASS |
| TC-PDF-01 | Export button state with zero expenses | Export button is disabled with tooltip warning. | Export button renders grayed-out with hover message. | PASS |
| TC-PDF-02 | Complete printable report layout | Native print window triggers print-friendly invoice. | Browser print view displays clean report layout only. | PASS |

## Summary

| Metric | Value |
| :--- | :--- |
| Total Test Cases | 20 |
| Passed | 20 |
| Failed | 0 |
| Pass Percentage | 100% |

## Failed Test Details

No failed test cases observed during execution.
