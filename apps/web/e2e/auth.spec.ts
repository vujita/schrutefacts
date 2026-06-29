import { expect, test } from "@playwright/test";

const uniqueEmail = () => `e2e+${Date.now()}@example.com`;

test.describe("auth", () => {
  test("sign up redirects to the dashboard with private data", async ({ page }) => {
    const name = `E2e ${Date.now() % 100_000}`;
    const email = uniqueEmail();

    await page.goto("/login");

    // The login page defaults to the sign-up form.
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("test1234");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await page.waitForURL("**/dashboard", { timeout: 15_000 });

    await expect(page.getByText(new RegExp(`welcome, ${name}`, "i"))).toBeVisible();

    await expect(page.getByText("Classified Intel")).toBeVisible();
    await expect(page.getByText("This is private")).toBeVisible();
  });
});
