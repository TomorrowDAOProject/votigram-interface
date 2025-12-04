
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";


import { voteAppListData } from "@/__mocks__/VoteApp";
import { useAdsgram } from "@/hooks/useAdsgram";
import { VoteApp } from "@/types/app";

import SearchPanel from "../index";


// Mock the `useAdsgram` hook
vi.mock("@/hooks/useAdsgram", () => ({
  useAdsgram: vi.fn(),
}));

// Mock the `AppItem` component
vi.mock("../../AppItem", () => ({
  default: ({
    item,
    onAppItemClick,
  }: {
    item: VoteApp;
    onAppItemClick: (item: VoteApp) => void;
  }) => (
    <div
      data-testid={`app-item-${item.id}`}
      onClick={() => onAppItemClick(item)}
    >
      {item.title}
    </div>
  ),
}));

describe("SearchPanel Component", () => {
  const mockShowAd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAdsgram as vi.Mock).mockReturnValue(mockShowAd);
  });

  it("renders the ad image and triggers showAd when clicked", () => {
    render(
      <SearchPanel
        recommendList={[]}
        updateUserPoints={vi.fn()}
        onAppItemClick={vi.fn()}
      />
    );

    const adImage = screen.getByRole("img");
    expect(adImage).toBeInTheDocument();

    fireEvent.click(adImage);

    // Ensure `showAd` from `useAdsgram` is called
    expect(mockShowAd).toHaveBeenCalledTimes(1);
  });

  it("renders the recommendList as AppItems", () => {
    const { container } = render(
      <SearchPanel
        recommendList={voteAppListData}
        updateUserPoints={vi.fn()}
        onAppItemClick={vi.fn()}
      />
    );

    // Check that AppItems are rendered
    const appItems = container.querySelectorAll("[data-testid^='app-item-']");
    expect(appItems).toHaveLength(voteAppListData.length);

    // Check that titles are correct
    expect(screen.getByText("Opus Freelance")).toBeInTheDocument();
    expect(screen.getByText("@Call")).toBeInTheDocument();
  });

  it("renders 'No Results' when recommendList is empty", () => {
    render(
      <SearchPanel
        recommendList={[]}
        updateUserPoints={vi.fn()}
        onAppItemClick={vi.fn()}
      />
    );

    // Check that "No Results" message is shown
    expect(screen.getByText("No Results")).toBeInTheDocument();
  });

  it("triggers onAppItemClick when an AppItem is clicked", () => {
    const mockOnAppItemClick = vi.fn();

    render(
      <SearchPanel
        recommendList={voteAppListData}
        updateUserPoints={vi.fn()}
        onAppItemClick={mockOnAppItemClick}
      />
    );

    // Click on the AppItem
    const appItem = screen.getByTestId(
      "app-item-5e5cf28d6bab811b13530801ea779876defec18d2bd177fffa5dfb82f14c9bbf"
    );
    fireEvent.click(appItem);

    // Check that `onAppItemClick` was called with the correct item
    expect(mockOnAppItemClick).toHaveBeenCalled();
  });

  it("passes updateUserPoints to useAdsgram", () => {
    const mockUpdateUserPoints = vi.fn();

    render(
      <SearchPanel
        recommendList={[]}
        updateUserPoints={mockUpdateUserPoints}
        onAppItemClick={vi.fn()}
      />
    );

    // Ensure `useAdsgram` was called with the correct arguments
    expect(useAdsgram).toHaveBeenCalledWith(
      expect.objectContaining({
        blockId: expect.any(String),
        onReward: mockUpdateUserPoints, // Ensure the reward callback is passed
      })
    );
  });
});
