"use client";

import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
// const TeacherForm = dynamic(() => import("./forms/TeacherForm"), { loading: () => <h1>Loading...</h1>, });
const DomainForm = dynamic(() => import("./formSettings/DomainForm"), { loading: () => <MyLoadingModal />});
const FieldForm = dynamic(() => import("./formSettings/FieldForm"), { loading: () => <MyLoadingModal />});
const MainSpecialtyForm = dynamic(() => import("./formSettings/MainSpecialtyForm"), { loading: () => <MyLoadingModal />});
const SpecialtyForm = dynamic(() => import("./formSettings/SpecialtyForm"), { loading: () => <MyLoadingModal />});
const MainCourseForm = dynamic(() => import("./formSettings/MainCourseForm"), { loading: () => <MyLoadingModal />});
const CourseForm = dynamic(() => import("./formSettings/CourseForm"), { loading: () => <MyLoadingModal />});
const SysCategoryForm = dynamic(() => import("./forms/SysCategoryForm"), { loading: () => <MyLoadingModal />});
const SysConstantForm = dynamic(() => import("./forms/SysConstantForm"), { loading: () => <MyLoadingModal />});
const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), { loading: () => <MyLoadingModal />});
const AccountForm = dynamic(() => import("./forms/AccountForm"), { loading: () => <MyLoadingModal />});
const PendingPlatformForm = dynamic(() => import("./forms/PendingPlatformForm"), { loading: () => <MyLoadingModal />});
const LevelForm = dynamic(() => import("./formSettings/LevelForm"), { loading: () => <MyLoadingModal />});
const ProgramForm = dynamic(() => import("./formSettings/ProgramForm"), { loading: () => <MyLoadingModal />});
const CreateFeePreselectForm = dynamic(() => import("./formAccounting/CreateFeePreselectForm"), { loading: () => <MyLoadingModal />});
const CreateFeeForm = dynamic(() => import("./formAccounting/CreateFeeForm"), { loading: () => <MyLoadingModal />});


const forms: {
  [key: string]: (type: "create" | "update" | "delete", params: any, setOpen: any, data?: any) => JSX.Element;
} = {
  domain: (type, data, params, setOpen) => <DomainForm type={type} data={data} params={params} setOpen={setOpen} />,
  field: (type, data, params, setOpen) => <FieldForm type={type} data={data} params={params} setOpen={setOpen} />,
  main_specialty: (type, data, params, setOpen) => <MainSpecialtyForm type={type} data={data} params={params} setOpen={setOpen} />,
  specialty: (type, data, params, setOpen) => <SpecialtyForm type={type} data={data} params={params} setOpen={setOpen} />,
  main_course: (type, data, params, setOpen) => <MainCourseForm type={type} data={data} params={params} setOpen={setOpen} />,
  course: (type, data, params, setOpen) => <CourseForm type={type} data={data} params={params} setOpen={setOpen} />,
  level: (type, data, params, setOpen) => <LevelForm type={type} data={data} params={params} setOpen={setOpen} />,
  program: (type, data, params, setOpen) => <ProgramForm type={type} data={data} params={params} setOpen={setOpen} />,

  sys_category: (type, data, params, setOpen) => <SysCategoryForm type={type} data={data} params={params} setOpen={setOpen} />,
  sys_constant: (type, data, params, setOpen) => <SysConstantForm type={type} data={data} params={params} setOpen={setOpen} />,
  department: (type, data, params, setOpen) => <DepartmentForm type={type} data={data} params={params} setOpen={setOpen} />,
  account: (type, data, params, setOpen) => <AccountForm type={type} data={data} params={params} setOpen={setOpen} />,
  pending_activation: (type, data, params, setOpen) => <PendingPlatformForm type={type} data={data} params={params} setOpen={setOpen} />,

  create_fees_preselect: (type, data, params, setOpen) => <CreateFeePreselectForm apiDomains={data} params={params} setOpen={setOpen} />,
  create_fees: (type, data, params, setOpen) => <CreateFeeForm data={data} type={type} params={params} setOpen={setOpen} />,
//   teacher: (type, data) => <TeacherForm type={type} data={data} onSubmit={onsubmit} />,
//   student: (type, data) => <StudentForm type={type} data={data} onSubmit={onsubmit} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  icon,
  params,
}: {
  table:
    | "domain"
    | "field"
    | "main_course"
    | "course"
    | "main_specialty"
    | "specialty"
    | "level"
    | "program"

    |"create_fees_preselect"
    |"create_fees"
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "announcement"
    | "pending_activation"
    | "department"
    | "account"
    | "sys_category"
    | "sys_constant";
  type: "create" | "update" | "delete";
  icon: React.ReactNode;
  params?: any;
  data?: any;
  id?: number;
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
    return type === "create" || type === "update" || type === "delete" ? (
      forms[table](type, data, params, setOpen)
    ) : (
      <div>Form not found!</div>
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        {icon}
      </button>
      {open && (
        <div className="absolute bg-black bg-opacity-60 flex h-screen items-center justify-center left-0 top-0 w-full z-50">
          <div className="bg-white m-20 md:w-[60%] mx-auto p-4 relative rounded-md sm:w-[75%] w-[90%] xl:w-[45%]">
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

export default FormModal;
