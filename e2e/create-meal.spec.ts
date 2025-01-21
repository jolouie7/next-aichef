import { expect, test } from "@playwright/test";

test("should be able to create a new meal", async ({ page }) => {
  test.setTimeout(60000);

  // Mock API responses
  await page.route("**/*", async (route) => {
    const url = route.request().url();

    // Mock meal results response
    if (url.includes("/api/meal-results")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          meals: [
            {
              title: "Egg and Ham Rice Casserole",
              description: "A delicious casserole made with rice, eggs and ham",
            },
            {
              title: "Grilled Chicken Caesar Salad",
              description:
                "Fresh romaine lettuce topped with grilled chicken breast, parmesan cheese, and homemade caesar dressing",
            },
            {
              title: "Spaghetti Bolognese",
              description:
                "Classic Italian pasta dish with rich meat sauce, fresh herbs and parmesan cheese",
            },
            {
              title: "Teriyaki Salmon Bowl",
              description:
                "Pan-seared salmon glazed with teriyaki sauce served over rice with steamed vegetables",
            },
            {
              title: "Black Bean and Sweet Potato Tacos",
              description:
                "Vegetarian tacos filled with seasoned black beans, roasted sweet potatoes, and fresh toppings",
            },
          ],
        }),
      });
      return;
    }

    // Mock meal detail response
    if (url.includes("/api/meal-detail")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          title: "Egg and Ham Rice Casserole",
          description: "A delicious casserole made with rice, eggs and ham",
          mealPicture:
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          ingredients: ["rice", "egg", "ham"],
          instructions: [
            "Preheat oven to 350°F",
            "Cook rice according to package directions",
            "Mix eggs and ham with cooked rice",
            "Transfer to baking dish and bake for 30 minutes",
          ],
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: "Start Cooking!" }).click();
  await page.getByPlaceholder("email").click();
  await page.getByPlaceholder("email").fill("j@gmail.com");
  await page.getByPlaceholder("password").click();
  await page.getByPlaceholder("password").fill("testpass123");
  await page.getByTestId("signin-button").click();
  await page.getByText("Select Meal Time").click();
  await page.getByRole("option", { name: "Lunch" }).click();
  await page.getByPlaceholder("Add Ingredient").click();
  await page.getByPlaceholder("Add Ingredient").fill("rice");
  await page.getByPlaceholder("Add Ingredient").press("Enter");
  await page.getByPlaceholder("Add Ingredient").fill("egg");
  await page.getByPlaceholder("Add Ingredient").press("Enter");
  await page.getByPlaceholder("Add Ingredient").fill("ham");
  await page.getByPlaceholder("Add Ingredient").press("Enter");
  await page
    .getByRole("row", { name: "rice" })
    .getByTestId("trash-icon")
    .click();
  await page.getByPlaceholder("Add Ingredient").click();
  await page.getByPlaceholder("Add Ingredient").fill("rice");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("**/meal-results");
  await expect(
    page.getByRole("heading", { name: "Pick a Meal" }),
  ).toBeVisible();

  const mealTitle = page.getByText("Egg and Ham Rice Casserole").first();
  await mealTitle.click();

  await page.waitForURL("**/meal-results");
  await expect(page.getByText("Egg and Ham Rice Casserole")).toBeVisible();
});
