# Frontend Test Cases: Enterprise Travel & Expense Management System

**Persona:** Senior Fullstack QA Engineer (15+ years experience)  
**Context:** Frontend (React.js Web App & React Native Mobile App)  
**References:** KPI_Enterprise_Employee_Travel_Expense_Management_System.md, PRD_Enterprise_Travel_Expense.md  

---

## 1. Authentication & User Management (Frontend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| FE-TC-001 | SSO Login | User clicks "Login with SSO" on web/mobile | Redirects to IdP, authenticates, redirects back to dashboard within 3s | [ ] |
| FE-TC-002 | MFA Prompt | User logs in with Finance role | Prompts for TOTP/MFA code before dashboard access | [ ] |
| FE-TC-003 | Session Timeout | User inactive for 15 minutes | Auto-redirects to login screen with session expiry message | [ ] |
| FE-TC-004 | Biometric Auth | User opens mobile app after initial login | Prompts for Face ID/Fingerprint | [ ] |

## 2. Travel Request Management (Frontend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| FE-TC-005 | Form Validation | Submit travel request without mandatory fields | Displays inline error messages for missing fields | [ ] |
| FE-TC-006 | Save as Draft | Click "Save as Draft" on incomplete form | Saves locally/to server, displays success toast | [ ] |
| FE-TC-007 | Policy Pre-check | Enter flight cost exceeding policy limit | Displays inline soft/hard warning immediately | [ ] |
| FE-TC-008 | Offline Mode | Submit request with no internet connection (Mobile) | Saves to local queue, syncs when connection restored | [ ] |

## 3. Expense Management & OCR (Frontend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| FE-TC-009 | Camera Capture | Capture receipt via mobile app camera | Opens camera, captures image clearly, initiates upload | [ ] |
| FE-TC-010 | OCR Auto-fill | Upload receipt image | Form fields (amount, date, merchant) auto-fill within 10s | [ ] |
| FE-TC-011 | Duplicate Warning | Submit claim with identical receipt | UI shows "Duplicate Detected" warning | [ ] |
| FE-TC-012 | Multi-currency | Enter expense in USD | Auto-converts to INR (base) using current exchange rate | [ ] |

## 4. Dashboards & Reporting (Frontend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| FE-TC-013 | Role Dashboard | Login as Manager | Displays pending approvals widget and team budget charts | [ ] |
| FE-TC-014 | Mobile Parity | Open Analytics on Mobile | Renders responsive charts without horizontal scrolling | [ ] |

## 5. Performance & Accessibility (Frontend)

| Test ID | Feature | Scenario | Expected Outcome | Status (Pass/Fail) |
|---|---|---|---|---|
| FE-TC-015 | Page Load | Load primary dashboard on 10Mbps connection | Completes render in < 3 seconds | [ ] |
| FE-TC-016 | App Size | Install mobile app from app store | Install package size is under 50 MB | [ ] |
