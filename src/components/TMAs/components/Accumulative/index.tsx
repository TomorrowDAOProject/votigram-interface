import Loading from "@/components/Loading";
import VoteItem from "@/components/VoteItem";
import { VoteItemType } from "@/components/VoteItem/type";
import { chainId } from "@/constants/app";
import useData from "@/hooks/useData";
import { useEffect, useState } from "react";

interface IAccumulativeProps {
  scrollTop: number;
  keyward: string;
  category: string;
}
const PAGE_SIZE = 20;

const Accumulative = ({
  scrollTop,
  keyward,
  category: categoryValue,
}: IAccumulativeProps) => {
  const [hasMore, setHasMore] = useState(true);
  const [voteList, setVoteList] = useState<VoteItemType[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useData(
    `/api/app/discover/accumulative-app-list?${new URLSearchParams({
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
      setHasMore(voteList?.length >= PAGE_SIZE);
    }
  }, [data, pageIndex]);

  useEffect(() => {
    if (scrollTop && scrollTop < 50 && hasMore && !isLoading) {
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  }, [hasMore, isLoading, scrollTop]);

  useEffect(() => {
    setSearch(keyward || "");
    setPageIndex(0);
  }, [keyward]);

  useEffect(() => {
    setCategory(categoryValue || "");
    setPageIndex(0);
  }, [categoryValue]);

  return (
    <div className="pb-[100px]">
      {voteList?.map((vote, index) => (
        <VoteItem
          key={`${vote.alias}_${index}`}
          data={vote}
          rank={index + 1}
          proposalId={""}
          showHat={index === 0}
          className="bg-transparent"
          showBtn={false}
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

export default Accumulative;
