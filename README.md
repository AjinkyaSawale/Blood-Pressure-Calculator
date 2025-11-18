# Blood Pressure Category Calculator 

A simple client-side application that calculates blood pressure on the basis of systolic and diastolic inputs. It also includes a **pulse pressure** feature and has been tested using **Vitest** enabled.

## Testing Strategy

This project uses three layers of automated tests:

1. **Unit tests (Vitest)**  
   - Location: `tests/unit/bp.test.js`  
   - Command:  
     ```bash
     npm test
     ```
   - Purpose: Validates the BP classification logic, pulse pressure calculation, and input validation rules.

2. **End-to-End (E2E) tests**  
   - Location: `e2e/bp.e2e.mjs`  
   - The tests start a lightweight HTTP server, open the real browser page, enter values, and assert the UI result.  
   - Command:  
     ```bash
     npm run test:e2e
     ```

3. **BDD layer (Behaviour-Driven Development)**  
   - Feature files: `bdd/features/bp.feature`  
   - Step definitions: `bdd/steps/bp.steps.js`  
   - These scenarios describe the blood pressure calculator from a user point of view (e.g. *“Given I enter 140/90, then I see Elevated blood pressure”*).  
   - The BDD files are also stored in Git to demonstrate how feature-level scenarios can be linked to the CI/CD pipeline and CA report, even if they are run less frequently than unit/E2E tests.
