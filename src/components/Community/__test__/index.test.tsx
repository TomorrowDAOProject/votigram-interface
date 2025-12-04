// Community.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import { IToggleSlider } from "@/components/ToggleSlider/type";
import { COMMUNITY_TYPE } from "@/constants/vote";

import Community from "../index";

vi.mock("../ToggleSlider", () => ({
  default: ({
    items,
    current,
    onChange,
    className,
    activeItemClassName,
    itemClassName,
  }: IToggleSlider) => (
    <div className={className}>
      {items.map((item: string, index: number) => (
        <div
          key={index}
          className={current === index ? activeItemClassName : itemClassName}
          onClick={() => onChange?.(index)}
        >
          {item}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./components/Archived", () => ({
  default: ({ type }: { type: COMMUNITY_TYPE }) => (
    <div data-testid="archived-component">
      {type === COMMUNITY_TYPE.CURRENT && (
        <button onClick={() => {}}>Create Poll</button>
      )}
    </div>
  ),
}));

describe("Community Component", () => {
  it("renders the component with ToggleSlider and Archived", () => {
    render(
      <MemoryRouter>
        <Community scrollTop={0} />
      </MemoryRouter>
    );

    // Ensure ToggleSlider items are rendered
    expect(screen.getByText("Archived")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();

    // Ensure Archived component renders the button when type is CURRENT
    expect(screen.queryByText("Create Poll")).toBeInTheDocument();
  });

  it("switches between tabs correctly and updates Archived component", () => {
    render(
      <MemoryRouter>
        <Community scrollTop={0} />
      </MemoryRouter>
    );

    // Click on "Archived" tab
    fireEvent.click(screen.getByText("Archived"));

    // Button should not be present if type is not CURRENT
    expect(screen.queryByText("Create Poll")).not.toBeInTheDocument();

    // Click on "Current" tab
    fireEvent.click(screen.getByText("Current"));

    // Button should be present if type is CURRENT
    expect(screen.queryByText("Create Poll")).toBeInTheDocument();
  });
});
