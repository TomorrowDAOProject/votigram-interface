import { StrictMode } from "react";

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { Buffer } from "buffer";
import { createRoot } from "react-dom/client";

import "./styles/theme.css";
import "./index.css";
import "./assets/fonts/votigram-icon.css";

import App from "./App";
import { EnvUnsupported } from "./components/EnvUnsupported";
import { init } from "./init";

const root = createRoot(document.getElementById("root")!);

window.Buffer = Buffer;

// Mock the environment in case, we are outside Telegram.
import "./mockEnv.ts";

try {
  // Configure all application dependencies.
  init(retrieveLaunchParams().startParam === "debug" || import.meta.env.DEV);

  if (process.env.NODE_ENV === "development") {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    root.render(<App />);
  }
} catch (e) {
  root.render(<EnvUnsupported />);
  console.error(e);
}
