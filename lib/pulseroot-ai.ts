import { incidents, logs, metricSeries, reportMarkdown, timeline } from "@/components/rootlens-data";

type AiPayload = {
  prompt?: string;
  mode?: string;
  incident?: string;
};

const context = {
  incidents,
  logs,
  timeline,
  latestMetrics: metricSeries.slice(-8),
};

const fallbackAnalysis = {
  summary:
    "PulseRoot correlated deployment v1.4.2, Postgres connection saturation, payment API 504s, retry queue growth, and Kubernetes OOM restarts. The most likely root cause is a payment-service pool configuration regression that exhausted database capacity and created a timeout cascade.",
  confidence: 94,
  rootCause: "Database connection exhaustion after payment-service v1.4.2.",
  affectedSystems: ["payment-service", "postgres-primary", "api-service", "redis retry queue", "k8s payment workers"],
  remediation: [
    "Roll back payment-service to v1.4.1.",
    "Cap payment-worker concurrency and drain retry queues gradually.",
    "Scale the Postgres pooler and temporarily raise API timeout budget.",
    "Suppress duplicate downstream timeout alerts under the parent incident.",
  ],
  commands: [
    "kubectl rollout undo deploy/payment-service -n prod",
    "kubectl scale deploy/payment-worker --replicas=4 -n prod",
    "kubectl rollout status deploy/payment-service -n prod",
  ],
};

export async function runPulseRootAi(payload: AiPayload) {
  const prompt = payload.prompt || "Analyze the current PulseRoot incident.";
  const system = `You are PulseRoot, an enterprise SRE incident intelligence engine. Return concise JSON with summary, confidence, rootCause, affectedSystems, remediation, commands. Use this telemetry context: ${JSON.stringify(context)}`;

  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        return JSON.parse(content);
      }
    } catch {
      return fallbackAnalysis;
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${system}\n\n${prompt}\nReturn only JSON.` }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(content);
      }
    } catch {
      return fallbackAnalysis;
    }
  }

  return fallbackAnalysis;
}

export function generateReport() {
  return {
    markdown: reportMarkdown,
    shareUrl: "https://pulseroot.example/incidents/checkout-api-outage-sev1",
    generatedAt: new Date().toISOString(),
  };
}

export function sendNotification(channel: string) {
  return {
    ok: true,
    channel,
    status: "simulated_delivery_complete",
    message: `PulseRoot sent the SEV-1 incident summary to ${channel}.`,
    deliveredAt: new Date().toISOString(),
  };
}
