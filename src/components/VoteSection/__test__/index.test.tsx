import { render, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

import { voteSection } from "@/__mocks__/VoteApp";

import VoteSection from "../index"; // Adjust the path to your component

import "@testing-library/jest-dom";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

describe("VoteSection Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  it("renders correctly with all data", () => {
    render(<VoteSection data={voteSection[0]} />);

    // Verify the proposal title
    expect(screen.getByText("Increase Community Fund")).toBeInTheDocument();

    // Verify the duration
    expect(
      screen.getByText("Duration: 20 Dec 2024 - 30 Dec 2024")
    ).toBeInTheDocument();

    // Verify the total vote count
    expect(screen.getByText("1,250")).toBeInTheDocument();

    // Verify the banner image
    const bannerImage = screen.getByAltText("Banner");
    expect(bannerImage).toBeInTheDocument();
    expect(bannerImage).toHaveAttribute("src", voteSection[0].bannerUrl);

    // Verify the proposal icon
    const proposalIcon = screen.getByAltText("Avatar");
    expect(proposalIcon).toBeInTheDocument();
    expect(proposalIcon).toHaveAttribute("src", voteSection[0].proposalIcon);

    // Verify the tag
    expect(screen.getByText("Trending")).toBeInTheDocument();

    // Verify the "Created by" text
    expect(screen.getByText("Created by Alice")).toBeInTheDocument();
  });
});
