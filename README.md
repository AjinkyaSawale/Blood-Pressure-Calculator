## Blood Pressure Category Calculator

A simple client-side application that calculates blood pressure based on systolic and diastolic inputs.  
The calculator supports multiple clinical measurements:

- **Blood Pressure Category**  
  (Low, Ideal, Elevated, High – based on systolic/diastolic ranges)
- **Pulse Pressure**  
  Calculated as:  
  `Pulse Pressure = Systolic − Diastolic`
- **Mean Arterial Pressure (MAP)**  
  A key measure of tissue perfusion, calculated using:  
  `MAP = (SBP + 2 × DBP) / 3`

These features are implemented in `app.js` and validated through multiple testing layers.

---

## Testing Strategy

This project uses **three major testing layers** to ensure correctness, behaviour, and user-level accuracy.

---

### **1. Unit Tests (Vitest)**

Location: `tests/unit/bp.test.js`  

Run:

```bash
### ** npm test **
Unit tests verify:
BP category classification
Pulse pressure calculation
MAP calculation
Boundary conditions
Error handling & invalid inputs
Vitest coverage is also enabled in the pipeline.

2. End-to-End (E2E) Tests
Location: e2e/bp.e2e.mjs
The E2E test:
Spins up a small local HTTP server
Opens the real UI in a Chromium browser
Enters systolic/diastolic values
Verifies the displayed category and calculations
Run:
npm run test:e2e
This confirms that the actual UI behaves correctly, not just the logic.

3. Behaviour-Driven Development (BDD)
Feature files: bdd/features/bp.feature
Step definitions: bdd/steps/bp.steps.js
BDD describes behaviour in user language, e.g.:
“Given I enter 140 and 90, then I should see High blood pressure.”
Run:
npm run test:bdd
BDD sits above unit tests and gives a business-level validation layer.

CI/CD Pipeline (GitHub Actions)
A full CI pipeline is configured in:
.github/workflows/ci.yml
It runs automatically on every push to main or develop.
The pipeline performs:
Install dependencies
npm ci
Static code analysis (ESLint)
npm run lint
Unit tests + coverage
npm test
BDD tests (Cucumber.js)
npm run test:bdd
E2E tests
npm run test:e2e
Security audit (High severity+)
npm run audit
Performance test step
Uses Autocannon to run a quick load test against the running HTTP server.
This ensures that code quality, behaviour, security, and performance are validated before merging improvements.


How to Run Locally
Install dependencies:
npm install
Run linter:
npm run lint
Run unit tests:
npm test
Run BDD scenarios:
npm run test:bdd
Run E2E tests:
npm run test:e2e

## Telemetry & Monitoring

This application includes a lightweight telemetry layer to track how the calculator is used.

- Telemetry module: `telemetry.js`
- Main function: `recordEvent(name, payload)`
- Storage:
  - Events are stored in `localStorage` under the key `bp_telemetry_events`.
  - Each event has the shape:

    ```json
    {
      "name": "bp_calculated",
      "payload": {
        "systolic": 120,
        "diastolic": 80,
        "category": "Elevated",
        "pulsePressure": 40,
        "widePulse": false,
        "map": 93.3
      },
      "timestamp": "2025-12-05T15:21:04.150Z"
    }
    ```

- When telemetry is triggered:
  - On successful BP calculation in the UI, the app calls `recordEvent("bp_calculated", {...})` with:
    - systolic / diastolic
    - calculated category
    - pulse pressure + wide flag
    - MAP value

- Safety behaviour:
  - If `localStorage` is unavailable (e.g. strict browser/privacy settings), `recordEvent` **fails silently** and logs to the console instead of breaking the UI.

- Tests:
  - `tests/unit/telemetry.test.js` verifies:
    - Events are correctly written to `localStorage`.
    - `recordEvent` never throws even when `localStorage` is not available.
  - `tests/ui/ui.test.js` confirms that a `bp_calculated` telemetry event is generated when the user submits valid values in the real UI.

