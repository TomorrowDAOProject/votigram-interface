import { ManipulateType } from "dayjs";

import { APP_CATEGORY } from "@/constants/discover";
import { LABEL_TYPE, RANKING_TYPE } from "@/constants/vote";

export type VoteApp = {
  alias: string;
  appType: string;
  categories: APP_CATEGORY[];
  createTime: string; // or Date if you prefer to handle it as a Date object
  creator: string;
  description: string;
  editorChoice: boolean;
  icon: string;
  id: string;
  loadTime: string; // or Date if you prefer to handle it as a Date object
  longDescription: string;
  screenshots: string[];
  title: string;
  updateTime: string; // or Date if you prefer to handle it as a Date object
  url: string;
  pointsAmount?: number;
  totalLikes?: number;
  totalShares?: number;
  totalComments?: number;
  totalOpens?: number;
  totalPoints?: number;
  pointsPercent?: number;
};

export type CommentItem = {
  id: string;
  chainId: string;
  daoId: string;
  proposalId: string;
  alias: string;
  commenter: string;
  commenterId: string;
  commenterName: string;
  commenterFirstName: string;
  commenterLastName: string;
  commenterPhoto: string;
  comment: string;
  parentId: string;
  commentStatus: number;
  createTime: number;
  modificationTime: number;
};

export type VoteTimeItem = {
  value: number;
  unit: ManipulateType;
  label: string;
};

export type IRankingListItem = {
  alias: string;
  title: string;
  icon: string;
  description: string;
  editorChoice: boolean;
  url: string;
  longDescription: string;
  screenshots: string[];
  voteAmount: number;
  votePercent: number;
  pointsAmount: number;
  pointsPercent: number;
};

export type IPollDetail = {
  startTime: string;
  endTime: string;
  canVoteAmount: number;
  totalVoteAmount: number;
  userTotalPoints: number;
  bannerUrl: string;
  rankingType: RANKING_TYPE;
  labelType: LABEL_TYPE;
  proposalTitle: string;
  rankingList: VoteApp[];
  activeStartEpochTime: number;
  activeEndEpochTime: number;
};

export type DiscoverType = {
  value: APP_CATEGORY;
  label: string;
};

export type Size = {
  width: number;
  height: number;
};
