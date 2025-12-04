
import { TAB_LIST } from "@/constants/navigation";
import { USER_TASK_TITLE, USER_TASK_TITLE_MAP } from "@/constants/task";
import { TaskInfo } from "@/types/task";

import TaskItem from "./components/TaskItem";


interface ITaskModuleProps {
  title: USER_TASK_TITLE;
  description?: string;
  data: TaskInfo[];
  totalPoints: number;
  switchTab: (tab: TAB_LIST) => void;
  toInvite(): void;
  refresh?(points?: number): void;
}

const TaskModule = ({
  title,
  description,
  data,
  totalPoints,
  switchTab,
  toInvite,
  refresh,
}: ITaskModuleProps) => {
  return (
    <div className="my-[14px]">
      <div className="mb-[14px]">
        <span className="block font-bold text-[18px] leading-[18px] text-white font-outfit">
          {USER_TASK_TITLE_MAP[title]}
        </span>
        {description && (
          <span className="block mt-[6px] text-white font-normal text-[14px] leading-[16px]">
            {description}
          </span>
        )}
      </div>

      {data?.map((task: TaskInfo) => (
        <TaskItem
          data={task}
          key={task.userTaskDetail}
          userTask={title}
          totalPoints={totalPoints}
          switchTab={switchTab}
          toInvite={toInvite}
          refresh={refresh}
        />
      ))}
    </div>
  );
};

export default TaskModule;
