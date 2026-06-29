import { expect, test } from "@playwright/test";

const uniqueText = () => `E2E duty ${Date.now()}`;

test.describe("todos CRUD", () => {
  test("create, complete, and delete a todo", async ({ page }) => {
    await page.goto("/todos");

    const text = uniqueText();

    await page.getByPlaceholder("Assign a new duty…").fill(text);
    await page.getByRole("button", { name: "Assign" }).click();

    const item = page.locator("li", { hasText: text });
    await expect(item).toBeVisible({ timeout: 10_000 });

    // Toggle complete via the row's checkbox, expect it to become checked.
    const checkbox = item.getByRole("checkbox");
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Delete the row and confirm it disappears.
    await item.getByRole("button", { name: "Delete duty" }).click();
    await expect(item).toHaveCount(0);
  });
});
