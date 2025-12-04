import dayjs from 'dayjs';

import { VoteTimeItem } from '@/types/app';

export const getProposalTimeParams = (
  startTime: number,
  endTime: VoteTimeItem | number,
) => {
  let timeParams = {};
  const activeStartTime =
    startTime === 1 ? Date.now() : startTime;
  const activeEndTime =
    typeof endTime === 'object'
      ? dayjs(activeStartTime).add(endTime.value, endTime.unit).valueOf()
      : endTime;
  // if start time is now, convert to period
  if (startTime === 1) {
    timeParams = {
      activeTimePeriod: Math.floor((activeEndTime - activeStartTime) / 1000),
      activeStartTime: 0,
      activeEndTime: 0,
    };
  } else {
    timeParams = {
      activeTimePeriod: 0,
      activeStartTime: Math.floor(activeStartTime / 1000),
      activeEndTime: Math.floor(activeEndTime / 1000),
    };
  }
  return timeParams;
};

export const formmatDescription = (alias: string[], bannerUrl?: string) => {
  const appAlias = bannerUrl ? alias.slice(0, -1) : alias;
  const aliasStr = appAlias.map((item) => `{${item}}`).join(',');
  const bannerAlias = bannerUrl ? alias[alias.length - 1] : null;
  const bannerStr = bannerAlias ? `#B:{${bannerAlias}}` : '';
  return `##GameRanking:${aliasStr}${bannerStr}`;
};

export function combineDateAndTime(dateA: number | string, dateB: number | string) {
  if (!dayjs(dateA).isValid() || !dayjs(dateB).isValid()) {
    return dateA;
  }
  const dateAPart = dayjs(dateA);
  const dateBPart = dayjs(dateB);

  const combinedDate = dateAPart
    .hour(dateBPart.hour())
    .minute(dateBPart.minute())
    .second(dateBPart.second());

  return combinedDate.valueOf();
}
