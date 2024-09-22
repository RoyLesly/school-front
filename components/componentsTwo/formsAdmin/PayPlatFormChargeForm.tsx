"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionCreate } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { getData, handleResponseError } from "@/functions";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetSchoolFeesUrl, TransactionUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { GetSchoolFeesInter, SchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { SchemaTransactionCreate } from "@/Domain/schemas/schemas";
import { collectMoney } from "@/payment";
import SelectField from "../SelectField";
import InputField from "../InputField";
import { useFormState, useFormStatus } from "react-dom";
import { makePayment } from "@/serverActions/formActions";

const SchemaCreate = z.object({
  amount: z.coerce.number().int().gte(1000).lte(1000000),
  operator: z.enum(["MTN MONEY", "ORANGE MONEY", "DIRECT"]),
  telephone: z.coerce.number().int().gte(610000000).lte(999999999),
})

type Inputs = z.infer<typeof SchemaCreate>;

const PayPlatFormChargeForm = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data?: GetSchoolFeesInter;
  setOpen?: any;
  extra_data?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [state, formAction] = useFormState(makePayment, null);

  console.log(data, 107)

  const SubmitButton = () => {
    const status = useFormStatus();
    return <MyButtonModal type={"ACTIVATE"} clicked={status.pending} />
  }

  return (
    <>
      {extra_data[1] == "single" ?
        data ?
          // <form className="flex flex-col gap-4" action={extra_data[2]}>
          // <form className="flex flex-col gap-4" onSubmit={extra_data[2]}>
          <form className="flex flex-col gap-4" action={formAction}>
            {type === "custom" && <h1 className="font-semibold text-xl">Activate Account</h1>}

            {/* {JSON.stringify(state, null, 2)} */}
            {JSON.stringify(state?.error, null, 2)}

            <div className="flex flex-col gap-4 justify-between">
              <SelectField
                label="MOBILE OPERATOR"
                name="operator"
                // defaultValue={data?.}
                register={register}
                error={errors?.operator}
                data={["MTN", "ORANGE"]}
              />


              <InputField
                label="Amount"
                name="amount"
                defaultValue={data.platform_charges.toString()}
                register={register}
                error={errors?.amount}
                readOnly={true}
              />
              <InputField
                label="Telephone"
                name="telephone"
                register={register}
                error={errors?.telephone}
                type="number"
              />
              <InputField
                label="URL"
                name="url"
                register={register}
                defaultValue={extra_data[3]}
                readOnly={true}
                className="hidden"
              />
              <InputField
                label="ORIGIN"
                name="origin"
                register={register}
                defaultValue={"admin"}
                readOnly={true}
                className="hidden"
              />
              <InputField
                label="ID"
                name="id"
                register={register}
                defaultValue={data.id.toString()}
                readOnly={true}
                className="hidden"
              />
            </div>

            {/* <MyButtonModal type={"ACTIVATE"} clicked={clicked} /> */}
            <SubmitButton />

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>No School Fee Information</div>
            {/* <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/SysConstant`} className="border px-6 py-2 rounded">Goto System Values</Link> */}
          </div>
        :
        <></>
        // <div className="bg-white dark:bg-black flex h-full items-center justify-center py-10">
        //   <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></div>
        // </div>
      }

      {extra_data[1] == "all" ?
        data ?
          <form className="flex flex-col gap-4" action={extra_data[2]}>
            {type === "custom" && <h1 className="font-semibold text-xl">Activate Account</h1>}

            <div className="flex flex-col gap-4 justify-between">
              <SelectField
                label="MOBILE OPERATOR"
                name="operator"
                // defaultValue={data?.operator}
                register={register}
                error={errors?.operator}
                data={["MTN MONEY", "ORANGE MONEY"]}
              />


              <InputField
                label="Amount"
                name="amount"
                defaultValue={data.platform_charges.toString()}
                register={register}
                error={errors?.amount}
                readOnly={true}
              />
              <InputField
                label="Telephone"
                name="telephone"
                register={register}
                error={errors?.telephone}
              />

              <InputField
                label="URL"
                name="url"
                register={register}
                defaultValue={extra_data[3]}
                readOnly={true}
                className="hidden"
              />
              <InputField
                label="ORIGIN"
                name="origin"
                register={register}
                defaultValue={"admin"}
                readOnly={true}
                className="hidden"
              />

            </div>

            {/* <MyButtonModal type={"ACTIVATE"} clicked={clicked} /> */}

          </form>
          :
          <div className="flex flex-col gap-4 h-full items-center justify-center w-full">
            <div>Soon ...</div>
          </div>
        :
        <></>
      }
    </>
  );
};

export default PayPlatFormChargeForm;
