// Modal.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Modal from "../index"; // Adjust to your actual path

import "@testing-library/jest-dom";

describe("Modal Component", () => {
  it("renders children when visible", () => {
    const childContent = "This is a modal";
    render(
      <Modal isVisible={true} rootClassName="test-root">
        <div>{childContent}</div>
      </Modal>
    );

    expect(screen.getByText(childContent)).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    const childContent = "You should not see this";
    render(
      <Modal isVisible={false} rootClassName="test-root">
        <div>{childContent}</div>
      </Modal>
    );

    expect(screen.queryByText(childContent)).not.toBeInTheDocument();
  });

  it("applies the root class name", () => {
    render(
      <Modal isVisible={true} rootClassName="custom-class">
        <div>Content</div>
      </Modal>
    );

    const modal = screen.getByText("Content").parentElement; // get motion.div
    expect(modal).toHaveClass("custom-class");
  });
});
