import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 20 },  // Ramp-up to 20 VUs
    { duration: "10s", target: 50 },  // Spike to 50 VUs (stress)
    { duration: "10s", target: 0 },   // Ramp-down
  ],
};

export default function () {
  const url = "http://127.0.0.1:5500/app.js"; // static JS file fetch

  const res = http.get(url);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(0.2);
}
