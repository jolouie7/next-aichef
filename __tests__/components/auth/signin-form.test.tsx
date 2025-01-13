import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

import SigninForm from "@/components/signin-form";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("SignInForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signin form", () => {
    render(<SigninForm />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByTestId("signin-button")).toBeInTheDocument();
  });

  it("successfully signs in", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    await user.click(screen.getByTestId("signin-button"));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
        callbackUrl: "/create-meal",
      });
    });

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: true,
        callbackUrl: "/create-meal",
      });
    });

    expect(signIn).toHaveBeenCalledTimes(2);
  });

  it("displays error when none of the fields are filled", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    await user.click(screen.getByTestId("signin-button"));

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    expect(emailInput.validationMessage).toBe("Constraints not satisfied");
  });

  it("displays error when credentials are invalid", async () => {
    const user = userEvent.setup();
    render(<SigninForm />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");

    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid email or password",
    });

    await user.click(screen.getByTestId("signin-button"));

    await waitFor(() => {
      expect(screen.getAllByText("Invalid email or password")).toHaveLength(2);
    });
  });
});
