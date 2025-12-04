
import { useMemo } from "react";

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { Placeholder, AppRoot } from "@telegram-apps/telegram-ui";

export function EnvUnsupported() {
  const platform = useMemo(() => {
    let platform = "base";
    try {
      const lp = retrieveLaunchParams();
      platform = lp.platform;
    } catch (e) {
      console.error(e);
    }

    return platform;
  }, []);

  return (
    <AppRoot
      appearance="dark"
      platform={["macos", "ios"].includes(platform) ? "ios" : "base"}
    >
      <Placeholder
        header="Oops"
        className="bg-black"
        description="You are using too old Telegram client to run this application"
      >
        <span>Unsupported environment</span>
      </Placeholder>
    </AppRoot>
  );
}
