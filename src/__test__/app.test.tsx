import React from "react";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import App from "../App"; // Adjust file path
import "@testing-library/jest-dom";

// Mock WebLoginProvider
vi.mock("../provider/webLoginProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="web-login-provider">{children}</div>
  ),
}));

// Mock UserProvider
vi.mock("../provider/UserProvider", () => ({
  __esModule: true,
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-provider">{children}</div>
  ),
}));

// Mock SceneLoading
vi.mock("../components/SceneLoading", () => ({
  __esModule: true,
  default: ({ setIsLoading }: { setIsLoading: (_: boolean) => void }) => {
    setTimeout(() => setIsLoading(false), 100);
    return <div data-testid="scene-loading">SceneLoading</div>;
  },
}));

// Mock Routes
vi.mock("../routes", () => ({
  __esModule: true,
  default: () => <div data-testid="routes">Routes</div>,
}));

// Mock @aelf-web-login/wallet-adapter-react
vi.mock("@aelf-web-login/wallet-adapter-react", () => ({
  __esModule: true,
  init: vi.fn(),
}));

describe("App Component", () => {
  it("renders SceneLoading initially", () => {
    render(<App />);

    expect(screen.getByTestId("web-login-provider")).toBeInTheDocument();
    expect(screen.getByTestId("user-provider")).toBeInTheDocument();
    expect(screen.getByTestId("scene-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("routes")).not.toBeInTheDocument();
  });
});
