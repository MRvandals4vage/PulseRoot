import { getTelemetryStore, replaceTelemetryStore, type Store } from "@/lib/telemetry-store";

const TELEMETRY_KEY = "pulseroot:telemetry:v1";

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCommand<T>(command: unknown[]) {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify([command]),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Upstash Redis request failed: ${response.status}`);
  const [result] = await response.json();
  if (result.error) throw new Error(result.error);
  return result.result as T;
}

export async function readTelemetryStore() {
  if (!redisConfig()) return getTelemetryStore();

  try {
    const stored = await redisCommand<string | null>(["GET", TELEMETRY_KEY]);
    if (!stored) return getTelemetryStore();
    return replaceTelemetryStore(JSON.parse(stored) as Store);
  } catch {
    return getTelemetryStore();
  }
}

export async function persistTelemetryStore(store = getTelemetryStore()) {
  if (!redisConfig()) return { persisted: false, backend: "memory" };

  try {
    await redisCommand(["SET", TELEMETRY_KEY, JSON.stringify(store)]);
    return { persisted: true, backend: "upstash-redis" };
  } catch {
    return { persisted: false, backend: "memory-fallback" };
  }
}

export function telemetryBackend() {
  return redisConfig() ? "upstash-redis" : "memory";
}
