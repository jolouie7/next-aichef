import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

import { MainNav } from "@/components/main-nav";

const mockUnauthenticatedUser = {
  data: null,
  status: "unauthenticated",
} as const;

const mockAuthenticatedUser = {
  data: {
    user: {
      email: "jest@example.com",
      profilePicture: "",
    },
  },
  status: "authenticated",
} as const;

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => mockUnauthenticatedUser),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("MainNav", () => {
  it("renders a main navbar when not signed in", () => {
    (useSession as jest.Mock).mockReturnValue(mockUnauthenticatedUser);

    render(<MainNav />);

    const logo = screen.getByText("AI Chef");
    const createMealLink = screen.getByText("Create Meal");
    const myMealsLink = screen.getByText("My Meals");
    const signInButton = screen.getByText("Sign In");

    expect(logo).toBeInTheDocument();
    expect(createMealLink).toBeInTheDocument();
    expect(myMealsLink).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });
  it("renders a main navbar with someone signed in with no profile picture", () => {
    (useSession as jest.Mock).mockReturnValue(mockAuthenticatedUser);

    render(<MainNav />);

    const logo = screen.getByText("AI Chef");
    const createMealLink = screen.getByText("Create Meal");
    const myMealsLink = screen.getByText("My Meals");
    const userInitial = screen.getByText("j");

    expect(logo).toBeInTheDocument();
    expect(createMealLink).toBeInTheDocument();
    expect(myMealsLink).toBeInTheDocument();
    expect(userInitial).toBeInTheDocument();
  });

  it("renders a main navbar with someone signed in and shows dropdown menu on click", async () => {
    render(<MainNav />);
    const user = userEvent.setup();

    const logo = screen.getByText("AI Chef");
    const createMealLink = screen.getByText("Create Meal");
    const myMealsLink = screen.getByText("My Meals");
    const userInitial = screen.getByText("j");

    expect(logo).toBeInTheDocument();
    expect(createMealLink).toBeInTheDocument();
    expect(myMealsLink).toBeInTheDocument();
    expect(userInitial).toBeInTheDocument();

    await user.click(userInitial);

    const userEmail = screen.getByText("jest@example.com");
    const logoutButton = screen.getByText("Sign Out");

    expect(userEmail).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });
});
