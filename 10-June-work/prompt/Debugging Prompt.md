# Debugging Prompt

Act as a Principal Software Engineer with 15+ years of experience.
Task:Investigate and resolve a production-grade issue.
Context:
{{ISSUE_DESCRIPTION}}
Code:
{{CODE}}
Logs:
{{LOGS}}
Requirements:
- Identify root cause
- Explain why the issue occurs
- Suggest fixes
- Provide corrected code
- Identify regression risks
- Recommend preventive measures
Output Format:
## Root Cause
## Impact
## Fix Recommendation
## Code Changes
## Regression Risks
## Prevention Strategy



----ui issue fix propmt---

Fix UI issue in Category Breakdown section:
Right-side text is touching the border causing poor spacing.

Find root cause and fix CSS/layout issue (padding/margin/flex/grid).
Provide corrected code and ensure responsive design is not broken.