// DiscoveryHiddenGems.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import { voteAppData } from "@/__mocks__/VoteApp";

import DiscoveryHiddenGems from "../index";

// Mocking AppItem
vi.mock("../../AppItem", () => ({
  default: () => <div data-testid="app-item-mock" />,
}));

const mockUpdateOpenAppClick = vi.fn();

describe("DiscoveryHiddenGems Component", () => {
  it("renders the component with the correct text", () => {
    render(
      <DiscoveryHiddenGems
        onAppItemClick={mockUpdateOpenAppClick}
        item={voteAppData}
      />
    );
    expect(screen.getByText("Discover Hidden Gems!")).toBeInTheDocument();
  });

  it("renders the AppItem component", () => {
    render(
      <DiscoveryHiddenGems
        onAppItemClick={mockUpdateOpenAppClick}
        item={voteAppData}
      />
    );
    expect(screen.getByTestId("app-item-mock")).toBeInTheDocument();
  });
});
