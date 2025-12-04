// Loading.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Loading from "../index"; // Adjust the import to your file structure

import "@testing-library/jest-dom";

describe("Loading Component", () => {
  it("renders the spinner and container with default classes", () => {
    render(<Loading />);
    const container = screen.getByTestId("loading-testid");
    const spinner = container.querySelector("div.animate-spin");

    // Check if the container has the default class
    expect(container).toHaveClass(
      "flex justify-center items-center bg-black/40"
    );

    // Check if the spinner has the default animation and styles
    expect(spinner).toHaveClass(
      "animate-spin rounded-[50%] h-8 w-8 border-t-2 border-b-2 border-primary"
    );
  });

  it("applies additional className to the container", () => {
    render(<Loading className="custom-container-class" />);
    const container = screen.getByTestId("loading-testid");
    expect(container).toHaveClass("custom-container-class");
  });

  it("applies additional iconClassName to the spinner", () => {
    render(<Loading iconClassName="custom-icon-class" />);
    const spinner = screen.getByTestId("loading-icon-testid");

    expect(spinner).toHaveClass("custom-icon-class");
  });

  it("renders correctly when both className and iconClassName are provided", () => {
    render(
      <Loading
        className="custom-container-class"
        iconClassName="custom-icon-class"
      />
    );

    const container = screen.getByTestId("loading-testid");
    const spinner = container.querySelector("div.animate-spin");

    // Check container class
    expect(container).toHaveClass("custom-container-class");

    // Check spinner class
    expect(spinner).toHaveClass("custom-icon-class");
  });
});
