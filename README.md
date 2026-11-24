# Finance OS

**Learn Finance. Practise Finance. Think Like a Finance Professional.**

Finance OS is a finance learning and career-practice workspace. It combines a structured curriculum, guided exercises, simulated decisions, written-analysis review and valuation practice.

## Live preview

When GitHub Pages is configured to publish with **GitHub Actions**, the site is available at:

**https://aman482006-beep.github.io/FINANCE-OS/**

The Pages workflow compiles the Vite application and publishes the generated `dist/` folder. Do not publish the repository root as a Pages source: the raw React/TypeScript entrypoint is not browser-ready.

## Current application

- Eight curriculum domains with 20 lessons, worked explanations and self-check exercises.
- Browser-saved learning progress.
- Virtual market simulator with validated buy/sell orders and local paper-trade ledger.
- News Lab with three hypothetical case studies and a transparent five-dimension writing rubric.
- Multi-year DCF teaching model with cash-flow forecast, discounting, terminal value and enterprise/equity-value bridge.
- Seven finance career tracks and progress overview.
- Responsive UI, keyboard support, focus handling and reduced-motion styles.

## Run locally

Requirements: Node.js 22.12+ and npm 10.8+.

```bash
npm install
npm run dev
```

## Quality commands

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --audit-level=high
```

## Deployment

- GitHub Pages: `.github/workflows/pages.yml` builds with the `/FINANCE-OS/` base path, runs unit/browser/accessibility checks and deploys `dist/`.
- Vercel: `vercel.json` uses the normal root base path.

**One-time GitHub Pages setting:** in Repository Settings → Pages → Build and deployment → Source, select **GitHub Actions**. This is required when moving from branch publishing to a custom Actions build workflow.

## Important product limitations

This is a browser-first MVP, not a production financial service. Accounts are not authenticated; progress, simulated orders and analysis are stored only in browser localStorage. Prices and news cases are educational fixtures, not live or historical feeds. The AI Mentor is an integration placeholder; written review is a deterministic rubric, not an LLM or professional assessor. Research, spreadsheet import/export, fully integrated three-statement/LBO/M&A modelling, multi-agent Finance Council, real company data and interview simulations remain roadmap items.

No broker is connected and no real orders are placed. Do not enter sensitive personal or financial information.
