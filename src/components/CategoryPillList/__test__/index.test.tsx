import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import { DISCOVER_CATEGORY } from "@/constants/discover";

import CategoryPillList from "../index";

describe("CategoryPillList Component", () => {
  it("renders the correct number of categories", () => {
    render(<CategoryPillList items={DISCOVER_CATEGORY} />);

    const categoryButtons = screen.getAllByRole("button");
    expect(categoryButtons).toHaveLength(DISCOVER_CATEGORY.length); // Ensure length matches mocked categories
  });

  it("renders each category with the correct label", () => {
    render(<CategoryPillList items={DISCOVER_CATEGORY} />);

    const labels = DISCOVER_CATEGORY.map((item) => item.label);
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
