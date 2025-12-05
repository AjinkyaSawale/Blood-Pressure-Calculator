import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 20 }, // ramp to moderate load
    { duration: "3m", target: 20 }, // hold for soak
    { duration: "30s", target: 0 }, // ramp down
  ],
};

export default function () {
  const res = http.get("http://127.0.0.1:5500/index.html");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "body contains calculator title": (r) =>
      r.body.includes("Blood Pressure Category Calculator"),
  });

  // Small pause to simulate real user pacing
  sleep(0.3);
}
