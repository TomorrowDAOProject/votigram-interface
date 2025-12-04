export type Comment = {
  id: string;
  chainId: string;
  daoId: string | null;
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
  commentStatus: number; // Assuming it's a number (e.g., an enum status)
  createTime: number; // Timestamp in milliseconds
  modificationTime: number; // Timestamp in milliseconds
};
