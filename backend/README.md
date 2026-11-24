# Backend service — planned boundary

The initial repository commit is a frontend prototype. A production backend is not wired yet. Recommended first service: Python 3.11 + FastAPI + PostgreSQL.

Implement in this order:
1. Health endpoint and settings validation.
2. Authentication and learner profile.
3. Curriculum read endpoints and progress write endpoint.
4. Assessment attempts and rubric evidence.
5. Virtual account ledger and atomic simulated order execution.
6. AI provider adapter with server-side secrets and usage controls.

Do not expose API keys to the React client. Do not connect this simulator to a broker.
