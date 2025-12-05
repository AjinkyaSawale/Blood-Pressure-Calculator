import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "2s", target: 1 },   // normal
    { duration: "3s", target: 50 },  // sudden spike
    { duration: "2s", target: 1 },   // recovery
  ],
};

export default function () {
  const res = http.get("http://127.0.0.1:5500/index.html");

  // simple check: did the page load?
  if (res.status !== 200) {
    console.error("Page failed with status:", res.status);
  }

  sleep(0.2);
}
