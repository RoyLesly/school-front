"use client";

import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
const UsersForm = dynamic(() => import("./formsProfiles/UsersForm"), { loading: () => <h1>Loading...</h1>, });
const LecturersForm = dynamic(() => import("./formsProfiles/LecturersForm"), { loading: () => <h1>Loading...</h1>, });
const StudentsForm = dynamic(() => import("./formsProfiles/StudentsForm"), { loading: () => <h1>Loading...</h1>, });
const AdminsForm = dynamic(() => import("./formsProfiles/AdminsForm"), { loading: () => <h1>Loading...</h1>, });
const DomainForm = dynamic(() => import("./formSettings/DomainForm"), { loading: () => <MyLoadingModal />});
const FieldForm = dynamic(() => import("./formSettings/FieldForm"), { loading: () => <MyLoadingModal />});
const MainSpecialtyForm = dynamic(() => import("./formSettings/MainSpecialtyForm"), { loading: () => <MyLoadingModal />});
const SpecialtyForm = dynamic(() => import("./formSettings/SpecialtyForm"), { loading: () => <MyLoadingModal />});
const MainCourseForm = dynamic(() => import("./formSettings/MainCourseForm"), { loading: () => <MyLoadingModal />});
const CourseForm = dynamic(() => import("./formSettings/CourseForm"), { loading: () => <MyLoadingModal />});
const SysCategoryForm = dynamic(() => import("./formsAdmin/SysCategoryForm"), { loading: () => <MyLoadingModal />});
const SysConstantForm = dynamic(() => import("./formsAdmin/SysConstantForm"), { loading: () => <MyLoadingModal />});
const DepartmentForm = dynamic(() => import("./formsAdmin/DepartmentForm"), { loading: () => <MyLoadingModal />});
const AccountForm = dynamic(() => import("./formsAdmin/AccountForm"), { loading: () => <MyLoadingModal />});
const LevelForm = dynamic(() => import("./formSettings/LevelForm"), { loading: () => <MyLoadingModal />});
const ProgramForm = dynamic(() => import("./formSettings/ProgramForm"), { loading: () => <MyLoadingModal />});
const CreateFeePreselectForm = dynamic(() => import("./formAccounting/CreateFeePreselectForm"), { loading: () => <MyLoadingModal />});
const PayPlatFormChargeForm = dynamic(() => import("./formsAdmin/PayPlatFormChargeForm"), { loading: () => <MyLoadingModal />});
const PayFeesForm = dynamic(() => import("./formsAdmin/PayFeesForm"), { loading: () => <MyLoadingModal />});
const AssignStudentToSpecialtyForm = dynamic(() => import("./formsProfiles/AssignStudentToSpecialtyForm"), { loading: () => <MyLoadingModal />});


const forms: {
  [key: string]: (type: "create" | "update" | "delete" | "custom" | any, params: any, setOpen: any, data?: any, extra_data?: any ) => JSX.Element;
} = {
  users: (type, params, setOpen, data, extra_data) => <UsersForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  admins: (type, params, setOpen, data) => <AdminsForm type={type} data={data} params={params} setOpen={setOpen} />,
  lecturer: (type, params, setOpen, data) => <LecturersForm type={type} data={data} params={params} setOpen={setOpen} />,
  student: (type, params, setOpen, data, extra_data) => <StudentsForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  domain: (type, params, setOpen, data) => <DomainForm type={type} data={data} params={params} setOpen={setOpen} />,
  field: (type, params, setOpen, data) => <FieldForm type={type} data={data} params={params} setOpen={setOpen} />,
  main_specialty: (type, params, data, setOpen) => <MainSpecialtyForm type={type} data={data} params={params} setOpen={setOpen} />,
  specialty: (type, params, setOpen, data, extra_data) => <SpecialtyForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  main_course: (type, params, setOpen, data) => <MainCourseForm type={type} data={data} params={params} setOpen={setOpen} />,
  course: (type, params, setOpen, data, extra_data) => <CourseForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  level: (type, params, setOpen, data) => <LevelForm type={type} data={data} params={params} setOpen={setOpen} />,
  program: (type, params, setOpen, data) => <ProgramForm type={type} data={data} params={params} setOpen={setOpen} />,

  sys_category: (type, params, setOpen, data ) => <SysCategoryForm type={type} data={data} params={params} setOpen={setOpen} />,
  assign_student_to_specialty: (type, params, setOpen, data, extra_data ) => <AssignStudentToSpecialtyForm type={type} data={data} params={params} setOpen={setOpen} extra_data={extra_data} />,
  sys_constant: (type, params, setOpen, data ) => <SysConstantForm type={type} data={data} params={params} setOpen={setOpen} />,
  department: (type, params, setOpen, data ) => <DepartmentForm type={type} data={data} params={params} setOpen={setOpen} />,
  account: (type, params, setOpen, data ) => <AccountForm type={type} data={data} params={params} setOpen={setOpen} />,
  pay_fees: (type, params, setOpen, data, extra_data, ) => <PayFeesForm type={type} params={params} data={data} setOpen={setOpen} extra_data={extra_data} />,
  platform_charge: (type, params, setOpen, data, extra_data) => <PayPlatFormChargeForm type={type} params={params} setOpen={setOpen} data={data} extra_data={extra_data} />,
  create_fees_preselect: (type, data, params, setOpen) => <CreateFeePreselectForm apiDomains={data} params={params} setOpen={setOpen} />,
  // create_fees: (type, data, params, setOpen) => <CreateFeeForm data={data} type={type} params={params} setOpen={setOpen} />,
};

const FormModal = ({
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
    | "users"
    | "admins"
    | "lecturer"
    | "student"
    | "domain"
    | "field"
    | "main_course"
    | "course"
    | "main_specialty"
    | "specialty"
    | "level"
    | "program"
    | "pay_fees"
    | "transcript_application"

    | "assign_student_to_specialty"
    | "create_fees_preselect"
    | "create_fees"
    | "platform_charge"
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

export default FormModal;
