# Backend Test Cases: Enterprise Travel & Expense Management System

**Persona:** Senior Fullstack QA Engineer (15+ years experience)  
**Context:** Backend (Node.js/NestJS, MongoDB, APIs, Integrations)  
**References:** KPI_Enterprise_Employee_Travel_Expense_Management_System.md, PRD_Enterprise_Travel_Expense.md  

---

## 1. User Management & Authentication (Backend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| BE-TC-001 | Bulk Import | Upload CSV of 10,000 employees via Admin API | Creates/Updates records efficiently without errors | [ ] |
| BE-TC-002 | Token Expiry | API request with JWT older than 15 mins | Returns HTTP 401 Unauthorized | [ ] |
| BE-TC-003 | Failed Logins | 5 consecutive incorrect login attempts | Locks account, logs security event | [ ] |
| BE-TC-004 | RBAC Enforcement | Employee attempts to access `/api/finance/reports` | Returns HTTP 403 Forbidden | [ ] |

## 2. Policy Engine & Approval Workflow (Backend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| BE-TC-005 | Policy Evaluation | Submit request > allowed travel entitlement | Flags violation, returns policy rule failure details | [ ] |
| BE-TC-006 | Multi-level Routing | Submit request requiring 3 approval levels | Routes sequentially: Manager -> Dept Head -> Finance | [ ] |
| BE-TC-007 | Escalation SLA | Approver inactive for > 24 hours | Triggers escalation notification to next level manager | [ ] |
| BE-TC-008 | Budget Check | Submit request exceeding Cost Center budget | Flags insufficient budget, routes to Finance for review | [ ] |

## 3. Expense Processing & APIs (Backend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| BE-TC-009 | OCR Integration | Send receipt image to AWS Textract | Returns extracted JSON data in < 10s | [ ] |
| BE-TC-010 | Per Diem Logic | Calculate per diem for 3 days in Tier 1 city | Calculates correct amount based on user grade & city tier | [ ] |
| BE-TC-011 | Duplicate Hash | Submit receipt image with existing SHA256 hash | Blocks submission, returns duplicate error | [ ] |
| BE-TC-012 | Rate Limiting | Send 101 requests/min from single IP | Returns HTTP 429 Too Many Requests | [ ] |

## 4. Third-Party Integrations (Backend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| BE-TC-013 | HRMS Sync | Scheduled cron job runs at 30 min interval | Syncs profile data bi-directionally, logs mismatches | [ ] |
| BE-TC-014 | ERP Export | Trigger ERP reimbursement batch | Generates SAP IDOC/CSV with correct GL codes | [ ] |
| BE-TC-015 | Payment Callback| Receive payment confirmation webhook from ERP | Updates claim status to "Paid", triggers push/email notification| [ ] |

## 5. Security & Infrastructure (Backend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| BE-TC-016 | Data Encryption | Inspect MongoDB documents & S3 objects | PII and files are encrypted with AES-256 via KMS | [ ] |
| BE-TC-017 | Audit Trail | Attempt to modify audit log via API | Action rejected, immutable audit log created for tampering attempt | [ ] |
| BE-TC-018 | Load Testing | Simulate 10,000 concurrent API requests | P95 Response time < 1s, Kubernetes HPA scales pods | [ ] |
