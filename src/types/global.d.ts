// global.d.ts

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat?: {
      id: number;
      type: string;
      title?: string;
      username?: string;
    };
    can_send_after?: number;
    auth_date?: number;
    hash?: string;
  };
  MainButton: {
    isVisible: boolean;
    text: string;
    color: string;
    textColor: string;
    isProgressVisible: boolean;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
    }): void;
    onClick(handler: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
  };

  close(): void;
  expand(): void;
  onEvent(eventType: string, handler: () => void): void;
  offEvent(eventType: string, handler: () => void): void;
  WebApp: {
    openTelegramLink(url: string): unknown;
    openLink(url: string): unknown;
    openLink(url: string): void;
    isVersionAtLeast(arg0: number): unknown;
    platform: string;
    HapticFeedback: {
      impactOccurred(
        style: "light" | "medium" | "heavy" | "rigid" | "soft"
      ): void;
      notificationOccurred(type: "success" | "warning" | "error"): void;
      selectionChanged(): void;
    };
    version: string;
    expand(): void;
    requestFullscreen(): void;
    lockOrientation(): void;
    disableVerticalSwipes(): void;
    setHeaderColor(color: string): void;
    initData: "";
    initDataUnsafe: {
      start_param: string;
      user: {
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        photo_url: string;
      };
    };
  };
}

interface Window {
  Telegram: TelegramWebApp;
  visualViewport: VisualViewport;
}

declare type Chain = "AELF" | "tDVV" | "tDVW";

declare module "aelf-sdk";

declare namespace vi {
  type Mock = Mock
}
