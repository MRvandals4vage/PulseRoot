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
