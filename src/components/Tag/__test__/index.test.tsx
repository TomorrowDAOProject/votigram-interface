// Tag.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import Tag from "../index";

describe("Tag Component", () => {
  it("renders with the provided text", () => {
    render(<Tag text="Sample Text" />);
    const textElement = screen.getByText("Sample Text");
    expect(textElement).toBeInTheDocument();
  });

  it("applies custom class names to container and text", () => {
    render(
      <Tag
        text="Sample Text"
        className="custom-class"
        textClassName="custom-text-class"
      />
    );

    const containerElement = screen.getByRole("img").parentElement;
    const textElement = screen.getByText("Sample Text");

    expect(containerElement).toHaveClass("custom-class");
    expect(textElement).toHaveClass("custom-text-class");
  });

  it("displays the image with correct src and alt attributes", () => {
    render(<Tag text="Sample Text" />);
    const imageElement = screen.getByAltText("Tag");
    expect(imageElement).toHaveAttribute(
      "src",
      "https://cdn.tmrwdao.com/votigram/assets/imgs/01259C70892E.webp"
    );
  });
});
