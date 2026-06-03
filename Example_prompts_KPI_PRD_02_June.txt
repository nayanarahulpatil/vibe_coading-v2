Prompt for KPI Generation

ROLE:

You are a Senior Business Analyst, Product Owner, Enterprise Solution Architect, QA Lead, and KPI Consultant with extensive experience designing large-scale enterprise applications.



TASK:

Analyze the provided project information and generate a complete production-ready KPI.md document.



PROJECT NAME:

Enterprise Employee Travel & Expense Management System



CLIENT BACKGROUND:



We are a large organization with approximately 10,000+ employees operating across multiple locations.



Employees frequently travel for:



* Client Meetings

* Business Conferences

* Training Programs

* Internal Meetings

* Audits

* Vendor Meetings

* Project Deployments

* Customer Visits



Currently, travel requests, approvals, expense claims, reimbursements, and reporting activities are managed through:



* Emails

* Excel Sheets

* Phone Calls

* Paper-Based Documents



This process creates significant operational challenges including:



* Lack of visibility

* Approval delays

* Missing documentation

* Manual effort

* Policy violations

* Expense fraud risks

* Poor auditability

* Delayed reimbursements

* Inaccurate reporting



BUSINESS PROBLEM STATEMENT:



The organization requires a centralized Travel & Expense Management System that automates the entire travel lifecycle from travel request creation to reimbursement settlement.



The system should:



1. Allow employees to submit travel requests.

2. Enable multi-level approval workflows.

3. Support travel policy validation.

4. Manage travel bookings.

5. Capture expense claims.

6. Upload bills and receipts.

7. Perform expense verification.

8. Support reimbursement processing.

9. Generate reports and dashboards.

10. Maintain audit trails.

11. Send notifications and reminders.

12. Support web and mobile platforms.

13. Handle 10,000+ employees.

14. Integrate with HRMS and Finance systems.



TARGET USERS:



1. Employees

2. Managers

3. Department Heads

4. Finance Team

5. Travel Desk Team

6. HR Team

7. Auditors

8. System Administrators



EXPECTED MODULES:



1. User Management

2. Authentication & Authorization

3. Employee Profile Management

4. Travel Request Management

5. Travel Approval Workflow

6. Travel Booking Management

7. Expense Claim Management

8. Receipt & Document Management

9. Expense Verification

10. Reimbursement Processing

11. Policy Compliance Engine

12. Notification & Alerts

13. Dashboard & Analytics

14. Reports Management

15. Audit Trail Management

16. Admin Management

17. HRMS Integration

18. Finance/ERP Integration

19. Mobile Application Support

20. Security & Compliance

21. Performance & Scalability

22. Testing & Documentation

23. Deployment & Infrastructure



OUTPUT FORMAT:



Generate a complete KPI.md file using the following structure:



# Project: Enterprise Employee Travel & Expense Management System



## Project Description



Provide a detailed business overview describing:



* Problem

* Objectives

* Business Benefits

* Expected Outcomes

* User Types



---



# Key Performance Indicators (KPIs)



For every module create KPI tables.



Example:



## 1. User Management



| KPI               | Description                                        | Pass/Fail |

| ----------------- | -------------------------------------------------- | --------- |

| User Registration | Employees can register using corporate credentials | Pass      |

| User Login        | Users can securely login                           | Pass      |



Requirements:



* Minimum 5 KPIs per module

* Maximum 10 KPIs per module

* All KPIs must be measurable

* All KPIs must be testable

* KPIs should act as acceptance criteria

* Status should default to Pass



---



## Non-Functional KPIs



Create KPI tables for:



### Performance



Examples:



| KPI                 | Target      |

| ------------------- | ----------- |

| Page Load Time      | < 3 seconds |

| API Response Time   | < 2 seconds |

| Database Query Time | < 500ms     |

| Concurrent Users    | 10,000+     |



### Security



Examples:



| KPI                 | Target  |

| ------------------- | ------- |

| MFA Support         | Enabled |

| Password Encryption | bcrypt  |

| OWASP Compliance    | Pass    |



### Reliability



Examples:



| KPI                     | Target   |

| ----------------------- | -------- |

| System Availability     | 99.9%    |

| Backup Frequency        | Daily    |

| Recovery Time Objective | < 1 hour |



---



## Technical Stack



Recommend enterprise-grade technology stack:



Frontend:



* React Native

* React.js

* TypeScript



Backend:



* Node.js

* NestJS



Database:



* Mongo DB



Caching:



* Redis



Authentication:



* OAuth2

* JWT

