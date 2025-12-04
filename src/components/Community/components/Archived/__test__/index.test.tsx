// Archived.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { VoteSectionType } from "@/components/VoteSection/type";
import { COMMUNITY_TYPE } from "@/constants/vote";
import useData from "@/hooks/useData";

import Archived from "../index";

// Mock the hooks and components that Archived depends on
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(), // Mock `useNavigate` with Vitest's vi.fn()
}));

vi.mock("@/hooks/useData", () => ({
  default: vi.fn(),
}));

vi.mock("@/components/VoteSection", () => ({
  default: ({ data }: { data: VoteSectionType }) => (
    <div>{data.proposalTitle}</div>
  ),
}));

describe("Archived Component", () => {
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock navigate function
    mockNavigate = vi.fn();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);

    (useData as vi.Mock).mockReturnValue({
      data: {
        data: [
          { proposalId: "1", proposalTitle: "Vote 1" },
          { proposalId: "2", proposalTitle: "Vote 2" },
        ],
      },
      isLoading: false,
    });
  });

  it("renders without crashing", () => {
    render(<Archived type={COMMUNITY_TYPE.CURRENT} scrollTop={0} />);

    expect(screen.getByText("Vote 1")).toBeInTheDocument();
    expect(screen.getByText("Vote 2")).toBeInTheDocument();
  });

  it('navigates to create poll page when "Create Poll" button is clicked', () => {
    render(<Archived type={COMMUNITY_TYPE.CURRENT} scrollTop={0} />);

    const button = screen.getByRole("button", { name: /Create Poll/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/create-poll", {
      state: {
        from: "/?tab=2&vote_tab=Community&community=1",
      },
    });
  });

  it("loads more sections when scrolled to the top", () => {
    (useData as vi.Mock)
      .mockReturnValueOnce({
        data: { data: [] }, // Initial load with no data
        isLoading: false,
      })
      .mockReturnValue({
        data: { data: [{ proposalId: "3", proposalTitle: "Vote 3" }] }, // Load more data
        isLoading: false,
      });

    render(<Archived type={COMMUNITY_TYPE.CURRENT} scrollTop={10} />);

    // Simulating scrolling to the top
    fireEvent.scroll(window, { target: { scrollY: 0 } });

    expect(screen.getByText("Vote 3")).toBeInTheDocument();
  });
});
