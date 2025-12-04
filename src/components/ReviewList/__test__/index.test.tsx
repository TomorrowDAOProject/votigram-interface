// ReviewList.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

import { Comment } from "@/types/comment";

import ReviewList from "../index";

// Mock Item component
vi.mock("./components/Item", () => ({
  default: ({ data, className }: { data: Comment; className?: string }) => (
    <div className={className}>{data.comment}</div>
  ),
}));

describe("ReviewList Component", () => {
  it("displays empty state message when there are no items", () => {
    render(<ReviewList dataSource={[]} hasMore={false} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("calls loadData on mount", () => {
    const loadData = vi.fn();
    render(<ReviewList dataSource={[]} hasMore={true} loadData={loadData} />);
    expect(loadData).toHaveBeenCalled();
  });
});
