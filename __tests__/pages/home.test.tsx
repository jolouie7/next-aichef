import { render, screen } from "@testing-library/react";

import Home from "../../app/page";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1, name: "AI Chef" });

    expect(heading).toBeInTheDocument();
  });

  it("renders a button", () => {
    render(<Home />);

    const button = screen.getByRole("button", { name: "Start Cooking!" });

    expect(button).toBeInTheDocument();
  });
});
