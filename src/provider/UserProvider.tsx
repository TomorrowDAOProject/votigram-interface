import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";
import {
  UserContextState,
  UserContextType,
  CustomJwtPayload,
  User,
} from "./types/UserProviderType";
import { fetchToken } from "@/utils/token";

let RETRY_MAX_COUNT = 3;

const initialState: UserContextState = {
  user: {
    userPoints: {
      consecutiveLoginDays: 1,
      dailyLoginPointsStatus: false,
      userTotalPoints: 0,
    },
    isNewUser: false,
  },
  token: null,
  loading: true,
  error: null,
};

// Create a context
const UserContext = createContext<UserContextType | undefined>(undefined);

type Action =
  | { type: "SET_USER_DATA"; payload: User }
  | { type: "SET_TOKEN"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const dataReducer = (
  state: UserContextState,
  action: Action
): UserContextState => {
  switch (action.type) {
    case "SET_USER_DATA":
      return { ...state, user: action.payload, loading: false };
    case "SET_TOKEN":
      return { ...state, token: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${JSON.stringify(action)}`);
  }
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

const getUserPoints = async (accessToken: string) => {
  // Fetch user points data
  const userPointsResponse = await fetch(
    `${
      import.meta.env.VITE_BASE_URL
    }/api/app/user/login-points/status?chainId=tDVW`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!userPointsResponse.ok) throw new Error("Failed to fetch user points");
  const userPointsData = await userPointsResponse.json();
  return userPointsData;
};

// UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const fetchTokenAndData = async () => {
      try {
        const access_token = await fetchToken();

        if (!access_token) {
          const error = new Error("Failed to fetch token");
          error.name = "401";
          throw error;
        }

        dispatch({ type: "SET_TOKEN", payload: access_token });
        Cookies.set("access_token", access_token);
        const decodedToken = jwtDecode<CustomJwtPayload>(access_token);
        const userPointsData = await getUserPoints(access_token);

        // Combine and set user data
        dispatch({
          type: "SET_USER_DATA",
          payload: {
            isNewUser: !!decodedToken.new_user || false,
            userPoints: userPointsData?.data || 0,
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "401" &&
          RETRY_MAX_COUNT > 0
        ) {
          RETRY_MAX_COUNT = RETRY_MAX_COUNT - 1;
          fetchTokenAndData();
        } else {
          RETRY_MAX_COUNT = 3;
        }
        console.error("Error fetching data:", error);
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (state.loading) {
      fetchTokenAndData();
    }
  }, [state.loading]);

  const hasUserData = () => {
    return state.user.userPoints !== null;
  };

  const updateDailyLoginPointsStatus = (value: boolean) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: {
        ...state.user,
        userPoints: {
          ...state.user.userPoints,
          dailyLoginPointsStatus: value,
        },
      } as User,
    });
  };

  return (
    <UserContext.Provider
      value={{ ...state, hasUserData, updateDailyLoginPointsStatus }}
    >
      {children}
    </UserContext.Provider>
  );
};