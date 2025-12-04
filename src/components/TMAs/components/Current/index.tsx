import { useEffect, useState } from "react";

import Loading from "@/components/Loading";
import VoteItem from "@/components/VoteItem";
import { chainId } from "@/constants/app";
import { APP_CATEGORY } from "@/constants/discover";
import useData from "@/hooks/useData";
import { VoteApp } from "@/types/app";

interface IAccumulativeProps {
  scrollTop: number;
  keyword: string;
  category: APP_CATEGORY;
  onAppItemClick?: (item: VoteApp) => void;
}
const PAGE_SIZE = 20;

const Current = ({
  scrollTop,
  keyword,
  category: cate,
  onAppItemClick,
}: IAccumulativeProps) => {
  const [hasMore, setHasMore] = useState(true);
  const [voteList, setVoteList] = useState<VoteApp[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<APP_CATEGORY>(APP_CATEGORY.ALL);
  const [proposalId, setProposalId] = useState("");
  const [canVote, setCanVote] = useState(false);

  const { data, isLoading } = useData(
    `/api/app/discover/current-app-list?${new URLSearchParams({
      chainId,
      category,
      skipCount: (pageIndex * PAGE_SIZE).toString(),
      maxResultCount: PAGE_SIZE.toString(),
      search,
    }).toString()}`
  );

  useEffect(() => {
    const { data: voteList } = data || {};
    if (voteList && Array.isArray(voteList)) {
      setVoteList((prev) =>
        pageIndex === 0 ? voteList : [...prev, ...voteList]
      );
      setCanVote(data.canVote);
      setProposalId(data.proposalId);
      setHasMore(voteList?.length >= PAGE_SIZE);
    }
  }, [data, pageIndex]);

  useEffect(() => {
    if (scrollTop && scrollTop < 50 && hasMore && !isLoading) {
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  }, [hasMore, isLoading, scrollTop]);

  useEffect(() => {
    setSearch(keyword || "");
    setPageIndex(0);
  }, [keyword]);

  useEffect(() => {
    setCategory(cate);
    setPageIndex(0);
  }, [cate]);

  const onVoted = (addPoints: number, index: number) => {
    setCanVote(false);
    const list = [...voteList];
    list[index].totalPoints = (list[index].totalPoints || 0) + addPoints;
    setVoteList(list);
  };

  return (
    <div className="pt-3 pb-[100px]">
      {voteList?.map((vote, index) => (
        <VoteItem
          key={`${vote.alias}_${index}`}
          data={vote}
          rank={index + 1}
          proposalId={proposalId}
          showHat={index === 0}
          className="bg-transparent"
          canVote={canVote}
          category={category}
          onVoted={(addPoints: number) => onVoted(addPoints, index)}
          onClick={onAppItemClick}
          isTMACurrent
          showPoints
          showBtn
        />
      ))}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Current;
