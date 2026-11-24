# Deployment and operational readiness

## Current deployment shape

Finance OS is a Vite single-page application. The repository includes Vercel headers in `vercel.json` and a Pages-style `public/_headers` file. Choose one deployment provider and verify its response headers after deployment; these files do not deploy the site by themselves.

## Vercel

1. Import the repository.
2. Use the detected Vite framework, `npm run build` build command and `dist` output directory (also declared in `vercel.json`).
3. Use Node.js 24 and npm 10.8+.
4. Deploy preview first, then production.
5. Verify the headers listed below in the browser network panel or with a header checker.

## Required production checks

- Confirm HTTPS and HSTS on the final custom domain.
- Confirm Content Security Policy does not need external script/style/font hosts. If future market feeds or AI APIs are added, add only exact approved endpoints to `connect-src`.
- Test all primary journeys, axe scan, keyboard flow, 200% zoom and narrow viewport.
- Run dependency and CodeQL workflows. Review Dependabot changes.
- Configure repository secret scanning, push protection, Dependabot alerts and branch protection in GitHub settings.
- Configure production monitoring, error reporting, backup/restore and an incident contact before enabling user accounts or external APIs.

## Not included yet

There is no production API, authentication service, database, AI provider, market-data contract, news ingestion pipeline, broker integration or customer data store. Do not market this prototype as an operational financial product until those systems and their controls exist.
