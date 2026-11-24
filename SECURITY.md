# Security policy

## Reporting a vulnerability

Please use GitHub's private **Report a vulnerability** flow under the repository's Security tab. Do not publish exploitable details in a public issue. Provide a reproduction, affected commit/version, impact assessment and suggested mitigation where possible.

## Security posture and boundaries

- The current application is a browser-only learning prototype. It has no production account system, server API, secrets, or real brokerage connection.
- Paper-trading state is untrusted client-side demo state. It must never be used as a financial ledger or sent to a broker.
- Market and news fixtures are not live data.
- Do not put API keys in source code or any `VITE_*` variable; client-side environment variables are public after build.
- A future backend must validate every write server-side, enforce authentication/authorization, rate-limit AI and data endpoints, and maintain an auditable ledger.
- Treat uploaded documents, retrieved pages and user prompts as untrusted input. Avoid arbitrary code execution, unsafe HTML rendering and prompt-based tool authorization.
- Financial calculations must be deterministic and covered by tests; LLMs may explain validated outputs but must not control balances or execution.

## Supported versions

Security fixes target the default branch. Dependabot is configured for npm dependencies and GitHub Actions. Critical/high dependency advisories fail the CI audit.
