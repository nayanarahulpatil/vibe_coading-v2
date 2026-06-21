act as [qa_persona.md](file;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/Personas/qa_persona.md) create test code coverage report create a report file for frontend and backend.


Act as a [qa_persona.md](file;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/Personas/qa_persona.md) performing line-by-line coverage remediation.
Coverage report indicates specific uncovered lines. [test_coverage_report.md](file;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/trip-budget-tracker/tests/test_coverage_report.md) 
Requirements:
1. Read the source code from [trip-budget-tracker](directory;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/trip-budget-tracker) 
2. Identify every uncovered statement and branch.
3. Generate the minimum number of additional tests required for 100% coverage.
4. Include route tests, service tests, component tests, integration tests, and error-path tests.
Return:
* exact test file names
* complete code
* explanation of which uncovered lines each test covers
* expected final coverage percentage

act as a [qa_persona.md](file;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/Personas/qa_persona.md) work on Playwright E2E failures.

analyze the - [test-results](directory;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/trip-budget-tracker/test-results) and implemented code [trip-budget-tracker](directory;file:///d%3A/vibe%20code/vibe_coading-v2/10-June-work/trip-budget-tracker) 

Your job:

* Diagnose exact mismatch between test expectation and system behavior
* Fix ONLY what is broken
* Do NOT refactor unrelated code
* Ensure fix improves test stability

For each failure:

* Root cause
* Minimal fix
* Updated code snippet
* Updated test if necessary
* Reasoning

Focus on:

* async timing issues
* API response mismatches
* missing selectors
* authentication failures
* database state issues
* route mismatches
REAL BUG vs TEST BUG vs ENV ISSUE
