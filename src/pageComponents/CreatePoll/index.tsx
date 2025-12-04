import { useState } from "react";

import clsx from "clsx";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

import BackBtn from "@/components/BackBtn";
import ButtonRadio from "@/components/ButtonRadio";
import Drawer from "@/components/Drawer";
import FormItem from "@/components/FormItem";
import Input from "@/components/Input";
import InputGroup from "@/components/InputGroup";
import { VoteOption } from "@/components/InputGroup/type";
import SimpleDatePicker from "@/components/SimpleDatePicker";
import SimpleTimePicker from "@/components/SimpleTimePicker";
import TelegramHeader from "@/components/TelegramHeader";
import ToggleSlider from "@/components/ToggleSlider";
import Upload from "@/components/Upload";
import { chainId, ProposalType } from "@/constants/app";
import { DURATION_RANGE } from "@/constants/time-picker";
import { CREATE_STATUS } from "@/constants/vote";
import { proposalCreateContractRequest } from "@/contract/proposalCreateContract";
import { fetchWithToken, postWithToken } from "@/hooks/useData";
import useForm from "@/hooks/useForm";
import { useUserContext } from "@/provider/UserProvider";
import { VoteTimeItem } from "@/types/app";

import {
  combineDateAndTime,
  formmatDescription,
  getProposalTimeParams,
} from "./utils";

const rules = {
  proposalTitle: [
    (value: string) => (!value ? "Please Enter Topic" : undefined),
  ],
  options: [
    (ops: VoteOption[]) =>
      ops.length === 0 ? "Please add an option" : undefined,

    (ops: VoteOption[]) =>
      ops.length < 2 ? "Please add at least two options" : undefined,
    (ops: VoteOption[]) =>
      ops.filter((op) => !op.title).length > 0
        ? "Kindly ensure it's not left empty"
        : undefined,
  ],
};

type FormStateProps = {
  proposalTitle: string;
  options: VoteOption[];
  banner?: string;
  activeStartTime: number;
  activeEndTime: number | VoteTimeItem;
};

const defaultEndTime: VoteTimeItem = {
  label: "1 Hour",
  unit: "hour",
  value: 1,
};

