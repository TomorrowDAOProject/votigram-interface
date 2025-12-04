export type VoteItemType = {
  pointsPercent: number;
  alias: string;
  title: string;
  icon: string;
  description: string;
  editorChoice: boolean;
  url: string;
  longDescription: string;
  screenshots?: string[];
  totalPoints?: number;
  categories?: string[];
  totalLikes?: number;
  totalVotes?: number;
  pointsAmount?: number;
}