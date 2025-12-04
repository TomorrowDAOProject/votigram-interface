import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";


import DailyRewards, {
  getLastConsecutiveTrueLength, // Option 1: Export and import the helper function
} from "../index";

// Mock DAILY_REWARDS for testing
vi.mock("@/constants/discover", () => {
  const mockDAILY_REWARDS = [10, 20, 30, 40, 50, 60, 70];
  return {
    DAILY_REWARDS: mockDAILY_REWARDS,
  };
});

vi.mock("@/provider/types/UserProviderType", () => ({
  UserPoints: {
    dailyPointsClaimedStatus: [true, true, false, false, false, false],
  },
}));

describe("DailyRewards Component", () => {
  const mockDAILY_REWARDS = [10, 20, 30, 40, 50, 60, 70];
  it("renders the component with the correct number of rewards", () => {
    render(
      <DailyRewards
        userPoints={{
          consecutiveLoginDays: 0,
          dailyLoginPointsStatus: false,
          dailyPointsClaimedStatus: [],
          userTotalPoints: 0,
        }}
      />
    );
    // Confirm title and subtitle render correctly
    expect(screen.getByText("Daily Rewards")).toBeInTheDocument();
    expect(
      screen.getByText("Log in everyday to earn extra points!")
    ).toBeInTheDocument();

    // Confirm the correct number of rewards are rendered
    const rewardItems = screen.getAllByText(/Day \d+/);
    expect(rewardItems).toHaveLength(mockDAILY_REWARDS.length);
  });

  it("displays claimed rewards with a tick icon", () => {
    const { container } = render(
      <DailyRewards
        userPoints={{
          consecutiveLoginDays: 0,
          dailyLoginPointsStatus: false,
          userTotalPoints: 0,
          dailyPointsClaimedStatus: [true, true, false, false, false, false],
        }}
      />
    );

    // Get claimed rewards (shows tick icon)
    const tickIcons = container.querySelectorAll(".votigram-icon-tick");
    console.log(tickIcons);
    expect(tickIcons).toHaveLength(2); // First two days are claimed
  });

  it("displays unclaimed rewards with correct point values", () => {
    render(
      <DailyRewards
        userPoints={{
          consecutiveLoginDays: 0,
          dailyLoginPointsStatus: false,
          userTotalPoints: 0,
          dailyPointsClaimedStatus: [true, false, false, false, false, false],
        }}
      />
    );

    // Get unclaimed rewards (shows "+ points")
    const unclaimedRewards = screen.getAllByText(/^\+\s\d+/); // Matches "+ 10", "+ 20", etc.
    expect(unclaimedRewards).toHaveLength(6); // 6 unclaimed rewards
    expect(unclaimedRewards[0]).toHaveTextContent("+ 20"); // Day 2
    expect(unclaimedRewards[1]).toHaveTextContent("+ 30"); // Day 3
  });

  it("handles empty dailyPointsClaimedStatus array", () => {
    render(
      <DailyRewards
        userPoints={{
          consecutiveLoginDays: 0,
          dailyLoginPointsStatus: false,
          userTotalPoints: 0,
          dailyPointsClaimedStatus: [],
        }}
      />
    );

    // Confirm all rewards are unclaimed
    const unclaimedRewards = screen.getAllByText(/^\+\s\d+/);
    expect(unclaimedRewards).toHaveLength(mockDAILY_REWARDS.length);
  });

  it("handles null userPoints", () => {
    render(<DailyRewards userPoints={null} />);

    // Confirm all rewards are unclaimed
    const unclaimedRewards = screen.getAllByText(/^\+\s\d+/);
    expect(unclaimedRewards).toHaveLength(mockDAILY_REWARDS.length);
  });

  it("calculates claimedDays correctly (helper function)", () => {
    const result = getLastConsecutiveTrueLength([true, true, false, false]);
    expect(result).toBe(2); // Two consecutive claimed days
  });

  it("calculates 0 claimed days when all are false", () => {
    const result = getLastConsecutiveTrueLength([false, false, false, false]);
    expect(result).toBe(0); // No claimed days
  });

  it("calculates claimed days for an all-true array", () => {
    const result = getLastConsecutiveTrueLength([true, true, true, true]);
    expect(result).toBe(4); // Four consecutive claimed days
  });
});
