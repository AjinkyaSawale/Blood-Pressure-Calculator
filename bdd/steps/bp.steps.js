import { Given, When, Then } from "@cucumber/cucumber";
import { chromium } from "playwright";

Given("I open the blood pressure calculator", async function () {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
  await this.page.goto("http://127.0.0.1:5500/index.html");
});

When("I enter systolic {string} and diastolic {string}", async function (sys, dia) {
  await this.page.fill("#sys", sys);
  await this.page.fill("#dia", dia);
});

When("I press calculate", async function () {
  await this.page.click("button[type=submit]");
  await this.page.waitForTimeout(300);
});

Then("I should see {string}", async function (text) {
  const content = await this.page.content();
  if (!content.includes(text)) {
    throw new Error(`Expected text "${text}" not found.`);
  }
});

Then("I should see {string}", async function (text) {
  const content = await this.page.content();
  if (!content.includes(text)) {
    throw new Error(`Expected text "${text}" not found.`);
  }
});
