export const chainId = import.meta.env.VITE_SIDECHAIN_ID;

export const projectCode = "13027";

export enum ProposalType {
  UNSPECIFIED = 0,
  GOVERNANCE = 1,
  ADVISORY = 2,
  VETO = 3,
  ALL = "ALL",
}

export enum SupportedELFChainId {
  MAIN_NET = "AELF",
  TDVV_NET = "tDVV",
  TDVW_NET = "tDVW",
}
