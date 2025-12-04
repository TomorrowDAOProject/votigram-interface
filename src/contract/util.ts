import {
  DEFAULT_ERROR,
  SOURCE_ERROR_TYPE,
  TARGET_ERROR_TYPE,
} from "@/constants/contract";
import { IContractError } from "@/types/contract";

export const matchErrorMsg = <T>(message: T) => {
  if (typeof message === "string") {
    const sourceErrors = [
      SOURCE_ERROR_TYPE.ERROR_1,
      SOURCE_ERROR_TYPE.ERROR_2,
      SOURCE_ERROR_TYPE.ERROR_3,
      SOURCE_ERROR_TYPE.ERROR_4,
      SOURCE_ERROR_TYPE.ERROR_5,
      SOURCE_ERROR_TYPE.ERROR_6,
      SOURCE_ERROR_TYPE.ERROR_7,
    ];
    const targetErrors = [
      TARGET_ERROR_TYPE.ERROR_1,
      TARGET_ERROR_TYPE.ERROR_2,
      TARGET_ERROR_TYPE.ERROR_3,
      TARGET_ERROR_TYPE.ERROR_4,
      TARGET_ERROR_TYPE.ERROR_5,
      TARGET_ERROR_TYPE.ERROR_6,
      TARGET_ERROR_TYPE.ERROR_7,
    ];

    let resMessage: string = message;

    for (let index = 0; index < sourceErrors.length; index++) {
      if (message.includes(sourceErrors[index])) {
        resMessage = message.replace(sourceErrors[index], targetErrors[index]);
      }
    }

    return resMessage.replace("AElf.Sdk.CSharp.AssertionException: ", "");
  } else {
    return DEFAULT_ERROR;
  }
};

const stringifyMsg = (message: unknown) => {
  if (typeof message === "object") {
    return JSON.stringify(message);
  }
  return message?.toString();
};
export const formatErrorMsg = (result: IContractError) => {
  let resError: IContractError = result;

  if (result.message) {
    resError = {
      ...result,
      error: result.code,
      errorMessage: {
        message: stringifyMsg(result.message) || "",
      },
    };
  } else if (result.Error) {
    resError = {
      ...result,
      error: "401",
      errorMessage: {
        message:
          stringifyMsg(result.Error)?.replace(
            "AElf.Sdk.CSharp.AssertionException: ",
            ""
          ) || "",
      },
    };
  } else if (
    typeof result.error !== "number" &&
    typeof result.error !== "string"
  ) {
    if (result.error?.message) {
      resError = {
        ...result,
        error: "401",
        errorMessage: {
          message:
            stringifyMsg(result.error.message)?.replace(
              "AElf.Sdk.CSharp.AssertionException: ",
              ""
            ) || "",
        },
      };
    }
  } else if (typeof result.error === "string") {
    resError = {
      ...result,
      error: "401",
      errorMessage: {
        message: result?.errorMessage?.message || result.error,
      },
    };
  }

  const errorMessage = resError.errorMessage?.message;

  return {
    ...resError,
    errorMessage: {
      message: matchErrorMsg(errorMessage),
    },
  };
};
