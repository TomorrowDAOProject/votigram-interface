// ImageCarousel.test.tsx
import React from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ImageCarousel from "../index"; // Adjust the path as necessary

import "@testing-library/jest-dom"; // For extended assertions

// Mock the Telegram WebApp Haptic Feedback
const mockImpactOccurred = vi.fn();

beforeEach(() => {
  global.window.Telegram = {
    WebApp: {
      HapticFeedback: {
        impactOccurred: mockImpactOccurred,
        notificationOccurred: vi.fn(),
        selectionChanged: vi.fn(),
      },
    },
  } as unknown as TelegramWebApp;
});

// Mock Swiper components
vi.mock("swiper/react", () => ({
  Swiper: ({
    children,
    onActiveIndexChange,
  }: {
    children: React.ReactNode;
    onActiveIndexChange: () => void;
  }) => {
    React.useEffect(() => {
      if (onActiveIndexChange) {
        onActiveIndexChange(); // Simulate active index change
      }
    }, [onActiveIndexChange]);
    return <div className="swiper-mock">{children}</div>;
  },
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ImageCarousel", () => {
  const items = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  it("renders without crashing", () => {
    render(<ImageCarousel items={items} />);
    expect(screen.getAllByRole("img").length).toBe(3);
  });

  it("renders correct number of slides", () => {
    render(<ImageCarousel items={items} />);
    const slides = screen.getAllByRole("img");
    expect(slides).toHaveLength(items.length);
  });

  it("renders images with correct src attributes", () => {
    render(<ImageCarousel items={items} />);
    items.forEach((item, index) => {
      const img = screen.getAllByRole("img")[index];
      expect(img).toHaveAttribute("src", item);
    });
  });

  it("triggers haptic feedback on active index change", () => {
    render(<ImageCarousel items={items} />);
    expect(mockImpactOccurred).toHaveBeenCalledWith("light");
  });
});
