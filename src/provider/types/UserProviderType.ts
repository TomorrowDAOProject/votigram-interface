import { JwtPayload } from "jwt-decode";

export interface UserPoints {
  consecutiveLoginDays: number;
  dailyLoginPointsStatus: boolean;
  dailyPointsClaimedStatus: boolean[];
  userTotalPoints: number;
}

export interface User {
  userPoints: UserPoints | null;
  isNewUser: boolean;
}

export interface UserContextState {
  user: User;
  cmsData: IConfigContent | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  redirected?: boolean;
}

export interface IConfigContent {
  loginScreen: {
    title: string;
    subtitle: string;
    progressTips: string[];
  };
  earnScreen: {
    title: string;
    subtitle: string;
  };
  voteMain: {
    rules: {
      title: string;
      description: string[];
    };
    listTitle: string;
    topBannerImages: string[];
    nftImage: string;
  };
  communityDaoId: string;
  createVotePageTitle: string;
  rankingAdsBannerUrl: string;
  discoverTopBannerURL: string;
  discoverTopBannerRedirectURL: string;
  retweetVotigramPostURL: string;
  retweetTmrwdaoPostURL: string;
}

export interface CustomJwtPayload extends JwtPayload {
  new_user?: boolean;
}

export interface UserContextType extends UserContextState {
  hasUserData: () => boolean;
  updateUserStatus: (isNewUser: boolean) => void;
  updateUserPoints: (points: number) => void;
  fetchTokenAndData: () => Promise<void>;
  updateRedirectedStatus: (redirected: boolean) => void;
  updateDailyLoginPointsStatus: (value: number) => void;
}
