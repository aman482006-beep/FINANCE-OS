# Contributing to Finance OS

## Development setup

- Node.js 24 and npm 10.8+.
- `npm install`
- `npm run dev`

## Required checks

Before opening a pull request:

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
```

## Engineering principles

- Keep financial calculations in pure, deterministic domain modules under `src/lib`.
- Add unit tests for formulas, input boundaries and error cases.
- Never put private provider credentials in frontend code or `VITE_*` variables.
- Label mock market/news data clearly; do not invent live-data claims.
- Use semantic HTML, explicit input labels, keyboard-operable controls and visible focus states.
- Avoid storing sensitive financial or identity data in browser localStorage.
- Keep UI components thin; isolate business rules and API adapters.
- Explain material limitations and assumptions in the interface.
- PRs should include purpose, risk, testing evidence, screenshots for UI changes and any required migration/configuration.

## Review checklist

A reviewer should inspect correctness, accessibility, security, performance, privacy, data provenance, error states, responsive behaviour and test coverage before approving.
