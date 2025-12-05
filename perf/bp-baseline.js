// perf/bp-baseline.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: {
    // 95% of requests should be faster than 500ms
    http_req_duration: ["p(95)<500"],

    // Less than 1% of requests should fail
    http_req_failed: ["rate<0.01"],
  },
};

// Allow overriding the URL from env, but default to your static server
const BASE_URL = __ENV.BP_BASE_URL || "http://127.0.0.1:5500/index.html";

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "page has BP title": (r) =>
      r.body.includes("Blood Pressure Category Calculator"),
  });

  // tiny think-time so it's realistic
  sleep(1);
}
