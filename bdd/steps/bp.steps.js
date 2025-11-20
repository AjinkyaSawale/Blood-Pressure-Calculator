import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { chromium } from "playwright";

Before(async function () {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
});

After(async function () {
  await this.page.close();
  await this.browser.close();
});

// -------------------------------
// Step Definitions
// -------------------------------

Given("I open the Blood Pressure Calculator", async function () {
  await this.page.goto("http://localhost:5500/index.html");
});

When(
  "I enter systolic {string} and diastolic {string}",
  async function (sys, dia) {
    await this.page.fill("#sys", sys);
    await this.page.fill("#dia", dia);
  }
);

When("I click calculate", async function () {
  await this.page.click("#calc-btn");
});

Then("I should see {string}", async function (text) {
  const content = await this.page.textContent("#result");
  if (!content.includes(text)) {
    throw new Error(`Expected text "${text}" not found. Got: ${content}`);
  }
});

