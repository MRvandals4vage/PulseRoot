# PulseRoot

PulseRoot is an AI-powered SRE incident intelligence platform for ingesting telemetry, correlating incidents, and generating root-cause analysis.

## Production Environment

Set these variables in your deployment provider. Do not commit real secrets.

```bash
GROQ_API_KEY=
GEMINI_API_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_DATABASE_PASSWORD=
SUPABASE_DATABASE_URL=
```

`SUPABASE_DATABASE_URL` should point to the Supabase Postgres database with SSL enabled.

## Persistence

- Supabase Postgres is the durable source of truth for telemetry events and service status.
- Upstash Redis caches the latest trimmed telemetry snapshot for realtime dashboard reads.
- The app automatically creates the required Supabase tables on first telemetry write.

## Ingest Telemetry

```bash
curl -X POST https://your-domain.com/api/telemetry \
  -H "content-type: application/json" \
  -d '{"source":"api","service":"checkout-api","message":"HTTP 500 spike","severity":"high","status":"degraded","metric":{"latency":812,"errors":7.4}}'
```

Provider-style webhooks can post to:

```bash
https://your-domain.com/api/integrations/webhook?provider=datadog
```

## Deploy

```bash
npm install
npm run build
npm run start
```

## Hackathon Submission

Use these values for the Product Space submission form after deploying the app.

Link to access your agent:

```text
https://YOUR_DEPLOYED_DOMAIN/agent
```

Credentials to access your agent:

```text
No credentials required. The PulseRoot agent dashboard is public for judging. Use the Demo Scenario button to run the cinematic outage flow, or send real telemetry to /api/telemetry.
```

GitHub codebase link:

```text
https://github.com/MRvandals4vage/PulseRoot
```

n8n workflow JSON file:

```text
Not applicable. PulseRoot is implemented as a Next.js production web agent with Supabase Postgres, Upstash Redis, Groq/Gemini AI endpoints, and webhook ingestion APIs.
```

Other material:

```text
README includes deployment instructions, production environment variables, ingestion examples, and architecture notes.
```
