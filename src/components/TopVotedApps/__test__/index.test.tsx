import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import { voteAppListData } from "@/__mocks__/VoteApp";

import TopVotedApps from "../index";

const mockOnAppItemClick = vi.fn();

describe("TopVotedApps Component", () => {
  it("renders the title", () => {
    render(
      <TopVotedApps
        onAppItemClick={mockOnAppItemClick}
        items={voteAppListData}
      />
    );
    const titleElement = screen.getByText(/Weekly Top Voted Apps/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the correct number of items", () => {
    render(
      <TopVotedApps
        onAppItemClick={mockOnAppItemClick}
        items={voteAppListData}
      />
    );
    const items = screen.getAllByRole("img");
    expect(items).toHaveLength(voteAppListData.length);
  });

  it("displays the correct image and points for each app", () => {
    render(
      <TopVotedApps
        onAppItemClick={mockOnAppItemClick}
        items={voteAppListData}
      />
    );
    voteAppListData.forEach((item) => {
      const image = screen.getByAltText(item.title || "");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", item.icon);

      const points = screen.getByTestId(`${item.title}-point`);
      expect(points.innerHTML).toBe((item.pointsAmount || 0).toLocaleString());
    });
  });
});
