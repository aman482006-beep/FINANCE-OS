# Finance OS Architecture

## Current client foundation
- React + TypeScript + Vite.
- Tailwind is configured, with a product-specific CSS system for the terminal UI.
- Recharts for the illustrative portfolio chart.
- Browser localStorage only for the current single-device prototype.

## Target production architecture

```text
Web client (React/TypeScript)
        |
        v
API gateway / FastAPI service
        |-- Authentication & learner profile
        |-- Curriculum / assessment / progress service
        |-- Assignment / portfolio service
        |-- Simulator service (isolated from brokerage)
        |-- Research & news ingestion service
        |-- AI orchestration service
        |
        +--> PostgreSQL (users, curriculum, evidence, trades)
        +--> Redis (cache, queues, rate limits)
        +--> Object storage (models, reports, exports)
        +--> Licensed market/news data adapters
        +--> LLM provider adapter (server-side secrets only)
```

## Key domain boundaries
- **Learner:** profile, goals, baseline assessment, roadmap.
- **Learning:** module, lesson, content block, question, response, attempt.
- **Evidence:** skill, rubric, evidence item, assessor feedback, confidence.
- **Simulator:** virtual account, cash ledger, order, fill, position, benchmark.
- **Research:** company, financial metric, source document, observation date.
- **News:** event, source, published_at, observed_at, challenge, outcome reveal.
- **Portfolio:** project, artifact, methodology, assumptions, limitations, visibility.

## AI design
LLM output must never be the source of truth for financial calculations or account balances. Use deterministic calculation services and pass verified results to the model for explanation. All external content is untrusted input. Use structured prompts, retrieval with source provenance, output validation, usage limits and human review for high-impact workflows.

## Market data
Introduce a provider interface rather than binding the product to one vendor. Preserve raw provider timestamps, exchange timezone, currency, adjustment policy and licence metadata. The UI must show real-time/delayed/historical status. Until the provider is configured, use clearly labelled fixture data only.

## Security and privacy
- Auth and authorisation enforced server-side.
- Provider secrets held in backend environment variables or secret manager.
- Validate and rate-limit all writes.
- Audit simulator ledger changes.
- Use least-privilege access and user-controlled project sharing.
- No real brokerage connection in the MVP.
