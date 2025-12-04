// SceneLoading.test.tsx
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { postWithToken } from "@/hooks/useData";
import { useUserContext } from "@/provider/UserProvider";

import SceneLoading from "../index";

vi.mock("@/provider/UserProvider", () => ({
  useUserContext: vi.fn(),
}));

vi.mock("@aelf-web-login/wallet-adapter-react", () => ({
  useConnectWallet: vi.fn(),
}));

vi.mock("@/hooks/useData", () => ({
  postWithToken: vi.fn(),
}));

describe("SceneLoading Component", () => {
  beforeEach(() => {
    // Mock user context and wallet service
    (useUserContext as vi.Mock).mockReturnValue({
      hasUserData: () => true,
      user: { isNewUser: false },
    });

    (useConnectWallet as vi.Mock).mockReturnValue({
      isConnected: true,
      wallet: { address: "0x123" },
    });

    (postWithToken as vi.Mock).mockResolvedValue({ data: { status: true } });
  });

  it("renders the component with the correct elements", () => {
    render(<SceneLoading setIsLoading={vi.fn()} />);

    expect(screen.getByText("VOTIGRAM")).toBeInTheDocument();
    expect(screen.getByTestId("scene-loading-image")).toBeInTheDocument();
  });
});
