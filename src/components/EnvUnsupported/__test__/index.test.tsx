import React from "react";

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { EnvUnsupported } from "../index"; // Adjust to your file structure

import "@testing-library/jest-dom";

// Mock AppRoot and Placeholder
vi.mock("@telegram-apps/telegram-ui", () => ({
  AppRoot: ({
    children,
    platform,
  }: {
    children: React.ReactNode;
    platform: string;
  }) => (
    <div data-testid="app-root" data-platform={platform}>
      {children}
    </div>
  ),
  Placeholder: ({
    header,
    description,
    className,
    children,
  }: {
    header: string;
    description: string;
    className?: string;
    children?: React.ReactNode;
  }) => (
    <div
      data-testid="placeholder"
      className={className}
      data-header={header}
      data-description={description}
    >
      {children}
    </div>
  ),
}));

// Mock retrieveLaunchParams
vi.mock("@telegram-apps/sdk-react", () => ({
  retrieveLaunchParams: vi.fn(),
}));

describe("EnvUnsupported Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it("renders the Placeholder with default platform when retrieveLaunchParams throws", () => {
    // Mock retrieveLaunchParams to throw an error
    (retrieveLaunchParams as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw new Error("Mocked error");
      }
    );

    render(<EnvUnsupported />);

    // Verify AppRoot renders with default platform 'base'
    const appRoot = screen.getByTestId("app-root");
    expect(appRoot).toHaveAttribute("data-platform", "base");

    // Verify Placeholder content
    const placeholder = screen.getByTestId("placeholder");
    expect(placeholder).toHaveAttribute("data-header", "Oops");
    expect(placeholder).toHaveAttribute(
      "data-description",
      "You are using too old Telegram client to run this application"
    );
    expect(screen.getByText("Unsupported environment")).toBeInTheDocument();
  });

  it("renders with platform 'ios' when platform is 'macos'", () => {
    // Mock retrieveLaunchParams to return macos platform
    (retrieveLaunchParams as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        platform: "macos",
      })
    );

    render(<EnvUnsupported />);

    // Verify AppRoot renders with platform 'ios'
    const appRoot = screen.getByTestId("app-root");
    expect(appRoot).toHaveAttribute("data-platform", "ios");

    // Verify Placeholder content
    expect(screen.getByTestId("placeholder")).toBeInTheDocument();
    expect(screen.getByText("Unsupported environment")).toBeInTheDocument();
  });

  it("renders with fallback platform 'base' when platform is unsupported", () => {
    // Mock retrieveLaunchParams to return an unsupported platform
    (retrieveLaunchParams as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        platform: "android",
      })
    );

    render(<EnvUnsupported />);

    // Verify AppRoot renders with platform 'base'
    const appRoot = screen.getByTestId("app-root");
    expect(appRoot).toHaveAttribute("data-platform", "base");

    // Verify Placeholder content
    expect(screen.getByTestId("placeholder")).toBeInTheDocument();
  });
});
