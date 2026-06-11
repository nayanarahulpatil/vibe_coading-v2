## 21. Master prompt KPI generation

ROLE:
You are a Senior Business Analyst, Product Owner, Solution Architect, QA Lead, and Enterprise Software Consultant.

TASK:
Analyze the provided project background and business requirements and create a complete KPI.md document in markdown format.

OBJECTIVE:
Generate measurable Key Performance Indicators (KPIs) that can be used by Product Owners, Business Analysts, Developers, QA Engineers, and Stakeholders to validate project success.

INPUT:
Project Name: [PROJECT_NAME]

Client Background:
[CLIENT_BACKGROUND]

Business Problem Statement:
[PROBLEM_STATEMENT]

OUTPUT FORMAT:

# Project: [PROJECT_NAME]

## Project Description

Provide a concise overview of the system, its purpose, target users, and business goals.

---

# Key Performance Indicators (KPIs)

Create KPI sections based on the project domain.

For each module generate a table:

## 1. [MODULE NAME]

| KPI      | Description                     | Pass/Fail |
| -------- | ------------------------------- | --------- |
| KPI Name | Detailed measurable requirement | Pass      |

Rules:

* Create 5–10 KPIs per module.
* KPIs must be measurable and testable.
* KPIs should represent acceptance criteria.
* Default status should be "Pass".
* Cover both business and technical requirements.

Possible modules (adjust based on project):

1. User Management
2. Authentication & Authorization
3. Travel Request Management
4. Expense Claim Management
5. Approval Workflow
6. Policy Compliance
7. Notifications & Alerts
8. Reimbursement Processing
9. Reports & Analytics
10. Admin Management
11. Audit & Compliance
12. Mobile Responsiveness
13. Security
14. Performance
15. Integration
16. Testing & Documentation
17. Deployment & Infrastructure

---

## Technical Stack

Recommend an enterprise-grade technical stack.

Include:

* Frontend
* Backend
* Database
* Authentication
* File Storage
* Notifications
* Reporting Engine
* Containerization
* CI/CD
* Monitoring
* Testing Frameworks

Format:

* **Frontend:** ...
* **Backend:** ...
* **Database:** ...
* **Authentication:** ...
* **Containerization:** ...

---

## Development Timeline

Create a realistic implementation plan.

Example:

### Phase 1

* Requirement Analysis
* Architecture Design

### Phase 2

* Core Development

### Phase 3

* Integrations

### Phase 4

* Testing

### Phase 5

* Deployment

---

## Non-Functional KPIs

Create measurable KPIs for:

| KPI                  | Target       |
| -------------------- | ------------ |
| API Response Time    | < 2 seconds  |
| System Availability  | 99.9%        |
| Concurrent Users     | 10,000+      |
| Database Query Time  | < 500ms      |
| Security Compliance  | OWASP Top 10 |
| Backup Recovery Time | < 1 hour     |

---

## Success Criteria

Generate 10-20 measurable success criteria.

Example:

* Employees can create travel requests in less than 3 minutes.
* Managers can approve/reject requests within 1 minute.
* Expense claims are processed with 100% audit traceability.
* Reimbursements are completed within SLA timelines.
* Travel policy violations are automatically detected.
* Reports can be generated in less than 10 seconds.
* System supports 10,000+ employees.
* Mobile and desktop experiences are fully responsive.
* Role-based access control is enforced across all modules.

---

ADDITIONAL RULES

1. Think like a Business Analyst and QA Lead.
2. Every KPI must be testable.
3. Every KPI should be measurable.
4. Avoid vague requirements.
5. Include business KPIs and technical KPIs.
6. Include enterprise-scale considerations.
7. Output only markdown.
8. Structure the document exactly as a production-ready KPI.md file.
9. Create KPIs according to the domain and project requirements rather than using generic placeholders.
10. Include all mandatory modules and add domain-specific modules when necessary.
