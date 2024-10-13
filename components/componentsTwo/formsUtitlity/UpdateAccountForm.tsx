"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { AccountUrl } from "@/Domain/Utils-H/feesControl/feesConfig";
import { SchemaCreateEditAccount, SchemaCreateEditSysConstant } from "@/Domain/schemas/schemas";
import { getData, handleResponseError } from "@/functions";
import { ReactNode, useEffect, useState } from "react";
import { AcademicYearUrl, SysConstantUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetAccountInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { ConstAccountLists } from "@/constants";
import { SysCategoryInter } from "@/Domain/Utils-H/appControl/appInter";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const UpdateAccountForm = ({
  type,
  data,
  setOpen,
  params,
  extra_data,
}: {
  type: "custom";
  setOpen: any;
  extra_data: {
    apiYears: string[],
    form: "create_category_account" | "create_account_constants" | "update_account_constants" | "create_account",
    sysCat?: SysCategoryInter
    year?: string[]
  };
  data?: GetAccountInter;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditAccount),
  });

  const router = useRouter();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    if (count == 0) {

    }
  }, [count, params, data])

  const onSubmitCreateAccount = async () => {
    setClicked(true);
    if (extra_data?.form === "create_account") {
      const call = async () => {
        const response = await ActionCreate({ name: "ACCOUNT" }, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
        const t = await handleResponseError(response, ["name"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageAdmin/Account?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

    if (extra_data?.form === "create_account_constants" && extra_data.sysCat && extra_data.sysCat.id) {
      const call = async () => {
        if (ConstAccountLists.length > 0) {
          await Promise.allSettled(ConstAccountLists.map((item: string, index: number) => {
            const newData = { sys_category_id: extra_data?.sysCat?.id, name: item }
            return (
              ActionCreate(newData, SchemaCreateEditSysConstant, protocol + "api" + params.domain + SysConstantUrl)
            )
          }))
            .then(res => {
              console.log(10500, res)
              if (res && res.length > 0) {
                const t = res.map(item => item.status)
                if (t[0] == "fulfilled") {
                  const CreateAccountCall = async () => {
                    await Promise.allSettled(ConstAccountLists.map((item: string, index: number) => {
                      const AcountData = {
                        name: "ACCOUNT",
                        balance: 0,
                        status: true,
                        number: item.toLowerCase(),
                        year: `${extra_data.year ? extra_data.year : new Date().getFullYear().toString() + "/" + (new Date().getFullYear() + 1).toString()}`
                      }
                      console.log(AcountData)
                      return (
                        ActionCreate(AcountData, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
                      )
                    }))
                      .then(res => {
                        console.log(10500, res)
                        if (res && res.length > 0) {
                          const t = res.map(item => item.status)
                          if (t[0] == "fulfilled") {
                            router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?updated=SUCCESSFULLY !!!`);
                          }
                        }
                      })
                    CreateAccountCall()
                  }
                }
              }
              else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?error=Error`); }
            })
            .catch(err => {
            })
          setClicked(false)
          return
        }
      }
      call()
    }

  };

  const onSubmitUpdateAccountConstants = async () => {
    if (extra_data?.form === "update_account_constants" && extra_data.sysCat && extra_data.sysCat.id) {
      const call = async () => {
        if (ConstAccountLists.length > 0) {
          setClicked(true);
          await Promise.allSettled(ConstAccountLists.map((item: string, index: number) => {
            const newData = { sys_category_id: extra_data?.sysCat?.id, name: item }
            return (
              ActionCreate(newData, SchemaCreateEditSysConstant, protocol + "api" + params.domain + SysConstantUrl)
            )
          }))
            .then(res => {
              if (res && res.length > 0) {
                const t = res.map(item => item.status)
                if (t[0] == "fulfilled") { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?updated=SUCCESSFULLY !!!`); }
                else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account/UpdateAccount?error=${t[0]}`); }
              }
            })
            .catch(err => {
              console.log(98, err)
            })
          setClicked(false)
          return
        } else {
          console.log(103, "Not Logged In")
        }
      }
      call()
    }
  };
  const onSubmitCreateAccountConstants = async () => {
    if (extra_data?.form === "create_account_constants" && extra_data.sysCat && extra_data.sysCat.id) {
      const call = async () => {
        if (ConstAccountLists.length > 0) {
          setClicked(true);
          await Promise.allSettled(ConstAccountLists.map((item: string, index: number) => {
            const newData = { sys_category_id: extra_data?.sysCat?.id, name: item }
            return (
              ActionCreate(newData, SchemaCreateEditSysConstant, protocol + "api" + params.domain + SysConstantUrl)
            )
          }))
            .then(res => {
              console.log("165", res)
              if (res && res.length > 0) {
                const t = res.map(item => item.status)
                if (t[0] == "fulfilled") {
                  const CreateAccountCall = async () => {
                    await Promise.allSettled(ConstAccountLists.map((item: string, index: number) => {
                      const AcountData = {
                        name: item,
                        balance: 0,
                        status: true,
                        number: item.toLowerCase(),
                        year: `${extra_data.year ? extra_data.year : new Date().getFullYear().toString() + "/" + (new Date().getFullYear() + 1).toString()}`
                      }
                      return (
                        ActionCreate(AcountData, SchemaCreateEditAccount, protocol + "api" + params.domain + AccountUrl)
                      )
                    }))
                      .then(res => {
                        if (res && res.length > 0) {
                          const t = res.map(item => item.status)
                          if (t[0] == "fulfilled") {
                            router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?updated=SUCCESSFULLY !!!`);
                          }
                        }
                      })
                  }
                  CreateAccountCall()
                  setClicked(false)
                }
              }
              else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/Account?error=Error`); }
            })
            .catch(err => {
            })
          return
        }
      }
      call()
    }
  };

  return (
    <>

      <form className="flex flex-col" onSubmit={onSubmitUpdateAccountConstants}>
        {extra_data?.form === "create_category_account" ?
          <div className="mb-10">
            <h1 className="font-semibold text-xl">Create Account</h1>

            <div className="flex flex-wrap gap-4 justify-between">
              <InputField
                label="Account Name"
                name="name"
                defaultValue={data?.name}
                register={register}
                error={errors?.name}
              />
            </div>
            <MyButtonModal type={type} clicked={clicked} />
          </div>
          :
          null
        }
      </form>


      <div className="flex flex-col">

        {extra_data?.form === "create_account" ?
          <div className="flex flex-col gap-10 w-full">
            <h1 className="font-semibold text-xl">Create Account</h1>
            <ButtonHere title="Create" clicked={clicked} type="create_account_constants" functionCall={onSubmitCreateAccount} />
          </div>
          :
          null
        }

        {extra_data?.form === "create_account_constants" ?
          <div className="flex flex-col gap-10 w-full">
            <h1 className="font-semibold text-xl">Create Account Constants</h1>
            <ButtonHere title="Create" clicked={clicked} type="create_account_constants" functionCall={onSubmitCreateAccountConstants} />
          </div>
          :
          null
        }

        {extra_data?.form === "update_account_constants" ?
          <div className="flex flex-col gap-10 w-full">
            <h1 className="font-semibold text-xl">Update Account Constants</h1>
            <ButtonHere title="Update" clicked={clicked} type="update_account_constants" functionCall={onSubmitUpdateAccountConstants} />
          </div>
          :
          null
        }

      </div>

    </>
  );
};

export default UpdateAccountForm;


const ButtonHere = ({ clicked, title, type, functionCall, icon }: { clicked: boolean, title: string, functionCall: any, type: string, icon?: ReactNode }) => {
  return <>
    {clicked ?
      <button className={`p-2 rounded-md text-white flex items-center justify-center`}>
        <span className={`${type == "update_account_constants" ? "border-green-500" : "border-bluedash"} animate-spin border-6  border-t-transparent flex h-[34px] rounded-full w-[34px]`}>.</span>
      </button>

      :
      <button onClick={() => functionCall()} className={`${type == "update_account_constants" ? "bg-green-600" : type == "update" ? "bg-blue-400" : "bg-blue-700"} font-medium px-6 py-2 flex items-center gap-2 rounded-md text-white justify-center`}>
        {title}
        {icon}
      </button>
    }
  </>
}