* MFA



Storage:



* AWS S3



Notification:



* Firebase

* Email

* SMS



Reporting:



* Power BI



Containerization:



* Docker

* Kubernetes



CI/CD:



* GitHub Actions



Monitoring:



* Prometheus

* Grafana



Testing:



* Jest

* Cypress



---



## Development Timeline



Create realistic implementation phases:



Phase 1:



* Requirement Analysis

* Architecture Design



Phase 2:



* Authentication

* User Management



Phase 3:



* Travel Management



Phase 4:



* Expense Management



Phase 5:



* Integrations



Phase 6:



* Testing



Phase 7:



* Deployment



---



## Success Criteria



Generate 20 measurable business success criteria.



Examples:



* Employees can submit travel requests within 3 minutes.

* Managers can approve requests within 1 minute.

* Expense claims are processed within SLA.

* Reimbursements are completed within 5 business days.

* Policy violations are automatically detected.

* Audit logs are available for every transaction.

* Mobile users can complete all major workflows.

* System supports 10,000+ active employees.

* Reports are generated within 10 seconds.

* Finance team effort is reduced by 70%.



CONSTRAINTS:



1. Output only markdown.

2. Create a complete KPI.md document.

3. Think like a Business Analyst, Product Owner, Architect, and QA Lead.

4. Do not generate generic KPIs.

5. Generate enterprise-level KPIs.

6. Ensure every KPI is measurable and testable.

7. Include both Functional and Non-Functional KPIs.

8. Follow industry-standard enterprise software practices.

9. Include acceptance criteria-style KPIs.

10. The final document should be ready for stakeholder review and QA validation.







Propmt for PRD generation

# KPI to Enterprise PRD Generator (Markdown Output)

## ROLE

You are a:

* Senior Product Manager
* Enterprise Solution Architect
* Business Analyst
* Technical Program Manager
* QA Lead
* Enterprise Architect
* Security Architect
* UX Strategist
* Compliance Consultant

with experience building enterprise SaaS products for 10,000+ users.

---

## INPUT

The attached KPI document is the SINGLE SOURCE OF TRUTH.

Analyze the entire KPI document and generate a complete Product Requirements Document (PRD).

DO NOT generate another prompt.

DO NOT summarize.

Generate the actual PRD.

---

## OUTPUT FORMAT REQUIREMENT

Generate the final deliverable as a single Markdown document.

Output must be valid `.md` format.

Use:

* `#` for H1
* `##` for H2
* `###` for H3
* Markdown tables
* Bullet lists
* Numbered lists
* Mermaid diagrams where applicable

The final output must be suitable for saving directly as:

```text
Enterprise_Travel_Expense_PRD.md
```

---

## DOCUMENT GENERATION RULES

Before writing the PRD:

### Step 1 – KPI Analysis

Create:

#### KPI Inventory

| KPI ID | Module | KPI | Description |
| ------ | ------ | --- | ----------- |

#### Business Objective Inventory

| Objective ID | Objective | KPI Mapping |
| ------------ | --------- | ----------- |

#### User Role Inventory

| Role | Responsibilities |
| ---- | ---------------- |

#### Integration Inventory

| Integration | Purpose | Direction |
| ----------- | ------- | --------- |

#### Compliance Inventory

| Requirement | Source KPI |
| ----------- | ---------- |

---

### Step 2 – Requirement Expansion

For EVERY KPI generate:

#### Business Requirement

```text
BR-XXX
```

#### Functional Requirement

```text
FR-XXX
```

#### Non Functional Requirement

```text
NFR-XXX
```

#### User Story

Format:

As a <Role>
I want <Goal>
So that <Business Value>

#### Acceptance Criteria

Format:

Given
When
Then

#### Business Rules

#### Validation Rules

#### Error Handling

#### Security Requirements

#### Audit Requirements

#### API Requirements

#### Data Requirements

#### Reporting Requirements

#### KPI Traceability

---

## ANTI-HALLUCINATION RULES

If information is not available in the KPI document:

Create section:

```markdown
## Assumptions
```

Mark each item:

```text
ASSUMPTION:
```

Never invent:

* Roles
* Approval levels
* Integrations
* Compliance requirements
* Policies

unless explicitly defined.

Every requirement must trace back to:

* KPI
* Business Objective
* Success Metric
* Technical Constraint

---

# PRD STRUCTURE

## 1. Executive Summary

* Project Overview
* Business Problem
* Current State
* Future State
* Proposed Solution
* Business Value
* ROI
* Success Metrics

---

## 2. Product Vision

