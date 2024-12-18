import { useState } from "react";
import BackBtn from "@/components/BackBtn";
import FormItem from "@/components/FormItem";
import Input from "@/components/Input";
import InputGroup from "@/components/InputGroup";
import SimpleDatePicker from "@/components/SimpleDatePicker";
import SimpleTimePicker from "@/components/SimpleTimePicker";
import ToggleSlider from "@/components/ToggleSlider";
import { DURATION_RANGE } from "@/constants/time-picker";
import ButtonRadio from "@/components/ButtonRadio";
import Upload from "@/components/Upload";
import useForm from "@/hooks/useForm";
import { VoteOption } from "@/components/InputGroup/type";
import dayjs from "dayjs";
import { ProposalType, VoteTimeItem } from "@/types/app";
import { fetchWithToken, postWithToken } from "@/hooks/useData";
import { chainId } from "@/constants/app";
import { combineDateAndTime, formmatDescription, getProposalTimeParams } from "./utils";
import { proposalCreateContractRequest } from "@/contract/proposalCreateContract";
import { useConfig } from "@/provider/types/ConfigContext";
import Drawer from "@/components/Drawer";

const rules = {
  proposalTitle: [
    (value: string) => (!value ? "Please Enter Topic" : undefined),
  ],
  options: [
    (ops: VoteOption[]) =>
      ops.length === 0
        ? "Please add an option"
        : ops.length < 2
        ? "Please add at least two options"
        : undefined,
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
  const { communityDaoId } = useConfig() ?? {};

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
    console.log("Form submitted successfully", formState);
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
      console.log(saveRes, voteSchemeListRes, governanceMechanismListRes);
      const appAlias = saveRes?.data ?? [];
      if (!appAlias.length) {
        throw new Error("Failed to create proposal, save options failed");
      }
      const formmatDescriptionStr = formmatDescription(
        appAlias,
        formState.banner
      );
      if (formmatDescriptionStr.length > 256) {
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
        proposalDescription: formmatDescriptionStr,
        daoId: communityDaoId,
        voteSchemeId,
        schemeAddress,
      };
      const contractParams = {
        proposalType: ProposalType.ADVISORY,
        proposalBasicInfo: proposalBasicInfo,
      };
      await proposalCreateContractRequest(methodName, contractParams);
    } catch (err) {
      console.error(err);
      // const error = err as IFormValidateError | IContractError;
      // // form Error
      // if (typeof error === "object" && "errorFields" in error) {
      //   formValidateScrollFirstError(form, error);
      //   return;
      // }
      // loadingModalRef.current?.close();
      // submitModalRef.current?.open();
      // const msg =
      //   (error?.errorMessage?.message || error?.message || err?.toString()) ??
      //   "Unknown error";
      // // showErrorModal('Error', msg);
      // setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-[23px] pb-[27px] px-[20px]">
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
            showClearBtn
          />
        </FormItem>

        <FormItem label="Banner" className="mb-2">
          <Upload className="">
            <i className="votigram-icon-back text-[24px]" />
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
            onChange={(index) =>
              handleChange("activeStartTime")(index ? dayjs().unix() * 1000 : 1)
            }
          />
          {formState?.activeStartTime !== 1 && (
            <div className="flex flex-row items-center gap-[9px] mt-[12px]">
              <SimpleDatePicker
                className="flex-1"
                value={dayjs(formState.activeStartTime).format("YYYY-MM-DD")}
                onChange={(day) => handleChange("activeStartTime")(
                  combineDateAndTime(day, formState.activeStartTime)
                )}
              />
              <SimpleTimePicker
                className="flex-1"
                value={formState.activeStartTime}
                onChange={(time) => handleChange("activeStartTime")(
                  combineDateAndTime(formState.activeStartTime, time)
                )}
              />
            </div>
          )}
        </FormItem>

        <FormItem label="Poll End Time" required>
          <ToggleSlider
            items={["Duration", "Specific date & time"]}
            onChange={(index) =>
              handleChange("activeEndTime")(
                index ? dayjs().unix() * 1000 : defaultEndTime
              )
            }
          />
          {typeof formState.activeEndTime !== "number" ? (
            <ButtonRadio
              className="mt-[12px]"
              options={DURATION_RANGE}
              value={formState.activeEndTime}
              onChange={(endTime) => handleChange('activeEndTime')(
                endTime as VoteTimeItem
              )}
            />
          ) : (
            <div className="flex flex-row items-center flex-wrap gap-[9px] mt-[12px]">
              <SimpleDatePicker
                className="flex-1"
                defaultVulue={dayjs().add(1, "day").format()}
                onChange={handleChange("activeEndTime")}
              />
              <SimpleTimePicker className="flex-1" />
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
    </div>
  );
};

export default CreatePoll;
