export const isInTelegram = () => {
  if (typeof window !== "undefined") {
    return !!window?.Telegram?.WebApp?.initData;
  }
  return false;
};