* Vision Statement
* Strategic Goals
* Business Outcomes
* Digital Transformation Impact

---

## 3. Business Objectives

For each objective:

* Description
* Baseline
* Target
* Measurement Method
* KPI Mapping

---

## 4. Stakeholder Matrix

| Stakeholder | Responsibility | Interest | Success Criteria |
| ----------- | -------------- | -------- | ---------------- |

---

## 5. User Personas

Generate detailed personas for:

* Employee
* Manager
* Department Head
* Finance Executive
* Travel Desk
* HR
* Auditor
* Admin

Include:

* Goals
* Pain Points
* Responsibilities
* Permissions
* Workflows

---

## 6. Scope Definition

### In Scope

### Out of Scope

### Future Scope

---

## 7. Functional Requirements

Generate detailed requirements for:

1. User Management
2. Authentication & Authorization
3. Employee Profile Management
4. Travel Request Management
5. Travel Approval Workflow
6. Travel Booking Management
7. Expense Claim Management
8. Receipt Management
9. Expense Verification
10. Reimbursement Processing
11. Policy Compliance Engine
12. Notifications
13. Dashboards
14. Reports
15. Audit Trail
16. Admin Management
17. HRMS Integration
18. ERP Integration
19. Mobile Application

For each module include:

* Module Overview
* Business Context
* Business Requirements
* Functional Requirements
* User Stories (minimum 10)
* Acceptance Criteria
* Business Rules
* Validation Rules
* Error Handling
* Edge Cases
* Security Requirements
* Audit Requirements
* Data Requirements

---

## 8. Workflow Specifications

Create detailed workflows for:

* Travel Request Workflow
* Approval Workflow
* Booking Workflow
* Expense Submission Workflow
* Verification Workflow
* Reimbursement Workflow
* Dispute Workflow
* Escalation Workflow
* Exception Workflow
* Policy Violation Workflow

Represent using:

### Mermaid Flowcharts

and

| Actor | Trigger | Action | System Response |
| ----- | ------- | ------ | --------------- |

---

## 9. RBAC Matrix

Detailed Role Based Access Matrix.

---

## 10. Non Functional Requirements

Include:

* Performance
* Security
* Reliability
* Availability
* Scalability
* Maintainability
* Accessibility
* Compliance
* Disaster Recovery
* Observability

Convert all KPI targets into measurable NFRs.

---

## 11. Integration Requirements

### HRMS

### ERP

### OCR

### Notification Services

### SSO

For each:

* Architecture
* Data Flow
* Sync Strategy
* Retry Strategy
* Error Handling
* Failure Recovery

---

## 12. Data Model

Include:

### Entity Definitions

### Relationships

### Cardinality

### Retention Rules

### Audit Fields

Generate Mermaid ER Diagram.

---

## 13. API Catalog

For every API:

| Endpoint | Method | Description |
| -------- | ------ | ----------- |

Include:

* Request
* Response
* Validation
* Error Codes
* Security
* Rate Limits

---

## 14. Reporting Requirements

Detailed report specifications.

---

## 15. Mobile Requirements

Include:

* Offline Mode
* Push Notifications
* Camera Capture
* OCR
* Biometrics
* Sync Strategy

---

## 16. Security Requirements

Include:

* RBAC
* MFA
* JWT
* Encryption
* Audit Logging
* OWASP
* GDPR
* PDPA
* PII Protection

---

## 17. Risk Analysis

Generate minimum 15 risks.

| Risk | Probability | Impact | Mitigation | Owner |
| ---- | ----------- | ------ | ---------- | ----- |

---

## 18. Release Planning

### MVP

### Phase 2

### Phase 3

### Enterprise Rollout

---

## 19. Success Metrics

Convert KPI success criteria into production metrics.

---

## 20. Assumptions & Dependencies

Separate:

### Explicit Requirements

### Assumptions

### External Dependencies

---

## 21. Traceability Matrix

| KPI ID | Requirement ID | User Story ID | Acceptance Criteria ID |
| ------ | -------------- | ------------- | ---------------------- |

---

## 22. Appendix

Include:

* Glossary
* Acronyms
* Reference Architecture
* Compliance Matrix
* Data Retention Matrix

---

## FINAL OUTPUT REQUIREMENT

The generated Markdown document should be equivalent to an enterprise PRD of 80–150 pages when exported to Word or PDF.

Generate the complete PRD section-by-section until finished.

Do not stop after a few sections.

Continue generation until all sections are completed.

Ensure full traceability between KPI → Requirement → User Story → Acceptance Criteria.