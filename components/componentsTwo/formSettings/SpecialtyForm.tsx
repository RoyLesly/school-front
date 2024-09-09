"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { ConfigData, protocol } from "@/config";
import { useRouter } from "next/navigation";
import { SpecialtyUrl, GetMainSpecialtyUrl, AcademicYearUrl, GetLevelUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { useEffect, useState } from "react";
import { GetLevelInter, GetMainSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData } from "@/functions";
import SelectField from "../SelectField";
import { SchemaCreateEditSpecialty } from "@/Domain/schemas/schemas";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";

type Inputs = z.infer<typeof SchemaCreateEditSpecialty>;

const SpecialtyForm = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditSpecialty),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  const [mainSpecialtyData, setmainSpecialtyData] = useState<GetMainSpecialtyInter[] | any>()
  const [yearData, setYearData] = useState<string[] | any>()
  const [levelData, setLevelData] = useState<GetLevelInter[] | any>()

  useEffect(() => {
    if (count == 0) {
      const call = async () => {
        const response = await getData(protocol + "api" + params.domain + GetMainSpecialtyUrl, { nopage: true, fieldList: ["id", "specialty_name"] })
        const responseLevel = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true, fieldList: ["id", "level"] })
        const responseYear = await getData(protocol + "api" + params.domain + AcademicYearUrl, { nopage: true })
        if (response && response.length) {
          if (type != "create" && data) {
            setmainSpecialtyData(response.filter((item: GetMainSpecialtyInter) => item.specialty_name != data.main_specialty__main_specialty_name))
          } else {
            setmainSpecialtyData(response)
          }
          if (responseLevel) { setLevelData(responseLevel) }
          if (responseYear) { setYearData(responseYear.results) }
        }
        setCount(1)

      }
      call()
    }
  }, [count, params, data, type])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      school_id: params.school_id,
      main_specialty_id: formVals.main_specialty_id,
      level_id: formVals.level_id,
      academic_year: formVals.academic_year,
      tuition: formVals.tuition,
      registration: formVals.registration,
      payment_one: formVals.payment_one,
      payment_two: formVals.payment_two,
      payment_three: formVals.payment_three,
    }

    console.log(newVals)
    // return


    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditSpecialty, protocol + "api" + params.domain + SpecialtyUrl)
        console.log(response)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditSpecialty, protocol + "api" + params.domain + SpecialtyUrl)
        console.log(response)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + SpecialtyUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Class</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Class</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Class</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <SelectField
          label="Class Title"
          name="main_specialty_id"
          defaultValue={data?.main_specialty__id}
          defaultName={data?.main_specialty__specialty_name}
          register={register}
          error={errors?.main_specialty_id}
          data={mainSpecialtyData}
          display={{ "name": "specialty_name", value: "id" }}
        />
      </div>


      <div className="flex flex-row gap-2 md:gap-4">
        <div className="flex flex-wrap gap-4 justify-between w-full">
          <SelectField
            label="Academic Year"
            name="academic_year"
            defaultValue={data?.academic_year}
            defaultName={data?.academic_year}
            register={register}
            error={errors?.academic_year}
            data={yearData}
          // display={{ "name": "specialty_name", value: "id" }}
          />
        </div>
        <div className="flex flex-wrap gap-4 justify-between w-full">
          <SelectField
            label="Level"
            name="level_id"
            defaultValue={data?.level__id}
            defaultName={data?.level__level}
            register={register}
            error={errors?.level_id}
            data={levelData}
            display={{ "name": "level", value: "id" }}
            type="number"
          />
        </div>
      </div>
       
      <div className="flex gap-2">
        <div className="flex flex-wrap gap-4 justify-between w-full">
          <InputField
            label="Tuition"
            name="tuition"
            defaultValue={data?.tuition}
            register={register}
            error={errors?.tuition}
            type="number"
          />
        </div>
      </div>

      <div>
        <div className={`gap-2 ${ConfigData[`${params.domain}`]["higher"].registration_seperate_tuition ? "grid grid-cols-2": "flex flex-row "}`}>
        {ConfigData[`${params.domain}`]["higher"].registration_seperate_tuition && <div className="flex flex-wrap gap-4 justify-between w-full">
            <InputField
              label="Registration"
              name="registration"
              defaultValue={data?.registration}
              register={register}
              error={errors?.registration}
              type="number"
            />
          </div>}
          <div className="flex flex-wrap gap-4 justify-between w-full">
            <InputField
              label="1st Installment"
              name="payment_one"
              defaultValue={data?.payment_one}
              register={register}
              error={errors?.payment_one}
              type="number"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-between w-full">
            <InputField
              label="2nd Installment"
              name="payment_two"
              defaultValue={data?.payment_two}
              register={register}
              error={errors?.payment_two}
              type="number"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-between w-full">
            <InputField
              label="3rd Installment"
              name="payment_three"
              defaultValue={data?.payment_three}
              register={register}
              error={errors?.payment_three}
              type="number"
            />
          </div>

        </div>
      </div>



      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default SpecialtyForm;