const CreatePoll = () => {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState<CREATE_STATUS>(
    CREATE_STATUS.PENDING
  );
  const navigate = useNavigate();
  const location = useLocation();

  const { cmsData } = useUserContext();
  const { communityDaoId } = cmsData || {};

  const initialFormState: FormStateProps = {
    proposalTitle: "",
    options: [{ id: Date.now(), title: "" }],
    activeStartTime: 1,
    activeEndTime: defaultEndTime,
  };
  const { formState, errors, handleChange, handleSubmit } = useForm(
    initialFormState,
    rules
  );

  const onSubmit = async () => {
    try {
      const saveReqApps: VoteOption[] = formState.options.map((item) => ({
        ...item,
        sourceType: 1,
      }));
      if (formState.banner) {
        saveReqApps.push({
          title: "TomorrowDaoBanner",
          icon: formState.banner,
          sourceType: 1,
        });
      }
      setLoading(true);
      const [saveRes, voteSchemeListRes, governanceMechanismListRes] =
        await Promise.all([
          postWithToken("/api/app/telegram/save", {
            chainId,
            apps: saveReqApps,
          }),
          fetchWithToken(
            `/api/app/vote/vote-scheme-list?${new URLSearchParams({
              chainId,
              daoId: communityDaoId ?? "",
            }).toString()}`
          ),
          fetchWithToken(
            `/api/app/governance/list?${new URLSearchParams({
              chainId,
              daoId: communityDaoId ?? "",
            }).toString()}`
          ),
        ]);
      const appAlias = saveRes?.data ?? [];
      if (!appAlias.length) {
        throw new Error("Failed to create proposal, save options failed");
      }
      const formatDescriptionStr = formmatDescription(
        appAlias,
        formState.banner
      );
      if (formatDescriptionStr.length > 256) {
        throw new Error(
          "Too many options have been added, or the option names are too long. Please simplify the options and try again."
        );
      }
      const voteSchemeId = voteSchemeListRes?.voteSchemeList?.[0]?.voteSchemeId;
      const schemeAddress =
        governanceMechanismListRes?.data?.[0]?.schemeAddress;
      if (!voteSchemeId) {
        throw new Error("The voting scheme for this DAO cannot be found");
      }
      if (!schemeAddress) {
        throw new Error(
          "The voting scheme address for this DAO cannot be found"
        );
      }
      const methodName = "CreateProposal";
      const timeParams = getProposalTimeParams(
        formState.activeStartTime,
        formState.activeEndTime
      );
      const proposalBasicInfo = {
        proposalTitle: formState.proposalTitle,
        ...timeParams,
        proposalDescription: formatDescriptionStr,
        daoId: communityDaoId,
        voteSchemeId,
        schemeAddress,
      };
      const contractParams = {
        proposalType: ProposalType.ADVISORY,
        proposalBasicInfo: proposalBasicInfo,
      };
      await proposalCreateContractRequest(methodName, contractParams);
      setLoading(false);
      setFinished(CREATE_STATUS.SUCCESS);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setFinished(CREATE_STATUS.FAILED);
    }
  };

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state?.from, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const handleFinish = () => {
    if (finished === CREATE_STATUS.FAILED) {
      setFinished(CREATE_STATUS.PENDING);
      onSubmit();
    } else {
      handleGoBack();
    }
  };

  return (
    <>
      <TelegramHeader title="Create Poll" />
      <div className="pt-telegramHeader bg-black h-screen pt-[23px] pb-[27px] px-[20px] overflow-y-auto">
        <BackBtn />

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label="Topic"
            className="mb-2"
            errorText={errors.proposalTitle}
            required
          >
            <Input
              onChange={handleChange("proposalTitle")}
              value={formState.proposalTitle}
              maxLength={50}
              showClearBtn
            />
          </FormItem>

          <FormItem label="Banner" className="mb-2">
            <Upload onFinish={handleChange("banner")} needCrop aspect={3 / 1}>
              <i className="votigram-icon-upload text-[24px] text-white" />
              <span className="block text-[13px] leading-[15.6px] text-white text-center">
                Upload
              </span>
              <span className="mt-1 block text-center text-[11px] text-input-placeholder leading-[13.2px] whitespace-pre-wrap">{`Formats supported: PNG, JPG, JPEG\nRatio: 3:1 , less than 1 MB`}</span>
            </Upload>
          </FormItem>

          <FormItem
            label="Options"
            className="mb-2"
            errorText={errors.options}
            desc="Minimum of two different options"
            required
          >
            <InputGroup
              value={formState.options}
              onChange={handleChange("options")}
            />
          </FormItem>

          <FormItem label="Poll Start Time" className="mb-2" required>
            <ToggleSlider
              items={["Now", "Specific date & time"]}
              itemClassName="h-[33px]"
              activeItemClassName="h-[26px]"
              onChange={(index) =>
                handleChange("activeStartTime")(
                  index ? dayjs().add(1, "day").unix() * 1000 : 1
                )
              }
            />
            {formState?.activeStartTime !== 1 && (
              <div className="flex flex-row items-center gap-[9px] mt-[12px]">
                <SimpleDatePicker
                  className="flex-1"
                  value={dayjs(formState.activeStartTime).format("YYYY-MM-DD")}
                  disabled={{
                    before: dayjs().add(1, "day").toDate(),
                  }}
                  onChange={(day) => {
                    handleChange("activeStartTime")(
                      combineDateAndTime(
                        dayjs(day).format(),
                        formState.activeStartTime
                      )
                    );
                    if (typeof formState.activeEndTime !== "object") {
                      handleChange("activeEndTime")(
                        combineDateAndTime(
                          dayjs(day).add(1, "day").format(),
                          formState.activeStartTime
                        )
                      );
                    }
                  }}
                />
                <SimpleTimePicker
                  className="flex-1"
                  value={formState.activeStartTime}
                  onChange={(time) =>
                    handleChange("activeStartTime")(
                      combineDateAndTime(formState.activeStartTime, time)
                    )
                  }
                />
              </div>
            )}
          </FormItem>

          <FormItem label="Poll End Time" required>
            <ToggleSlider
              items={["Duration", "Specific date & time"]}
              itemClassName="h-[33px]"
              activeItemClassName="h-[26px]"
              onChange={(index) =>
                handleChange("activeEndTime")(
                  index
                    ? formState?.activeStartTime === 1
                      ? dayjs().add(1, "day").valueOf()
                      : dayjs(formState.activeStartTime).add(1, "day").valueOf()
                    : defaultEndTime
                )
              }
            />
            {typeof formState.activeEndTime === "object" ? (
              <ButtonRadio
                className="mt-[12px]"
                options={DURATION_RANGE}
                value={formState.activeEndTime}
                onChange={(endTime) =>
                  handleChange("activeEndTime")(endTime as VoteTimeItem)
                }
              />
            ) : (
              <div className="flex flex-row items-center flex-wrap gap-[9px] mt-[12px]">
                <SimpleDatePicker
                  className="flex-1"
                  disabled={{
                    before:
                      formState?.activeStartTime === 1
                        ? dayjs().add(1, "day").toDate()
                        : dayjs(formState.activeStartTime)
                            .add(1, "day")
                            .toDate(),
                  }}
                  value={dayjs(formState.activeEndTime).format()}
                  onChange={(day) =>
                    handleChange("activeEndTime")(
                      combineDateAndTime(day, formState.activeEndTime as number)
                    )
                  }
                />
                <SimpleTimePicker
                  className="flex-1"
                  value={formState.activeEndTime}
                  onChange={(time) =>
                    handleChange("activeEndTime")(
                      combineDateAndTime(
                        formState.activeEndTime as number,
                        time
                      )
                    )
                  }
                />
              </div>
            )}
          </FormItem>
          <button
            className="mt-[21px] w-full h-[40px] bg-primary text-white font-bold text-[14px] font-outfit rounded-[24px]"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
      <Drawer
        isVisible={loading}
        direction="bottom"
        canClose={false}
        rootClassName="pt-[34px] pb-[40px] bg-tertiary"
      >
        <span className="block mb-[29px] text-[18px] font-outfit font-bold leading-[18px] text-center text-white">
          Creating Poll
        </span>
        <img
          className="mx-auto w-[236px] h-[208px] object-contain"
          src="https://cdn.tmrwdao.com/votigram/assets/imgs/AAF09912A14F.webp"
          alt="Creating"
        />
        <span className="block mt-[28px] text-center text-white whitespace-pre-wrap text-[14px] leading-[16.8px]">{`Your poll is currently being \nregistered on the blockchain.`}</span>
      </Drawer>

      <Drawer
        isVisible={
          finished === CREATE_STATUS.SUCCESS ||
          finished === CREATE_STATUS.FAILED
        }
        direction="bottom"
        rootClassName="pt-[34px] pb-[23px] px-5 bg-tertiary"
        onClose={() => setFinished(CREATE_STATUS.PENDING)}
        canClose={finished === CREATE_STATUS.FAILED}
      >
        <span className="block mb-[40px] text-[18px] font-outfit font-bold leading-[18px] text-center text-white">
          {finished === CREATE_STATUS.SUCCESS ? "Success" : "Please Try Again"}
        </span>
        <img
          className="mx-auto w-[140px] h-[87px] object-contain"
          src={
            finished === CREATE_STATUS.SUCCESS
              ? "https://cdn.tmrwdao.com/votigram/assets/imgs/2152F71B721C.webp"
              : "https://cdn.tmrwdao.com/votigram/assets/imgs/FEBC32940EB3.webp"
          }
          alt="Creating"
        />
        <span className="block mt-[26px] text-center text-white whitespace-pre-wrap text-[14px] leading-[16.8px]">
          {finished === CREATE_STATUS.SUCCESS
            ? `Your poll has been successfully \nregistered on the blockchain.`
            : `We encountered an error registering \nyour poll on the blockchain. `}
        </span>
        <button
          className={clsx(
            "mt-[37px] w-full h-[40px] bg-primary text-white font-bold text-[14px] font-outfit rounded-[24px]",
            {
              "bg-danger": finished === CREATE_STATUS.FAILED,
            }
          )}
          type="button"
          onClick={handleFinish}
        >
          {finished === CREATE_STATUS.SUCCESS ? "Continue" : "Try Again"}
        </button>
      </Drawer>
    </>
  );
};

export default CreatePoll;
