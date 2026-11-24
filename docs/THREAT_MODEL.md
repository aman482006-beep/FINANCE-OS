# Finance OS threat model

## Current trust boundaries

The deployed code currently runs as a browser application with localStorage. There is no server-side identity, persistent user database, licensed market feed, AI provider connection or brokerage integration. Browser state and all user-provided inputs are untrusted.

## Threats and mitigations

| Threat | Current / required mitigation |
|---|---|
| API key leakage | No keys in frontend; server-side secret manager required for future integrations |
| XSS from user/news content | React text rendering; do not use dangerouslySetInnerHTML; sanitise any future rich HTML |
| Forged portfolio state | Demo only today; server-side ledger and audit trail required before multi-user accounts |
| Order manipulation | No broker execution; future simulator must validate orders atomically on server |
| Prompt injection | Treat retrieved documents and news as untrusted; tool permissions must be enforced outside the model |
| IDOR / cross-user access | No user accounts yet; future API must enforce ownership on every resource |
| Abuse and AI cost exhaustion | Add per-user and per-IP quotas, concurrency limits and token budgets before enabling AI |
| Dependency compromise | Dependabot, npm audit and CodeQL workflows; review updates before merge |
| Secret commits | Private vulnerability reporting; enable GitHub secret scanning/push protection in repository settings |
| Stale financial facts | Provider provenance, exchange timezone, as-of timestamps and licence metadata required |
| Privacy leakage | Avoid sensitive localStorage; implement retention, deletion and consent controls before launch |

## Release blockers for public production

Production auth and authorization, server-side persistence, privacy/data-retention review, a licensed data agreement, API rate limits, incident response, backup/restore testing, observability, availability objectives, vulnerability handling and legal review are all required before the platform is represented as production financial software.
