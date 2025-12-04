/* eslint-disable @typescript-eslint/no-explicit-any */
export const toUrlEncoded = (
  data: Record<string, any>,
  prefix = ""
): string => {
  const segments: string[] = [];

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const newPrefix = prefix
        ? `${prefix}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);

      if (typeof value === "object" && value !== null) {
        // Recursively format nested objects
        segments.push(toUrlEncoded(value, newPrefix));
      } else {
        // Encode key-value pair
        segments.push(`${newPrefix}=${encodeURIComponent(value)}`);
      }
    }
  }

  return segments.join("&");
};

export const fetchToken = async () => {
  try {
    const initData =
      window?.Telegram?.WebApp?.initData ||
      import.meta.env.VITE_TELEGRAM_INIT_DATA;
    // Fetch token
    const tokenResponse = await fetch(
      `${import.meta.env.VITE_BASE_URL}/connect/token`,
      {
        method: "POST",
        body: toUrlEncoded({
          grant_type: "signature",
          client_id: "TomorrowDAOServer_App",
          scope: "TomorrowDAOServer",
          login_type: "TG",
          init_data: initData,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!tokenResponse.ok) throw new Error("Failed to fetch token");
    const { access_token } = (await tokenResponse.json()) || {};
    return access_token;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
};
