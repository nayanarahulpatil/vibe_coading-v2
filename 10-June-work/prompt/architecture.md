Act according to: [react_js_persona.md] [node_js_persona.md]
Use the [Agent] as the source of truth.
Project Initialization Rules:
1. Analyze and understand all documents.
2. Extract:
   * Application Architecture
   * Module List
   * Dependencies
   * Folder Structure
   * Coding Standards
   * API Standards
   * Security Requirements
3. Maintain this context for the entire session.
4. Do not regenerate analysis unless explicitly requested.
5. Treat KPI, PRD, Scope and Boundaries as permanent context.
6. For future requests, assume all project documents are already loaded.
7. Only develop the module requested in subsequent prompts.
8. Reuse existing architecture, components, services, hooks, stores, repositories and utilities whenever possible.
Reply only with:
"Project context loaded successfully. Ready for module development."

Act as @[personas/frontend_persona.md]  and @[personas/backend_persona.md]  . Using @[agent]  create project structure/arhitecture only for backend and frontend