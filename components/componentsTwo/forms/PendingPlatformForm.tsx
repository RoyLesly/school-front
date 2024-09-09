"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionEdit, ActionDelete } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { SchemaCreateEditDomain } from "@/Domain/schemas/schemas";
import { DomainUrl } from "@/Domain/Utils-H/appControl/appConfig";


type Inputs = z.infer<typeof SchemaCreateEditDomain>;

const PendingPlatformForm = ({
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
    resolver: zodResolver(SchemaCreateEditDomain),
  });

  const router = useRouter();

  const onSubmit = handleSubmit((formVals) => {
    console.log(formVals, 51)

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(formVals, SchemaCreateEditDomain, protocol + "api" + params.domain + DomainUrl)
        console.log(response, 56)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}//pageSettings/pageDomains?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(formVals, data.id, SchemaCreateEditDomain, protocol + "api" + params.domain + DomainUrl)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
      }
      call()
    }
  });

  const onSubmitDelete = (id: number) => {
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + DomainUrl, id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
      }
      call()
    }
  }

  return (
    <>
      {type !== "delete" ?
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {type === "create" && <h1 className="font-semibold text-xl">Create Domain</h1>}
          {type === "update" && <h1 className="font-semibold text-xl">Update Value</h1>}

          <div className="flex flex-wrap gap-4 justify-between">
            <InputField
              label="Domain Name"
              name="domain_name"
              defaultValue={data?.domain_name}
              register={register}
              error={errors?.domain_name}
            />
          </div>

          <button className="bg-blue-400 p-2 rounded-md text-white">
            {type === "create" ? "Create" : type === "update" ? "Update" : "Delete"}
          </button>
        </form>

        :

        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-xl">Delete Value</h1>
          <div>Name: {data?.domain_name}</div>
          <button  onClick={() => onSubmitDelete(data.id)} className="bg-red p-2 rounded-md text-white">Delete</button>
        </div>
      }
    </>
  );
};

export default PendingPlatformForm;
