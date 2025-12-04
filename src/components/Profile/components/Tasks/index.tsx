import { useEffect, useState } from "react";

import { mutate } from "swr";

import InviteFriendsStatus from "@/components/InviteFriends";
import TaskModule from "@/components/TaskModule";
import { chainId } from "@/constants/app";
import { TAB_LIST } from "@/constants/navigation";
import useData from "@/hooks/useData";
import { InviteDetail, TaskModule as TaskModuleType } from "@/types/task";
interface ITasksProps {
  totalPoints: number;
  switchTab: (tab: TAB_LIST) => void;
  onReward(points?: number): void;
}

const Tasks = ({ totalPoints, switchTab, onReward }: ITasksProps) => {
  const [tasks, setTasks] = useState<TaskModuleType[]>([]);
  const [inviteInfo, setInviteInfo] = useState<InviteDetail>();
  const [showShare, setShowShare] = useState(false);

  const { data } = useData(`/api/app/user/task-list?chainId=${chainId}`);

  const { data: inviteDetail } = useData(
    `/api/app/referral/invite-detail?chainId=${chainId}`
  );

  useEffect(() => {
    if (inviteDetail) {
      setInviteInfo(inviteDetail);
    }
  }, [inviteDetail]);

  useEffect(() => {
    const { taskList } = data || {};
    if (taskList && Array.isArray(taskList)) {
      setTasks(taskList);
    }
  }, [data, tasks]);

  const refresh = (points?: number) => {
    mutate(`/api/app/user/task-list?chainId=${chainId}`);
    if (points) {
      onReward(points);
    }
  };

  return (
    <>
      <InviteFriendsStatus
        data={inviteInfo}
        isShowDrawer={showShare}
        onClickInvite={() => setShowShare(!showShare)}
      />

      {tasks.map(({ data, userTask }: TaskModuleType, index: number) => (
        <TaskModule
          data={data}
          title={userTask}
          totalPoints={totalPoints}
          switchTab={switchTab}
          toInvite={() => setShowShare(true)}
          refresh={refresh}
          description={index === 0 ? "Complete quests to earn rewards!" : ""}
          key={`${userTask}_${index}`}
        />
      ))}
    </>
  );
};

export default Tasks;
