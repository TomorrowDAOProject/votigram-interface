export enum USER_TASK_DETAIL {
  DAILY_VIEW_ADS = "DailyViewAds",
  DAILY_VOTE = "DailyVote",
  DAILY_FIRST_INVITE = "DailyFirstInvite",
  EXPLORE_JOIN_VOTIGRAM = "ExploreJoinVotigram",
  EXPLORE_FOLLOW_VOTIGRAM_X = "ExploreFollowVotigramX",
  EXPLORE_FORWARD_VOTIGRAM_X = "ExploreForwardVotigramX",
  EXPLORE_SCHRODINGER = "ExploreSchrodinger",
  EXPLORE_JOIN_TG_CHANNEL = "ExploreJoinTgChannel",
  EXPLORE_FOLLOW_X = "ExploreFollowX",
  EXPLORE_FORWARD_X = "ExploreForwardX",
  EXPLORE_CUMULATE_FIVE_INVITE = "ExploreCumulateFiveInvite",
  EXPLORE_CUMULATE_TEN_INVITE = "ExploreCumulateTenInvite",
  EXPLORE_CUMULATE_TWENTY_INVITE = "ExploreCumulateTwentyInvite",
}

export enum USER_TASK_TITLE{
  DAILY = "Daily",
  EXPLORE_VOTIGRAM = "ExploreVotigram",
  EXPLORE_APPS = "ExploreApps",
  REFERRALS = "Referrals",
}

export const USER_TASK_TITLE_MAP = {
  [USER_TASK_TITLE.DAILY]: 'Daily Tasks',
  [USER_TASK_TITLE.EXPLORE_VOTIGRAM]: 'Explore Votigram',
  [USER_TASK_TITLE.EXPLORE_APPS]: 'Explore Apps',
  [USER_TASK_TITLE.REFERRALS]: 'Referrals',
};
