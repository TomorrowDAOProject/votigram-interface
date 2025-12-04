// FormItem.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import FormItem from "../index";

describe("FormItem Component", () => {
  it("renders the component with label and children", () => {
    render(
      <FormItem label="Test Label">
        <input type="text" data-testid="test-input" />
      </FormItem>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("displays the description if provided", () => {
    render(
      <FormItem label="Test Label" desc="This is a description.">
        <input type="text" />
      </FormItem>
    );

    expect(screen.getByText("This is a description.")).toBeInTheDocument();
  });

  it("displays the error text if provided", () => {
    render(
      <FormItem label="Test Label" errorText="This is an error.">
        <input type="text" />
      </FormItem>
    );

    expect(screen.getByText("*This is an error.")).toBeInTheDocument();
  });

  it("shows required asterisk when required is true", () => {
    render(
      <FormItem label="Test Label" required={true}>
        <input type="text" />
      </FormItem>
    );

    const labelElement = screen.getByText("Test Label");
    const asteriskElement = labelElement.closest("span")?.querySelector("span");
    expect(asteriskElement).toHaveTextContent("*");
  });

  it("applies custom className to container", () => {
    render(
      <FormItem label="Test Label" className="custom-class">
        <input type="text" />
      </FormItem>
    );

    // Directly query the root div by additional specificity if needed
    const container = screen.getByTestId("form-item-container");
    expect(container).toHaveClass("custom-class");
  });
});
