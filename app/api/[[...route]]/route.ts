import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

type EnvConfig = {
  UPSTASH_REDIS_URL: string;
  UPSTASH_REDIS_TOKEN: string;
};

const app = new Hono().basePath("/api");

app.use("/*", cors());

app.get("/search", async (c) => {
  try {
    const { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } = env<EnvConfig>(c);

    const startTime = performance.now();

    const redis = new Redis({
      url: UPSTASH_REDIS_URL,
      token: UPSTASH_REDIS_TOKEN,
    });

    const query = c.req.query("q");

    if (!query) {
      return c.json({ message: "Invalid query" }, { status: 400 });
    }

    const q = query.toUpperCase();
    const results = [];
    const rank = await redis.zrank("terms", q);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

      for (const el of temp) {
        if (!el.startsWith(q)) {
          break;
        }

        if (el.endsWith("*")) {
          results.push(el.substring(0, el.length - 1));
        }
      }
    }

    const endTime = performance.now();

    return c.json({ results, duration: endTime - startTime });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Something went wrong" }, { status: 500 });
  }
});

export const GET = handle(app);
export default app as never;
