## 22. Master prompt PRD generation

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

Enterprise_Travel_Expense_PRD.md

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

BR-XXX

#### Functional Requirement

FR-XXX

#### Non Functional Requirement

NFR-XXX

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

## Assumptions

Mark each item:

ASSUMPTION:

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
