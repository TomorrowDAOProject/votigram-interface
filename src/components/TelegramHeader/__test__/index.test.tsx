// TelegramHeader.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import TelegramHeader from "../index";

import "@testing-library/jest-dom";

describe("TelegramHeader Component", () => {
  it("renders the title when title prop is provided", () => {
    const title = "Sample Title";
    render(<TelegramHeader title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("does not render a span when title prop is absent", () => {
    render(<TelegramHeader />);
    const spanElement = screen.queryByText("Sample Title");
    expect(spanElement).not.toBeInTheDocument();
  });

  it("applies the correct class names", () => {
    const title = "Sample Title";
    render(<TelegramHeader title={title} />);
    const titleElement = screen.getByText(title);
    expect(titleElement).toHaveClass(
      "font-outfit text-[18px] leading-[18px] font-bold"
    );
  });
});
