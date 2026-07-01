import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero and reaches an operational health check", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /schrute facts/i })).toBeVisible();

    await expect(page.getByText("All systems operational. As expected.")).toBeVisible({
      timeout: 15_000,
    });
  });
});
