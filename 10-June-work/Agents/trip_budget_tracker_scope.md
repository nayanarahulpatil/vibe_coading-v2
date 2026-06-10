## 1. Goal & Problem Statement
* **The Problem:** Friends planning a group trip argue about splitting costs and need a simple way to track shared expenses.
* **The Solution:** A simple shared trip budget tracker where anyone can add an expense and clearly see who owes whom.
 
## 2. Tech Stack
* **Frontend:** React, JavaScript, Vanilla CSS
 
## 3. Core Features & Acceptance Criteria
| Feature number | Feature name | Description | Acceptance Criteria |
| --- | --- | --- | --- |
| 1 | Create trip + add members | Ability to initiate a trip and include participants. | GIVEN a 3-person trip is created, THEN the app correctly initializes the trip environment. |
| 2 | Add expense | Record an expense by detailing who paid, how much, and for what. | GIVEN a shared trip, WHEN users want to record costs, THEN multiple people can add expenses. |
| 3 | See running balance | Track individual balances continuously. | GIVEN expenses are entered, WHEN they are processed, THEN balances calculate correctly. |
| 4 | Settle up summary | Provide a straightforward summary of who owes whom. | GIVEN expenses exist, WHEN checking the status, THEN the settle-up summary is visible. |
 
## 4. UI/UX Standards
* **Theme & Style:** Modern, clean, vibrant colors with clear typography.
* **Layout:** Mobile-first, responsive layout to accommodate users adding expenses on the go.
 
## 5. Out of Scope
* Features beyond creating trips, adding members, adding expenses, running balances, and a settle-up summary.
* Payment gateway integrations.
* Multi-currency support.
