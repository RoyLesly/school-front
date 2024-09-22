"use client";
import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
const ConfirmTranscriptApply = dynamic(() => import("./messageForms/ConfirmTranscriptApply"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptApprove = dynamic(() => import("./messageForms/ConfirmTranscriptApprove"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptPreview = dynamic(() => import("./messageForms/ConfirmTranscriptPreview"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptPrint = dynamic(() => import("./messageForms/ConfirmTranscriptPrint"), { loading: () => <MyLoadingModal />, });
const ResultSlip = dynamic(() => import("./messageForms/ResultSlip"), { loading: () => <MyLoadingModal />, });

const forms: {
  [key: string]: (type: "create" | "update" | "delete" | "custom" | any, params: any, setOpen: any, data?: any, extra_data?: any ) => JSX.Element;
} = {
  confirm_apply_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptApply type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_approve_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptApprove type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_preview_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptPreview type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_print_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptPrint type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  result_slip: (type, params, setOpen, data, extra_data) => <ResultSlip type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
};

const MessageModal = ({
  table,
  type,
  data,
  extra_data,
  icon,
  params,
  buttonTitle,
  customClassName,
  formClassName,
}: {
  table:
    | "confirm_apply_transcript"
    | "confirm_approve_transcript"
    | "confirm_preview_transcript"
    | "confirm_print_transcript"
    | "result_slip"

  type: "create" | "update" | "delete" | "custom" | "custom";
  icon: React.ReactNode;
  params?: any;
  buttonTitle?: string;
  customClassName?: string;
  data?: any;
  extra_data?: any;
  id?: number;
  formClassName?: string;
}) => {
  const size = type === "create" ? "md:w-10 md:h-10 w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-green-400"
      : type === "update"
      ? "bg-blue-400"
      : "bg-red";

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "create" || type === "update" || type === "delete" || type === "custom" ? (
      forms[table](type, params, setOpen, data, extra_data)
    ) : (
      <div>Form not found!</div>
    );
  };

  return (
    <>
    
    <span
        className={` ${type === "custom" ? customClassName : `${size} ${bgColor} flex rounded-full` } items-center justify-center `}
        onClick={() => setOpen(true)}
      >
        {buttonTitle} 
        {icon}
      </span>
      {open && (
        <div className="absolute bg-black bg-opacity-60 flex h-screen items-center justify-center left-0 top-0 w-full z-50">
          <div className={`${formClassName ? formClassName : "bg-white m-20 md:w-[60%] sm:w-[75%] w-[90%] xl:w-[45%]"}  mx-auto p-4 relative rounded-md `}>
            <Form />
            <div
              className="absolute cursor-pointer right-4 top-4"
              onClick={() => setOpen(false)}
            >
              <Image src="/icons/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageModal;
