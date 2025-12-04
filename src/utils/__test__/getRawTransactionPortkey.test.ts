
import { getContractBasic } from "@portkey/contracts";
import { aelf } from "@portkey/utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { EVoteOption } from "@/types/contract";
import { getRawTransactionPortkey } from "@/utils/getRawTransactionPortkey";

// Mock dependencies
vi.mock("@portkey/contracts", () => ({
  getContractBasic: vi.fn(),
}));

vi.mock("@portkey/utils", () => ({
  aelf: {
    getWallet: vi.fn(),
  },
}));

describe("getRawTransactionPortkey", () => {
  const mockGetWallet = aelf.getWallet as vi.Mock;
  const mockGetContractBasic = getContractBasic as vi.Mock;
  const mockEncodedTx = vi.fn();

  const mockParams = {
    caHash: "mock-ca-hash",
    privateKey: "mock-private-key",
    contractAddress: "mock-contract-address",
    caContractAddress: "mock-ca-contract-address",
    rpcUrl: "mock-rpc-url",
    params: {
      votingItemId: "123",
      voteOption: EVoteOption.APPROVED,
      voteAmount: 1,
      memo: "mock-memo",
    },
    methodName: "Vote",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock `aelf.getWallet`
    mockGetWallet.mockReturnValue("mock-wallet");

    // Mock `getContractBasic`
    mockGetContractBasic.mockResolvedValue({
      encodedTx: mockEncodedTx,
    });

    // Mock `encodedTx`
    mockEncodedTx.mockResolvedValue({
      data: "mock-transaction-data",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a raw transaction successfully", async () => {
    const result = await getRawTransactionPortkey(mockParams);

    // Check `getWallet` is called with the private key
    expect(mockGetWallet).toHaveBeenCalledWith("mock-private-key");

    // Check `getContractBasic` is called with the correct arguments
    expect(mockGetContractBasic).toHaveBeenCalledWith({
      callType: "ca",
      caHash: "mock-ca-hash",
      account: "mock-wallet",
      contractAddress: "mock-contract-address",
      caContractAddress: "mock-ca-contract-address",
      rpcUrl: "mock-rpc-url",
    });

    // Check `encodedTx` is called with the method name and params
    expect(mockEncodedTx).toHaveBeenCalledWith("Vote", {
      votingItemId: "123",
      voteOption: EVoteOption.APPROVED,
      voteAmount: 1,
      memo: "mock-memo",
    });

    // Ensure the function returns the correct transaction data
    expect(result).toBe("mock-transaction-data");
  });

  it("handles errors from `getContractBasic`", async () => {
    // Mock `getContractBasic` to throw an error
    mockGetContractBasic.mockRejectedValue(new Error("Failed to get contract"));

    await expect(getRawTransactionPortkey(mockParams)).rejects.toThrow(
      "Failed to get contract"
    );

    // Ensure `encodedTx` is not called since `getContractBasic` fails
    expect(mockEncodedTx).not.toHaveBeenCalled();
  });

  it("handles errors from `encodedTx`", async () => {
    // Mock `encodedTx` to throw an error
    mockEncodedTx.mockRejectedValue(new Error("Transaction encoding failed"));

    await expect(getRawTransactionPortkey(mockParams)).rejects.toThrow(
      "Transaction encoding failed"
    );

    // Check `getContractBasic` was called successfully
    expect(mockGetContractBasic).toHaveBeenCalled();

    // Check `encodedTx` was called before failing
    expect(mockEncodedTx).toHaveBeenCalledWith("Vote", {
      votingItemId: "123",
      voteOption: EVoteOption.APPROVED,
      voteAmount: 1,
      memo: "mock-memo",
    });
  });
});
