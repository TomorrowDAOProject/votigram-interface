import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import { TAB_LIST } from "@/constants/navigation";

import Navigation from "../index";

describe("Navigation Component", () => {
  const setup = (activeTab = TAB_LIST.HOME) => {
    const onMenuClick = vi.fn();
    render(<Navigation activeTab={activeTab} onMenuClick={onMenuClick} />);
    return onMenuClick;
  };

  it("renders the navigation component correctly", () => {
    setup();

    const homeIcon = screen.getByTestId("votigram-icon-navbar-home");
    const forYouIcon = screen.getByTestId("votigram-icon-navbar-for-you");
    const heartIcon = screen.getByTestId("votigram-icon-navbar-vote");
    const penIcon = screen.getByTestId("votigram-icon-navbar-task-profile");

    expect(homeIcon).toBeInTheDocument();
    expect(forYouIcon).toBeInTheDocument();
    expect(heartIcon).toBeInTheDocument();
    expect(penIcon).toBeInTheDocument();
  });

  it("positions the active tab indicator correctly", () => {
    setup(TAB_LIST.FOR_YOU); // Assume FOR YOU is active
    const indicator = screen.getByRole("presentation"); // Use a role that fits design

    expect(indicator).toHaveStyle("transform: translateX(70px)"); // FOR YOU should translate once
  });

  it("calls onMenuClick with the correct tab when a tab is clicked", () => {
    const onMenuClick = setup();

    const homeTab = screen.getByTestId("home-tab");
    fireEvent.click(homeTab);
    expect(onMenuClick).toHaveBeenCalledWith(TAB_LIST.HOME);

    const forYouTab = screen.getByTestId("for-you-tab");
    fireEvent.click(forYouTab);
    expect(onMenuClick).toHaveBeenCalledWith(TAB_LIST.FOR_YOU);

    const heartTab = screen.getByTestId("heart-tab");
    fireEvent.click(heartTab);
    expect(onMenuClick).toHaveBeenCalledWith(TAB_LIST.VOTE);

    const penTab = screen.getByTestId("pen-tab");
    fireEvent.click(penTab);
    expect(onMenuClick).toHaveBeenCalledWith(TAB_LIST.PEN);
  });
});
