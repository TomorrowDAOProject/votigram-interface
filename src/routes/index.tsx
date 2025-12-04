
import React, { useEffect } from "react";

import { useLaunchParams } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import { chainId } from "@/constants/app";
import { postWithToken } from "@/hooks/useData";
import CreatePoll from "@/pageComponents/CreatePoll";
import Home from "@/pageComponents/Home";
import PollDetail from "@/pageComponents/PollDetail";
import { isInTelegram } from "@/utils/isInTelegram";

const routes = [
  {
    path: "/",
    Component: Home,
    title: "Home",
  },

  {
    path: "/create-poll",
    Component: CreatePoll,
    title: "Create Poll",
  },

  {
    path: "/proposal/:proposalId",
    Component: PollDetail,
    title: "Poll Detail",
  },
];

const AppRoutes: React.FC = () => {
  const lp = useLaunchParams();

  const saveUserInfo = async () => {
    try {
      const { first_name, last_name, photo_url, username, id } =
        window?.Telegram?.WebApp?.initDataUnsafe?.user || {};
      await postWithToken("/api/app/user/save-tg-info", {
        telegramId: id?.toString(),
        chainId,
        firstName: first_name,
        lastName: last_name,
        userName: username,
        icon: photo_url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isInTelegram()) {
      saveUserInfo();
    }
  }, []);

  return (
    <AppRoot
      appearance="dark"
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
    >
      <HashRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppRoot>
  );
};

export default AppRoutes;
