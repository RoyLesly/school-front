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
import { useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";


type Inputs = z.infer<typeof SchemaCreateEditDomain>;

const DomainForm = ({
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
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newVals = {
      domain_name: formVals.domain_name.toUpperCase(),
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditDomain, protocol + "api" + params.domain + DomainUrl)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditDomain, protocol + "api" + params.domain + DomainUrl)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + DomainUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
  });

  return (

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

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default DomainForm;
