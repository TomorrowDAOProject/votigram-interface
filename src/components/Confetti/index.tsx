import { useEffect, useRef } from "react";

import canvasConfetti, { CreateTypes } from "canvas-confetti";

interface IConfettiProps {
  className: string;
  height?: number;
  onInit?: ({ confetti }: { confetti: CreateTypes }) => void;
}

const Confetti = ({ className, height = 1000, onInit }: IConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confetti = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    confetti.current = canvasConfetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    onInit?.({
      confetti: confetti.current,
    });

    return () => {
      confetti.current?.reset();
    };
  }, [onInit]);

  return (
    <canvas
      role="presentation"
      ref={canvasRef}
      height={height}
      className={className}
    />
  );
};

export default Confetti;
