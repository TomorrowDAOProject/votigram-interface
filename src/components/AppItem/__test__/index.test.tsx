import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { voteAppData } from "@/__mocks__/VoteApp";

import AppItem from "../index";

const mockUpdateOpenAppClick = vi.fn();

describe("AppItem Component", () => {
  it("renders with default props correctly", () => {
    render(
      <AppItem onAppItemClick={mockUpdateOpenAppClick} item={voteAppData} />
    );

    // Check that the image is rendered
    const imageElement = screen.getByTestId("app-item-icon");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute(
      "src",
      "https://tmrwdao-arcade.s3.amazonaws.com/votigram/test/asset/img/64284af5e2e8c048758b8985f20446181165ba51f229fdf0a3e5e17c6543106d.webp"
    );

    // Check that the title and description are rendered
    expect(screen.getByText("Tonalytics")).toBeInTheDocument();
    expect(screen.getByText(/Follow 👉🏻 @tonalytics1/i)).toBeInTheDocument();

    // Check that the arrow is not rendered
    const arrowIcon = screen.queryByTestId("arrow-icon");
    expect(arrowIcon).not.toBeInTheDocument();
  });

  it("renders the arrow icon when showArrow is true", () => {
    render(
      <AppItem
        showArrow
        onAppItemClick={mockUpdateOpenAppClick}
        item={voteAppData}
      />
    );

    const arrowIcon = screen.getByTestId("arrow-icon");
    expect(arrowIcon).toBeInTheDocument();
  });

  it("should catch the onclick function", () => {
    render(
      <AppItem
        showArrow
        onAppItemClick={mockUpdateOpenAppClick}
        item={voteAppData}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockUpdateOpenAppClick).toHaveBeenCalledWith(voteAppData);
  });
});
