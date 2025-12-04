import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { voteAppListData } from "@/__mocks__/VoteApp";

import AppList from "../index";

const onAppItemClick = vi.fn();

describe("AppList Component", () => {
  it("renders the title correctly", () => {
    render(
      <AppList
        title="Top Apps"
        onAppItemClick={onAppItemClick}
        items={voteAppListData}
      />
    );

    const titleElement = screen.getByText(/Top Apps/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the correct number of AppItem components", () => {
    render(
      <AppList
        title="Top Apps"
        onAppItemClick={onAppItemClick}
        items={voteAppListData}
      />
    );

    const appItems = screen.getAllByRole("img"); // Assuming AppItem has an image role
    expect(appItems).toHaveLength(voteAppListData.length);
  });

  it("renders AppItems with the arrow icon", () => {
    render(
      <AppList
        title="Top Apps"
        onAppItemClick={onAppItemClick}
        items={voteAppListData}
      />
    );

    voteAppListData.forEach((_, index) => {
      const arrowIcons = screen.getAllByTestId("arrow-icon");
      expect(arrowIcons[index]).toBeInTheDocument();
    });
  });
});
