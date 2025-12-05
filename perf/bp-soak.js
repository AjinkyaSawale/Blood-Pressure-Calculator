// perf/bp-soak.js
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://127.0.0.1:5500/index.html"; // same as your other k6 tests

// Step 4 – Soak test: moderate load for a longer period
export const options = {
  vus: 10,               // moderate number of virtual users
  duration: "3m",        // 3 minutes of steady load
  thresholds: {
    http_req_duration: ["p(95)<400"], // 95% requests under 400ms
    http_req_failed: ["rate<0.01"],   // < 1% failures
  },
};

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "serves HTML": (r) => String(r.headers["Content-Type"] || "").includes("text/html"),
  });

  // small think time between requests
  sleep(1);
}
