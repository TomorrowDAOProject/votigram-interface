import { useEffect, useState } from "react";

import { isTMA } from "@telegram-apps/bridge";


import "./App.css";
import SceneLoading from "./components/SceneLoading";
import { UserProvider } from "./provider/UserProvider";
import WebLoginProvider from "./provider/webLoginProvider";
import Routes from "./routes";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const htmlElement = document.getElementsByTagName("html")[0];
    if (window?.Telegram && isTMA("simple")) {
      if (
        (window.Telegram.WebApp?.platform === "ios" ||
          window.Telegram.WebApp?.platform === "android") &&
        window.Telegram.WebApp?.version &&
        Number(window.Telegram.WebApp?.version) >= 8
      ) {
        window.Telegram.WebApp?.expand?.()
        window.Telegram.WebApp?.requestFullscreen?.();

        const tgTopStyles = `
              --tg-content-safe-area-inset-top: 46px;
              --tg-safe-area-inset-top: 54px;
            `;
        htmlElement.style.cssText =
          htmlElement.style.cssText.concat(tgTopStyles);
      }
      if (
        window.Telegram.WebApp?.platform?.includes("web") ||
        window.Telegram.WebApp?.platform === "tdesktop" ||
        window.Telegram.WebApp?.platform === "macos" ||
        window.Telegram.WebApp?.platform === "unknown"
      ) {
        const tgTopStyles = `
              --tg-content-safe-area-inset-top: 0px;
              --tg-safe-area-inset-top: 0px;
              --tg-safe-area-custom-top: 46px;
            `;
        htmlElement.style.cssText =
          htmlElement.style.cssText.concat(tgTopStyles);
      }
      window.Telegram.WebApp?.lockOrientation?.();
      window.Telegram.WebApp?.disableVerticalSwipes?.();
      window.Telegram.WebApp?.setHeaderColor?.("#000000");
    }
  }, []);

  return (
    <WebLoginProvider>
      <UserProvider>
        {isLoading ? <SceneLoading setIsLoading={setIsLoading} /> : <Routes />}
      </UserProvider>
    </WebLoginProvider>
  );
};

export default App;
