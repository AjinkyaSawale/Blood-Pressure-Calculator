import http from "k6/http";
import { check, sleep } from "k6";

// Basic load settings: 10 virtual users for 10 seconds
export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  const res = http.get("http://127.0.0.1:5500/index.html");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "page contains title": (r) =>
      r.body.includes("Blood Pressure Category Calculator"),
  });

  // Small think-time
  sleep(1);
}
