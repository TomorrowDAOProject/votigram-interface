import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";


import AdVideo from "../index";

describe("AdVideo Component", () => {
  it("renders the video element with the correct src", () => {
    const videoSrc =
      "https://cdn.tmrwdao.com/votigram/assets/videos/07EB1DE0DD8B.mp4";

    render(<AdVideo src={videoSrc} />);

    const videoElement = screen.getByRole("video");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.querySelector("source")).toHaveAttribute(
      "src",
      videoSrc
    );
  });

  it("sets the duration on loadedmetadata event", () => {
    const videoSrc =
      "https://cdn.tmrwdao.com/votigram/assets/videos/07EB1DE0DD8B.mp4";

    render(<AdVideo src={videoSrc} />);

    const videoElement = screen.getByRole("video") as HTMLVideoElement;

    // Mock duration property
    Object.defineProperty(videoElement, "duration", {
      value: 200, // Video duration is 200 seconds
      writable: true,
      configurable: true,
    });

    // Fire the loadedmetadata event (video duration is loaded)
    fireEvent.loadedMetadata(videoElement);

    // Verify that the progress bar width is 0% since currentTime is still 0
    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle("width: 0%");
  });

  it("does not update the progress bar width when duration is 0", () => {
    const videoSrc =
      "https://cdn.tmrwdao.com/votigram/assets/videos/07EB1DE0DD8B.mp4";

    render(<AdVideo src={videoSrc} />);

    const videoElement = screen.getByRole("video") as HTMLVideoElement;

    // Simulate duration = 0 (uninitialized video)
    Object.defineProperty(videoElement, "duration", {
      value: 0, // Duration is 0
      writable: true,
      configurable: true,
    });
    Object.defineProperty(videoElement, "currentTime", {
      value: 10, // Current time is 10 seconds
      writable: true,
      configurable: true,
    });

    // Fire the timeupdate event
    fireEvent.timeUpdate(videoElement);

    // Verify that the progress bar remains at 0% width
    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle("width: 0%");
  });
});
