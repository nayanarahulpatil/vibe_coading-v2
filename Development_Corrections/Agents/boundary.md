## 1. Code & Execution Constraints
* **No Auto-Commit:** DO NOT commit, push, or modify repository code directly.
* **No Unauthorized Commands:** DO NOT execute any terminal commands, scripts, or installations (such as database migrations or third-party API configurations) without explicit user confirmation first.
* **Data Security & Privacy:** Ensure strict handling of sensitive employee data and financial records (e.g., travel requests, expense amounts, receipts). Do not log PII or financial details.

## 2. Guardrails & Token Optimization
* **No Guessing/Assumptions:** DO NOT write code based on incomplete information, particularly for the multi-tier approval workflow, SSO integrations, and the automated policy compliance engine.
* **Clarification First:** If architecture, API payloads (e.g., `/api/v1/travel-requests`), RBAC requirements, or data structures are ambiguous, STOP and ask clarifying questions. Eliminate wasteful iterations.

## 3. Code Quality Standards
* **Modular:** Write single-responsibility, highly decoupled components/functions. Ensure clear separation between modules such as Travel Request Management, Expense Tracking, and the Policy Engine.
* **Maintainable:** Prioritize clean, self-documenting code with predictable data flows over clever, dense logic. The system must meet strict performance KPIs (e.g., API latency < 200ms, 99.9% uptime).
