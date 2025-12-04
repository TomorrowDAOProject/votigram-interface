import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { motion } from "framer-motion";

import { useUserContext } from "@/provider/UserProvider";

interface ISceneLoadingProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SceneLoading = ({ setIsLoading }: ISceneLoadingProps) => {
  const [progress, setProgress] = useState(20);

  const {
    hasUserData,
    user: { isNewUser },
  } = useUserContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100; // Stop at 100%
        }
        return prevProgress + Math.random() * 20; // Increment progress by 1%
      });
    }, 3000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    if (hasUserData()) {
      setProgress(89);
    }
  }, [hasUserData]);

  useEffect(() => {
    if (progress >= 90) {
      setIsLoading(isNewUser);
    }
  }, [isNewUser, progress, setIsLoading]);

  return (
    <div className="bg-primary min-h-[533px] pt-telegramHeader">
      <div className="relative h-screen">
        <div className="absolute top-[10vh] left-1/2 -translate-x-1/2 w-full h-[62.8vh] z-0">
          <img
            src="https://cdn.tmrwdao.com/votigram/assets/imgs/4A063293E0F8.webp"
            className="animate-spin w-auto h-full"
            data-testid="scene-loading-image"
          />
        </div>

        <img
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/DF6ECDDBE37D.webp"
          className="relative mx-auto h-[62.8vh] z-10"
          data-testid="scene-loading-image"
        />
        <img
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/C0EE0D2FC207.webp"
          className="relative mx-auto mb-[25px] h-[14.6vh] z-10"
          data-testid="scene-loading-image"
        />

        <div className="px-[49px]">
          {isNewUser && progress >= 90 ? (
            <button
              data-testid="cta-button"
              onClick={() => {
                setIsLoading(false);
              }}
              className="bg-white text-primary w-full rounded-3xl py-2.5 leading-[14px] text-[14px] font-bold font-outfit"
            >
              Get Started!
            </button>
          ) : (
            <div
              role="progressbar"
              className="h-3 col-10 offset-1 bg-white rounded-full px-0.5 flex items-center"
            >
              <motion.div
                className="h-2 bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }} // Smooth transition for increase
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneLoading;
