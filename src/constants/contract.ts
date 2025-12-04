export const DEFAULT_ERROR = "Something went wrong. Please try again later.";

const USER_DENIED_MESSAGE =
  "Request rejected. TMRW DAO needs your permission to continue";

export enum SOURCE_ERROR_TYPE {
  ERROR_1 = "Operation canceled",
  ERROR_2 = "You closed the prompt without any action",
  ERROR_3 = "User denied",
  ERROR_4 = "User close the prompt",
  ERROR_5 = "Wallet not login",
  ERROR_6 = "Insufficient allowance of ELF",
  ERROR_7 = "User Cancel",
}

export enum TARGET_ERROR_TYPE {
  ERROR_1 = USER_DENIED_MESSAGE,
  ERROR_2 = USER_DENIED_MESSAGE,
  ERROR_3 = USER_DENIED_MESSAGE,
  ERROR_4 = USER_DENIED_MESSAGE,
  ERROR_5 = "Wallet not logged in",
  ERROR_6 = "The allowance you set is less than required. Please reset it",
  ERROR_7 = USER_DENIED_MESSAGE,
}
