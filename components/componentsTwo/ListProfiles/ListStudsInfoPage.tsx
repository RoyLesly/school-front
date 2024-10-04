'use client';
import { GetProgramInter, GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaCreateEditCustomUser } from "@/schemas-user";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { CustomUserUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { protocol } from "@/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import TabsStudents from "../TabsProfiles/TabsStudents";

const SchemaUpdate = z.object({
  first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  sex: z.enum(["Male", "Female"]),
  email: z.string().email(),
  telephone: z.coerce.number().int().gte(610000000).lte(699999999),
  title: z.enum(["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"]),
  address: z.string().optional(),
  pob: z.string().optional(),
  dob: z.string().optional(),
})

type Inputs = z.infer<typeof SchemaUpdate>;

const ListStudsInfoPage = ({ params, data, apiProgram }: { params: any, data: GetUserProfileInter | any, apiProgram: GetProgramInter[] }) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaUpdate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);


  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      // name: formVals["name"] ? formVals["name"].toUpperCase() : "",
      // sys_category_id: formVals.sys_category_id
    }
    const call = async () => {
      const response = await ActionEdit(newData, data.id, SchemaCreateEditCustomUser, protocol + "api" + params.domain + CustomUserUrl)
      if (response && response.id) {
        router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Info?updated="SUCCESSFULLY (${response.id}) !!!`);
      }
      setClicked(false)
    }
    call()
  })


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsStudents page={1} params={params} />

      <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        <div className='md:p-6'>
          <div className="gap-6 grid grid-cols-1">
            <div className="flex flex-col gap-4 md:gap-8">
              {/* <!-- Input Fields --> */}
              <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              
                <form className="bg-slate-300 flex flex-col gap-2 md:gap-6 md:p-6 p-2 text-black" onSubmit={onSubmit}>

                  <div className="flex flex-col md:flex-row">
                    <InputField
                      label="Matricle"
                      name="matricle"
                      defaultValue={data?.user__matricle}
                      register={register}
                      readOnly={true}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                    <InputField
                      label="First Name"
                      name="first_name"
                      defaultValue={data?.user__first_name}
                      register={register}
                      error={errors?.first_name}
                      readOnly={true}
                    />
                    <InputField
                      label="Last Name"
                      name="last_name"
                      defaultValue={data?.user__last_name}
                      register={register}
                      error={errors?.last_name}
                      readOnly={true}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">

                    <InputField
                      label="Telephone"
                      name="telephone"
                      defaultValue={data?.user__telephone}
                      register={register}
                      error={errors?.telephone}
                    />

                    <InputField
                      label="Email"
                      name="email"
                      defaultValue={data?.user__email}
                      register={register}
                      error={errors?.email}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">

                    <SelectField
                      label="Program"
                      name="program"
                      defaultValue={data?.program__id}
                      defaultName={data?.program__name}
                      register={register}
                      data={apiProgram}
                      display={{ name: "name", value: "id" }}
                    />

                    <SelectField
                      label="Session"
                      name="session"
                      defaultValue={data?.session}
                      defaultName={data?.session}
                      register={register}
                      data={["Morning", "Evening"]}
                    />
                  </div>

                  {/* <MyButtonModal type={"update"} clicked={clicked} /> */}


                </form>

              </div>


            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListStudsInfoPage;
