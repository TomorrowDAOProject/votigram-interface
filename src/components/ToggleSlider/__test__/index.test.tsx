// ToggleSlider.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ToggleSlider from "../index";

import "@testing-library/jest-dom";

describe("ToggleSlider Component", () => {
  const items = ["Item 1", "Item 2", "Item 3"];

  it("renders all items correctly", () => {
    render(<ToggleSlider items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
