import { render, screen } from "@testing-library/react";

import CreateMealPage from "../../app/create-meal/page";

import { MealsProvider } from "@/lib/meals-context";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => "/create-meal",
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { email: "test@example.com" } },
    status: "authenticated",
  }),
}));

describe("CreateMeal", () => {
  it("renders the CreateMeal page", () => {
    render(
      <MealsProvider>
        <CreateMealPage />
      </MealsProvider>,
    );
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Create Meal",
    });
    const mealTimeDropdown = screen.getByText("Select Meal Time");
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const addButton = screen.getByText("Add");
    const clearButton = screen.getByText("Clear");
    const ingredientsList = screen.getByRole("heading", {
      level: 3,
      name: "Ingredients",
    });

    expect(heading).toBeInTheDocument();
    expect(mealTimeDropdown).toBeInTheDocument();
    expect(ingredientInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
    expect(ingredientsList).toBeInTheDocument();
  });
});
