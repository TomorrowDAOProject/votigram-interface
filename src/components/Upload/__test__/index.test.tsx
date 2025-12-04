// Upload.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

import Upload from "../index"; // Adjust the path to your component

import "@testing-library/jest-dom";

// Mock external dependencies
vi.mock("@/utils/canvasUtils", () => ({
  getCroppedImg: vi.fn().mockResolvedValue(new Blob()),
}));

vi.mock("@/hooks/useData", () => ({
  uploadWithToken: vi.fn().mockResolvedValue({
    code: "20000",
    data: "https://example.com/uploaded-image.jpg",
  }),
}));

vi.mock("@/utils/file", () => ({
  blobToFile: vi
    .fn()
    .mockImplementation((blob) => new File([blob], "croppedImage.jpg")),
}));

describe("Upload Component", () => {
  const mockOnFinish = vi.fn();
  const mockFile = new File(["dummy content"], "example.jpg", {
    type: "image/jpeg",
  });

  afterEach(() => {
    vi.clearAllMocks(); // Reset mocks after each test
  });

  it("renders correctly with default props", () => {
    render(<Upload />);
    const uploadContainer = screen.getByTestId("confirm-button");
    expect(uploadContainer).toBeInTheDocument();

    const placeholderIcon = uploadContainer.querySelector(
      ".votigram-icon-back"
    );
    expect(placeholderIcon).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(<Upload>Custom Upload Text</Upload>);
    expect(screen.getByText("Custom Upload Text")).toBeInTheDocument();
  });

  it("handles upload errors gracefully", async () => {
    vi.mock("@/hooks/useData", () => ({
      uploadWithToken: vi.fn().mockRejectedValue(new Error("Upload failed")),
    }));

    render(<Upload onFinish={mockOnFinish} />);
    const fileInput = screen.getByRole("textbox", { hidden: true });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the error to be logged
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    // Verify onFinish is not called due to the error
    expect(mockOnFinish).not.toHaveBeenCalled();
  });
});
