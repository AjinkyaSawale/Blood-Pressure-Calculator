
import http from "k6/http";
import { sleep, check } from "k6";

const BASE_URL = "http://127.0.0.1:5500/index.html";

// Spike Test: sudden traffic surge
export const options = {
  stages: [
    { duration: "10s", target: 5 },    // small warm-up
    { duration: "5s", target: 200 },   // sudden spike
    { duration: "10s", target: 200 },  // hold spike
    { duration: "10s", target: 10 },   // rapid drop
    { duration: "10s", target: 0 },    // cooldown
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // system should survive spike
    http_req_failed: ["rate<0.05"],   // up to 5% failures acceptable in spike
  }
};

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
