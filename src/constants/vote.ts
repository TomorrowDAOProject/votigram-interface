export enum CREATE_STATUS {
  PENDING = -1,
  FAILED = 0,
  SUCCESS = 1,
}

export enum COMMUNITY_LABEL {
  ARCHIVED = "Archived",
  CURRENT = "Current",
}

export enum COMMUNITY_TYPE {
  ACCUMULATIVE = "Accumulative",
  CURRENT = "Current",
}

export enum TMSAP_TAB {
  ACCUMULATIVE = 0,
  CURRENT = 1,
}

export enum VOTE_TABS {
  TMAS = "TMAs",
  COMMUNITY = "Community",
}

export enum PROFILE_TABS {
  TASK = "Task",
  ACHIEVEMENTS = "Achievements",
}

export enum RANKING_TYPE {
  All = 0,
  Verified = 1,
  Community = 2,
  Top = 3,
}

export enum LABEL_TYPE {
  None = 0,
  Gold = 1,
  Blue = 2,
}

export enum VOTE_STATUS {
  NOTVOTE = 0,
  VOTING = 1,
  VOTED = 2,
  FAILED = 9,
}
