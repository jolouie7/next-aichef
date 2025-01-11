import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import SignupForm from "../../../components/signup-form";
import { signup } from "../../../server/actions/auth";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("../../../server/actions/auth", () => ({
  signup: jest.fn(() => Promise.resolve({ success: true })),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup form", () => {
    render(<SignupForm />);
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByTestId("signup-button")).toBeInTheDocument();
  });

  it("creates a new user and signs in with credentials when successful", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    (signup as jest.Mock).mockResolvedValueOnce({ success: true });
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    await user.click(screen.getByTestId("signup-button"));

    expect(signup).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    // Verify first signIn call to validate credentials
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
      callbackUrl: "/create-meal",
    });

    // Verify second signIn call with redirect after successful validation
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: true,
      callbackUrl: "/create-meal",
    });
  });

  it("shows validation errors for invalid email", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    await user.type(emailInput, "invalid-email");
    await user.click(screen.getByTestId("signup-button"));

    // Check the HTML validation message
    expect(emailInput.validationMessage).toContain("Constraints not satisfied");
  });

  it("should display error message when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");
    const passwordConfirmationInput =
      screen.getByPlaceholderText("confirm password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(passwordConfirmationInput, "password456");
    await user.click(screen.getByTestId("signup-button"));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it("handles signup failure", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    (signup as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: "Email already exists",
    });

    await user.click(screen.getByTestId("signup-button"));

    expect(screen.getByText("Email already exists")).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("handles signin failure after successful signup", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    (signup as jest.Mock).mockResolvedValueOnce({ success: true });
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Authentication failed",
    });

    await user.click(screen.getByTestId("signup-button"));

    expect(signIn).toHaveBeenCalledTimes(1);
  });
});
