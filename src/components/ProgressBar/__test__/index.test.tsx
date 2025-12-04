// ProgressBar.test.tsx
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import ProgressBar from "../index";

describe("ProgressBar Component", () => {
  it("renders with correct width and progress", () => {
    const { container } = render(<ProgressBar width={100} progress={75} />);

    // Check if the outer div has the correct progress width
    const progressBarOuter = container.firstChild as HTMLElement;
    expect(progressBarOuter).toBeInTheDocument();
    expect(progressBarOuter).toHaveStyle("width: 75%");

    // Check if the inner div has the correct width
    const progressBarInner = progressBarOuter.firstChild as HTMLElement;
    expect(progressBarInner).toHaveStyle("width: 100px");
  });

  it("applies custom class names", () => {
    const { container } = render(
      <ProgressBar
        width={100}
        progress={50}
        className="custom-class"
        barClassName="custom-bar"
      />
    );

    const progressBarOuter = container.firstChild as HTMLElement;
    expect(progressBarOuter).toHaveClass("custom-class");

    const progressBarInner = progressBarOuter.firstChild as HTMLElement;
    expect(progressBarInner).toHaveClass("custom-bar");
  });

  it("capped progress does not exceed 100%", () => {
    const { container } = render(<ProgressBar width={100} progress={150} />);

    const progressBarOuter = container.firstChild as HTMLElement;
    expect(progressBarOuter).toHaveStyle("width: 100%");
  });
});
