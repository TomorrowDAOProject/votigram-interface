import { useRef, useState } from "react";

import clsx from "clsx";


interface IAdVideoProps {
  className?: string;
  src: string;
}

const AdVideo = ({ src, className }: IAdVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current?.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div className="relative w-full h-[63%] flex items-end">
      <video
        role="video"
        className={clsx("w-full object-contain", className)}
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay
        loop
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-[20px] w-[calc(100%-40px)] h-[2px] bg-tertiary rounded-[15px]">
        <div
          data-testid="progress-bar"
          role="progressbar"
          className="h-[2px] bg-primary rounded-[15px]"
          style={{
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
};

export default AdVideo;
