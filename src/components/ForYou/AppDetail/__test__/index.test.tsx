// AppDetail.test.tsx
import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

import { voteAppData } from "@/__mocks__/VoteApp";

import AppDetail from "../index";

const mockUpdateOpenAppClick = vi.fn();

describe("AppDetail Component", () => {
  it("renders correctly with initial collapsed view", () => {
    render(
      <AppDetail
        item={voteAppData}
        updateOpenAppClick={mockUpdateOpenAppClick}
      />
    );
    expect(screen.getByText("Tonalytics")).toBeInTheDocument();
    expect(screen.getByText("Follow 👉🏻 @tonalytics1")).toBeInTheDocument();
    const descriptionElement = screen.getByText(
      "Tonalities An innovative bot designed to analyze data and statistics of the TON (Telegram Open Network) cryptocurrency. With its help, users can receive detailed information about cryptocurrency exchange rates, trading volumes, price changes and other key indicators necessary for making informed decisions in the market.Thanks to Tonalities, any user can access TON cryptocurrency analytics and statistics in a convenient format directly in the messenger. The bot provides up-to-date information about the market situation, which makes it easier to track trends and help make informed decisions.Analytics has the functionality of analyzing graphs, visualizing data and creating reports, which allows users to conduct an in-depth analysis of the TON cryptocurrency market. The bot is becoming a useful tool for traders, investors and anyone who is interested in the price dynamics of cryptocurrencies and wants to be aware of all changes in the market."
    );
    expect(descriptionElement).toHaveStyle("opacity: 0");
  });

  it("expands description on click", () => {
    render(
      <AppDetail
        item={voteAppData}
        updateOpenAppClick={mockUpdateOpenAppClick}
      />
    );
    const container = screen.getByText("Tonalytics").closest("div");
    fireEvent.click(container!);
    expect(screen.getByText("Tonalytics")).toBeInTheDocument();
  });

  it("collapses when clicking outside", () => {
    render(
      <AppDetail
        item={voteAppData}
        updateOpenAppClick={mockUpdateOpenAppClick}
      />
    );
    const container = screen.getByText("Tonalytics").closest("div");
    fireEvent.click(container!);
    expect(screen.getByText("Tonalytics")).toBeInTheDocument();

    fireEvent.mouseDown(document);
    const descriptionElement = screen.getByText(
      "Tonalities An innovative bot designed to analyze data and statistics of the TON (Telegram Open Network) cryptocurrency. With its help, users can receive detailed information about cryptocurrency exchange rates, trading volumes, price changes and other key indicators necessary for making informed decisions in the market.Thanks to Tonalities, any user can access TON cryptocurrency analytics and statistics in a convenient format directly in the messenger. The bot provides up-to-date information about the market situation, which makes it easier to track trends and help make informed decisions.Analytics has the functionality of analyzing graphs, visualizing data and creating reports, which allows users to conduct an in-depth analysis of the TON cryptocurrency market. The bot is becoming a useful tool for traders, investors and anyone who is interested in the price dynamics of cryptocurrencies and wants to be aware of all changes in the market."
    );
    expect(descriptionElement).toHaveStyle("opacity: 0");
  });
});
