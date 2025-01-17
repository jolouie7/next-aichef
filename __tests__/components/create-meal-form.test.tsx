import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateMealForm from "../../components/create-meal-form";

import { MealsProvider } from "@/lib/meals-context";

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ meals: [] }),
  }),
) as jest.Mock;

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
Element.prototype.scrollIntoView = jest.fn();

const mockToast = jest.fn();
jest.mock("../../hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("CreateMealForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the CreateMealForm component", () => {
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const mealTimeDropdown = screen.getByText("Select Meal Time");
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const addButton = screen.getByText("Add");
    const clearButton = screen.getByText("Clear");
    const ingredientsList = screen.getByRole("heading", {
      level: 3,
      name: "Ingredients",
    });

    expect(mealTimeDropdown).toBeInTheDocument();
    expect(ingredientInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
    expect(ingredientsList).toBeInTheDocument();
  });

  it("renders the meal time dropdown and selects breakfast", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );

    const mealTimeButton = screen.getByText("Select Meal Time");

    await user.click(mealTimeButton);

    await waitFor(() => {
      expect(screen.getByText("Breakfast")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Breakfast"));
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  it("submits form and navigates to meal results", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const mealTimeButton = screen.getByText("Select Meal Time");
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const submitButton = screen.getByText("Submit");

    // Select meal time
    await user.click(mealTimeButton);
    await waitFor(() => {
      expect(screen.getByText("Breakfast")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Breakfast"));

    // Add ingredients
    await user.type(ingredientInput, "Chicken");
    await user.click(screen.getByText("Add"));
    await user.type(ingredientInput, "Pasta");
    await user.click(screen.getByText("Add"));
    await user.type(ingredientInput, "Tomato");
    await user.click(screen.getByText("Add"));

    await user.click(submitButton);

    // Verify ingredients were added correctly
    const ingredientsTable = screen.getByRole("table");
    expect(ingredientsTable).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();

    // Verify form submission and navigation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith("/meal-results");
    });
  });

  it("failed to create a meal because meal time is not selected", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const submitButton = screen.getByText("Submit");

    await user.type(ingredientInput, "Chicken");
    await user.click(screen.getByText("Add"));
    await user.type(ingredientInput, "Pasta");
    await user.click(screen.getByText("Add"));
    await user.type(ingredientInput, "Tomato");
    await user.click(screen.getByText("Add"));

    await user.click(submitButton);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Please select a mealtime and add at least one ingredient",
      variant: "destructive",
    });
  });

  it("failed to create a meal because no ingredients are added", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const mealTimeButton = screen.getByText("Select Meal Time");
    const submitButton = screen.getByText("Submit");

    await user.click(mealTimeButton);
    await waitFor(() => {
      expect(screen.getByText("Breakfast")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Breakfast"));

    await user.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Please select a mealtime and add at least one ingredient",
      variant: "destructive",
    });
  });

  it("add ingredient using keyboard enter key instead of add button", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const mealTimeButton = screen.getByText("Select Meal Time");
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const submitButton = screen.getByText("Submit");

    // Select meal time
    await user.click(mealTimeButton);
    await waitFor(() => {
      expect(screen.getByText("Breakfast")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Breakfast"));

    // Add ingredients
    await user.type(ingredientInput, "Chicken");
    await user.keyboard("{Enter}");
    await user.type(ingredientInput, "Pasta");
    await user.keyboard("{Enter}");
    await user.type(ingredientInput, "Tomato");
    await user.keyboard("{Enter}");

    await user.click(submitButton);

    // Verify ingredients were added correctly
    const ingredientsTable = screen.getByRole("table");
    expect(ingredientsTable).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();

    // Verify form submission and navigation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith("/meal-results");
    });
  });

  it("delete ingredient", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );

    // Add ingredients
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const ingredientsTable = screen.getByRole("table");

    await user.type(ingredientInput, "Chicken");
    await user.keyboard("{Enter}");

    // Delete ingredient
    expect(ingredientsTable).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    await user.click(screen.getByTestId("trash-icon"));
    expect(screen.queryByText("Chicken")).not.toBeInTheDocument();
  });

  it("clear ingredients", async () => {
    const user = userEvent.setup();
    render(
      <MealsProvider>
        <CreateMealForm />
      </MealsProvider>,
    );
    const ingredientInput = screen.getByPlaceholderText("Add Ingredient");
    const clearButton = screen.getByText("Clear");
    const ingredientsTable = screen.getByRole("table");

    // Add ingredients
    await user.type(ingredientInput, "Chicken");
    await user.keyboard("{Enter}");
    await user.type(ingredientInput, "Pasta");
    await user.keyboard("{Enter}");
    await user.type(ingredientInput, "Tomato");
    await user.keyboard("{Enter}");

    // Verify ingredients were added correctly
    expect(ingredientsTable).toBeInTheDocument();
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Tomato")).toBeInTheDocument();

    await user.click(clearButton);

    // Verify ingredients were cleared correctly
    expect(ingredientsTable).toBeInTheDocument();
    expect(screen.queryByText("Chicken")).not.toBeInTheDocument();
    expect(screen.queryByText("Pasta")).not.toBeInTheDocument();
    expect(screen.queryByText("Tomato")).not.toBeInTheDocument();
  });
});
