// perf/bp-breakpoint.js
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://127.0.0.1:5500/index.html";

// Breakpoint test
// Gradually increase concurrent users until the app starts to struggle.
// You’ll use the k6 report to see at which stage p95 latency blows up.
export const options = {
  stages: [
    { duration: "30s", target: 20 },  // warm-up
    { duration: "30s", target: 40 },
    { duration: "30s", target: 60 },
    { duration: "30s", target: 80 },
    { duration: "30s", target: 100 }, // likely breakpoint region on a laptop
  ],
  thresholds: {
    // We still keep a loose SLO so the test fails once it’s clearly unhappy
    http_req_duration: ["p(95)<800"], // 95% of requests under 800ms
    http_req_failed: ["rate<0.05"],   // < 5% failures allowed
  },
};

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "serves HTML": (r) =>
      String(r.headers["Content-Type"] || "").includes("text/html"),
  });

  // Tiny think-time between hits
  sleep(1);
}
