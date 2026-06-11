# Trip Budget Tracker - Test Cases

This document outlines the test cases for the Trip Budget Tracker application, derived from the Product Requirements Document (PRD) and KPI metrics.

---

## 1. Trip Creation & Member Management

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-TRM-01 | Create a new trip | Application is loaded | 1. Enter a valid trip name.<br>2. Click 'Create Trip'. | A new trip is successfully initialized and the dashboard is displayed. | KPI-TRM-01 |
| TC-TRM-02 | Add valid members to a trip | A trip is created | 1. Enter a valid member name.<br>2. Click 'Add Member'. | The member is added successfully to the trip and appears in the member list. | KPI-TRM-02 |
| TC-TRM-03 | Prevent duplicate members | A trip has existing members | 1. Enter the name of a member already in the trip.<br>2. Click 'Add Member'. | The system rejects the addition and displays a duplicate member error. | KPI-TRM-02 |
| TC-TRM-04 | Data isolation | Two separate trips exist | 1. Create Trip A and add Members.<br>2. Create Trip B. | Trip B does not show members or expenses from Trip A. | KPI-SEC-01 |

---

## 2. Expense Management

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-EXP-01 | Add a valid expense | A trip exists with at least one member | 1. Select a payer.<br>2. Enter a positive amount.<br>3. Enter a description.<br>4. Submit the expense. | The expense is successfully recorded and added to the trip's expense history. | KPI-EXP-01 |
| TC-EXP-02 | Input validation - Zero or Negative Amount | A trip exists | 1. Select a payer.<br>2. Enter '0' or a negative number as the amount.<br>3. Submit the expense. | The system rejects the submission and displays a validation error. | KPI-EXP-02 |
| TC-EXP-03 | Input validation - Missing Fields | A trip exists | 1. Leave description or amount blank.<br>2. Submit the expense. | The system rejects the submission and displays a validation error. | KPI-EXP-02 |

---

## 3. Running Balances & Calculations

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-BAL-01 | Accurate balance calculation | A trip exists with members | 1. Add an expense of $90 paid by Member A.<br>2. View the Running Balances list. | Balances update correctly. (e.g. for 3 members: Member A is +$60, Members B & C are -$30). | KPI-BAL-01 |
| TC-BAL-02 | Rounding consistency | A trip exists with 3 members | 1. Add an expense of $10 paid by Member A.<br>2. View the Running Balances list. | The system correctly handles fractional cents without loss (e.g. A is +$6.66, B is -$3.33, C is -$3.33 or similar logic). | KPI-AUD-01 |
| TC-BAL-03 | Calculation latency | A trip exists | 1. Submit an expense.<br>2. Measure time for balances to update. | Running balances reflect the new expense immediately (within <500ms). | KPI-BAL-02 |

---

## 4. Settle Up Summary

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SET-01 | Settle up algorithm accuracy | A trip has multiple recorded expenses | 1. Navigate to the Settle Up Summary section. | The system correctly calculates and displays the most efficient debt resolution paths (who owes whom and exactly how much). | KPI-SET-01 |
| TC-SET-02 | Empty settlement state | A trip is created but no expenses exist | 1. Navigate to the Settle Up Summary section. | The system indicates that everyone is settled up and there are no debts. | PRD Edge Cases |
| TC-SET-03 | Settle up UI rendering | A trip has calculated debts | 1. View the Settle Up Summary on desktop and mobile views. | The summary is rendered clearly without data truncation. | KPI-SET-02 |

---

## 5. End-to-End Scenario Testing

| Test Case ID | Description | Pre-conditions | Steps | Expected Result | Related KPI/PRD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-E2E-01 | 3-Person, 3-Expense Core Scenario | Application is loaded | 1. Create a trip.<br>2. Add 3 members (A, B, C).<br>3. Add Expense 1 (Paid by A).<br>4. Add Expense 2 (Paid by B).<br>5. Add Expense 3 (Paid by C).<br>6. View Running Balances.<br>7. View Settle Up Summary. | The system successfully handles all inputs, balances are calculated 100% accurately, and the correct settle up summary is visibly displayed. | PRD Goal, KPI Success Criteria |
