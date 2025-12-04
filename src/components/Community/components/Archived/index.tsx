import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Loading from "@/components/Loading";
import VoteSection from "@/components/VoteSection";
import { VoteSectionType } from "@/components/VoteSection/type";
import { chainId } from "@/constants/app";
import { COMMUNITY_TYPE } from "@/constants/vote";
import useData from "@/hooks/useData";

interface IArchivedProps {
  type: COMMUNITY_TYPE;
  scrollTop: number;
  currentTab?: number;
}
const PAGE_SIZE = 20;

const Archived = ({ type, scrollTop, currentTab }: IArchivedProps) => {
  const [hasMore, setHasMore] = useState(true);
  const [sections, setSections] = useState<VoteSectionType[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [currentType, setCurrentType] = useState(type);

  const navigate = useNavigate();

  const { data, isLoading } = useData(
    `/api/app/ranking/poll-list?${new URLSearchParams({
      chainId,
      type: currentType,
      skipCount: (pageIndex * PAGE_SIZE).toString(),
      maxResultCount: PAGE_SIZE.toString(),
    }).toString()}`
  );

  useEffect(() => {
    setSections([]);
    setCurrentType(type);
    setPageIndex(0);
  }, [type]);

  useEffect(() => {
    const { data: sectionList } = data || {};
    if (sectionList && Array.isArray(sectionList)) {
      setSections((prev) =>
        pageIndex === 0 ? sectionList : [...prev, ...sectionList]
      );
      setHasMore(sectionList?.length >= PAGE_SIZE);
    }
  }, [data, pageIndex]);

  useEffect(() => {
    if (scrollTop && scrollTop < 50 && hasMore && !isLoading) {
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }
  }, [hasMore, isLoading, scrollTop]);

  return (
    <div className="pt-3 pb-[100px]">
      {type === COMMUNITY_TYPE.CURRENT && (
        <button
          role="button"
          className="mb-[12px] w-full h-[40px] bg-primary text-white font-bold text-[14px] font-outfit rounded-[24px]"
          type="button"
          onClick={() =>
            navigate("/create-poll", {
              state: { from: "/?tab=2&vote_tab=Community&community=1" },
            })
          }
        >
          Create Poll
        </button>
      )}
      {sections?.map((vote, index) => (
        <VoteSection
          currentTab={currentTab}
          key={`${vote.proposalId}_${index}`}
          data={vote}
          className="mb-3"
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

export default Archived;
