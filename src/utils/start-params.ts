import { TelegramPlatform } from "@portkey/did-ui-react";

import { getParamFromQuery } from "./url";

export interface IStartAppParams {
  pid?: string;
  alias?: string;
  referralCode?: string;
  source?: string;
}

export const AND_CHAR = "_";
export const CONNECT_CHAR = "-";
export const stringifyStartAppParams = (params: IStartAppParams) => {
  const parts = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      parts.push(`${key}${AND_CHAR}${value}`);
    }
  }
  return parts.join(CONNECT_CHAR);
};

export const parseStartAppParams = (params: string): IStartAppParams => {
  const result: Record<string, string | number> = {};
  const parts = params.split(CONNECT_CHAR);

  for (const part of parts) {
    const [key, value] = part.split(AND_CHAR);
    if (key && value !== undefined) {
      result[key] = value;
    }
  }
  return result as IStartAppParams;
};

export const getReferrerCode = () => {
  const startParam = TelegramPlatform.getInitData()?.start_param ?? "";
  let referrerCode = "";
  if (startParam.includes(AND_CHAR)) {
    const params = parseStartAppParams(startParam);
    referrerCode = params.referralCode ?? "";
  } else {
    referrerCode = startParam;
  }
  if (!referrerCode && typeof window !== "undefined") {
    referrerCode = getParamFromQuery("referrerCode");
  }
  return referrerCode;
};

export const hexToString = (hex: string) => {
  return hex
    .match(/.{1,2}/g)
    ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
    .join("");
};

export const stringToHex = (str: string) => {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16))
    .join("");
};
