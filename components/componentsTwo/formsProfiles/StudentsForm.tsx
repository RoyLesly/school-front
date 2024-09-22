"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import SelectField from "../SelectField";
import { GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, handleResponseError } from "@/functions";
import { GetSpecialtyUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { ConfigData, protocol } from "@/config";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { CustomUserUrl, GetDepartmentUrl, UserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { GetDepartmentInter } from "@/Domain/Utils-S/userControl/userInter";
import Link from "next/link";
import { ActionCreate } from "@/serverActions/actionGeneral";
import { SchemaCreateEditCustomUser, SchemaCreateEditUserProfile } from "@/schemas-user";
import { useRouter } from "next/navigation";

// const schema = z.object({
//   username: z
//     .string()
//     .min(3, { message: "Username must be at least 3 characters long!" })
//     .max(20, { message: "Username must be at most 20 characters long!" }),
//   email: z.string().email({ message: "Invalid email address!" }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long!" }),
//   firstName: z.string().min(1, { message: "First name is required!" }),
//   lastName: z.string().min(1, { message: "Last name is required!" }),
//   phone: z.string().min(1, { message: "Phone is required!" }),
//   address: z.string().min(1, { message: "Address is required!" }),
//   bloodType: z.string().min(1, { message: "Blood Type is required!" }),
//   // birthday: z.date({ message: "Birthday is required!" }),
//   // sex: z.enum(["male", "female"], { message: "Sex is required!" }),
//   img: z.instanceof(File, { message: "Image is required" }),
// });

const SchemaCreate = z.object({
  first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  sex: z.enum(["Male", "Female"]),
  email: z.string().email(),
  telephone: z.coerce.number().int().gte(610000000).lte(699999999),
  address: z.string().optional(),
  pob: z.string().optional(),
  dob: z.string().optional(),
  parent_name: z.string().optional(),
  parent_telephone: z.coerce.number().int().gte(610000000).lte(699999999).optional(),

  domain_id: z.coerce.number().optional(),
  academic_year: z.string().optional(),
  level_id: z.coerce.number().optional(),
  specialty_id: z.coerce.number().int(),
  program_id: z.coerce.number().int(),
  session: z.enum(["Morning", "Evening"]),
})

type Inputs = z.infer<typeof SchemaCreate>;

const StudentsForm = ({
  type,
  data,
  params,
  setOpen,
  extra_data,
}: {
  type: "create" | "update" | "delete";
  params: any;
  setOpen: any;
  extra_data: any;
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const [clicked, setClicked] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[] | any>()
  const [selectedDomainID, setSelectedDomainID] = useState<number>(0)
  const [selectedLevelID, setSelectedLevelID] = useState<number>(0)
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [dept, setDept] = useState<GetDepartmentInter | any>();


  useEffect(() => {
    if (count == 0) {
      var getDept = async () => {
        var res = await getData(protocol + "api" + params.domain + GetDepartmentUrl, { name: "stud" })
        if (res) {
          if (res && res.count) { setDept(res.results) }
          else { setDept([]) };
        };
        setCount(1)
      }
      getDept();
    }
    if (count == 1) {
      if (selectedDomainID && selectedLevelID && selectedYear.length > 0) {
        const call = async () => {
          const response = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, {
            nopage: true, school_id: params.school_id,
            "main_specialty__field__domain__id": selectedDomainID, "level__id": selectedLevelID, "academic_year": selectedYear,
            fieldList: ["id", "main_specialty__specialty_name", "level__level", "academic_year"],
          })
          if (response && response.length) {
            setSpecialtyData(response)
          };
          setCount(3);
        }
        call()
      }
      setCount(3);
    }
  }, [count, params, selectedDomainID, selectedYear, selectedLevelID]);


  const onSubmit = handleSubmit((formVals) => {
    // setClicked(true);
    const newData = {
      username: formVals.first_name?.toString().toUpperCase(),
      first_name: formVals.first_name?.toString().toUpperCase(),
      last_name: formVals.last_name?.toString().toUpperCase(),
      full_name: formVals.first_name?.toString().toUpperCase() + " " + formVals.last_name?.toString().toUpperCase(),
      telephone: formVals.telephone,
      email: formVals.email,
      pob: formVals.pob,
      dob: formVals.dob,
      sex: formVals.sex,
      prefix: ConfigData[params.domain]["higher"].method + ConfigData[params.domain]["higher"].prefix,
      dept: [parseInt(dept[0].id)],
      school: [parseInt(params.school_id)],
      role: "student",
    }
    const newProfileData = {
      specialty_id: formVals.specialty_id,
      program_id: formVals.program_id,
      session: formVals.session,
    }
    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newData, SchemaCreateEditCustomUser, protocol + "api" + params.domain + CustomUserUrl)
        const t = await handleResponseError(response, ["username", "telephone", "email", "full_name", "dob"]);
        if (t == "" && response && response.id) {
          const response2 = await ActionCreate({ ...newProfileData, user_id: response.id }, SchemaCreateEditUserProfile, protocol + "api" + params.domain + UserProfileUrl)
          if (response2 && response2.id) {
            router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents?created="SUCCESSFULLY (${response.id}) !!!`);
            setOpen(false)
          }
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <>
      {dept ?
        dept.length ?
          <form className="Name Parent flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="font-semibold text-xl">Create a new student</h1>


            <div className={page == 0 ? "" : "hidden"}>
              <span className="font-medium text-gray-400 text-xs">
                Personal Information
              </span>
              <div className="flex gap-2 w-full">
                <InputField
                  label="First Name"
                  name="first_name"
                  defaultValue={data?.first_name}
                  register={register}
                  error={errors.first_name}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  defaultValue={data?.last_name}
                  register={register}
                  error={errors.last_name}
                />
              </div>
              <div className="flex gap-2 w-full">
                <InputField
                  label="Telephone"
                  name="telephone"
                  defaultValue={data?.telephone}
                  register={register}
                  error={errors.telephone}
                />
                <InputField
                  label="Address"
                  name="address"
                  defaultValue={data?.address}
                  register={register}
                  error={errors.address}
                />
              </div>
              <div className="flex gap-2 w-full">
                <SelectField
                  label="Gender"
                  name="sex"
                  defaultValue={data?.sex}
                  register={register}
                  error={errors?.sex}
                  data={["Male", "Female"]}
                />
                <InputField
                  label="Email"
                  name="email"
                  defaultValue={data?.email}
                  register={register}
                  error={errors?.email}
                />
              </div>
              <div className="flex gap-2 w-full">
                <InputField
                  label="Place Of Birth"
                  name="pob"
                  defaultValue={data?.pob}
                  register={register}
                  error={errors?.pob}
                />
                <InputField
                  label="Date of Birth"
                  name="dob"
                  defaultValue={data?.dob}
                  register={register}
                  error={errors.dob}
                  type="date"
                />
              </div>
              <div className="flex gap-2 w-full">
                <InputField
                  label="Parent Name"
                  name="parent_name"
                  defaultValue={data?.parent_name}
                  register={register}
                  error={errors?.parent_name}
                />
                <InputField
                  label="Parent Number"
                  name="parent_telephone"
                  defaultValue={data?.parent_telephone}
                  register={register}
                  error={errors.parent_telephone}
                  type="number"
                />
              </div>

              <div className="flex font-medium italic items-center justify-center mt-4 text-lg tracking-widest">
                <button onClick={() => setPage(1)} className="bg-blue-600 flex gap-2 items-center px-6 py-2 rounded-md text-white">
                  Next <FaArrowRight />
                </button>
              </div>

            </div>


            <div className={page == 1 ? "" : "hidden"}>
              <span className="font-medium text-gray-400 text-xs">
                Class Assignment
              </span>
              <div className="flex flex-wrap gap-4 justify-between">
                <SelectField
                  label="Domain"
                  name="domain_id"
                  register={register}
                  error={errors?.domain_id}
                  data={extra_data[0]}
                  display={{ "name": "domain_name", value: "id" }}
                  functions={[setCount, setSelectedDomainID, 1]}
                />
              </div>

              <div className="flex flex-row gap-2 justify-between md:gap-4 w-full">
                {selectedDomainID ? <div className="flex flex-wrap gap-4 justify-between w-full">
                  <SelectField
                    label="Year"
                    name="academic_year"
                    register={register}
                    error={errors?.academic_year}
                    data={[`${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`]}
                    functions={[setCount, setSelectedYear, 1]}
                  />
                </div> : <></>}

                {selectedYear ? <div className="flex flex-wrap gap-4 justify-between w-full">
                  <SelectField
                    label="Level"
                    name="level_id"
                    register={register}
                    error={errors?.level_id}
                    data={extra_data[1]}
                    display={{ "name": "level", value: "id" }}
                    functions={[setCount, setSelectedLevelID, 1]}
                  />
                </div>
                  :
                  <></>}
              </div>

              {specialtyData ? <div className="flex flex-wrap gap-4 justify-between w-full">
                <SelectField
                  label="Class"
                  name="specialty_id"
                  register={register}
                  error={errors?.specialty_id}
                  data={specialtyData}
                  display={{ "name": "main_specialty__specialty_name", value: "id" }}
                // functions={[setCount, setSelectedSpecialty, 3]}
                />
                <SelectField
                  label="Program"
                  name="program_id"
                  register={register}
                  error={errors?.program_id}
                  data={extra_data[2].results}
                  display={{ "name": "name", value: "id" }}
                />
                <SelectField
                  label="Session"
                  name="session"
                  defaultValue={data?.session}
                  register={register}
                  error={errors?.session}
                  data={["Morning", "Evening"]}
                />
              </div> : <></>}

              <div className="flex gap-2 w-full">


              </div>

              <div className="flex font-medium items-center justify-between mt-4 tracking-widest">
                <button onClick={() => setPage(0)} className="bg-red flex gap-2 items-center px-6 py-2 rounded-md text-white">
                  <FaArrowLeft /> Back
                </button>

                <MyButtonModal type={type} clicked={clicked} />

              </div>


            </div>
          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>No Student Department</div>
            <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Department`} className="border px-6 py-2 rounded">Goto Departments</Link>
          </div>
        :
        <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
          <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        </div>

      }
    </>
  );
};

export default StudentsForm;
