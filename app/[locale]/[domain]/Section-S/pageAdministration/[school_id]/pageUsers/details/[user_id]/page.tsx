import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { SchemaEditCustomUser } from '@/Domain/Utils-S/schemas/schemas-user';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { CustomUserUrl, GetCustomUserUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { GetCustomUserInter } from '@/Domain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, user_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetCustomUserInter[] = await getData(protocol + GetCustomUserUrl, { nopage: true, id: params.user_id });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="User Details"
          pageName1="Back"
          link1={`/pageAdministration/${params.school_id}/pageUsers`}
        />

        <NotificationError errorMessage={searchParams} />

        <div>
          {apiData && apiData.length > 0 && <EditDelete apiData={apiData[0]} params={params} searchParams={searchParams} />}
        </div>
      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "User-Detail",
  description: "This is User Detail Page",
};


interface EditDeleteProps {
  searchParams: any
  apiData: GetCustomUserInter
  params: { school_id: string, user_id: string }
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params, searchParams }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const username = formData.get("username")
    const fn = formData.get("first_name")
    const ln = formData.get("last_name")
    const title = formData.get("title")
    const is_active = formData.get("is_active") == "true" ? true : false

    const data = {
      ...apiData,
      id: params.user_id,
      username: username ? username : apiData.username ? apiData.username : apiData.matricle,
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: ln ? ln.toString().toUpperCase() : "",
      email: formData.get("email")?.toString().toLowerCase(),
      telephone: formData.get("telephone"),
      is_active: is_active,
      role: apiData.role,
      sex: formData.get("sex"),
      title: title ? title : apiData.title ? apiData.title : "",
      // dept_id: apiData.dept,
    }

    console.log(data, 79)

    const response = await ActionEdit(data, params.user_id, SchemaEditCustomUser, CustomUserUrl)

    if (response?.detail) { }
    if (response?.id) {
      redirect(`/pageAdministration/${params.school_id}/pageUsers?updated=Updated-${JSON.stringify(response.full_name).replaceAll(" ", "-")}`)
    } else {
      redirect(`/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(CustomUserUrl, params.user_id)

    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/pageAdministration/${params.school_id}/pageUsers?deleted=User-Successfully-Deleted-!!!`)
    }
  }

  console.log(apiData, 117)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex flex-col items-center justify-between md:flex-row px-6.5 py-2">
                <h3 className="dark:text-white font-medium text-black">
                  {apiData.full_name}
                </h3>

                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>

              </div>

              <form className="bg-slate-50 dark:bg-slate-700 flex flex-col font-medium gap-4 md:gap-10 p-6.5 tracking-wide" action={onSubmitServerAction}>


                {apiData.role == "student" ? <div className="flex flex-col">
                  <label className="block dark:text-white mb-2 text-black">
                    MATRICLE
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Matricle"
                    required={false}
                    readOnly={true}
                    defaultValue={apiData.matricle}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                  />
                </div>
                  :
                  <div className='flex gap-6 w-full'>
                    <div className="flex flex-col">
                      <label className="block dark:text-white mb-2 text-black">
                        USERNAME
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        required={false}
                        readOnly={true}
                        defaultValue={apiData.username}
                        className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="block dark:text-white mb-2 text-black">
                        Title
                      </label>
                      <select 
                        defaultValue={apiData.title} 
                        className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                        required={true}
                      >
                        <option value={""}>-------</option>
                        <option value={"Mr"}>Mr</option>
                        <option value={"Mrs"}>Mrs</option>
                        <option value={"Miss"}>Miss</option>
                        <option value={"Dr"}>Dr</option>
                        <option value={"Engr"}>Engr</option>
                        <option value={"Prof"}>Prof</option>
                      </select>
                    </div>
                  </div>
                }

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required={true}
                      defaultValue={apiData.first_name}
                      placeholder={`${apiData.first_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required={true}
                      defaultValue={apiData.last_name}
                      placeholder={`${apiData.last_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-10">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      Status
                    </label>
                    <select
                      name='is_active'
                      defaultValue={apiData.is_active == "True" ? "true" : "false"}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option key={0} value={"true"} className="dark:text-bodydark my-2 text-body">Active</option>
                      <option key={1} value={"false"} className="dark:text-bodydark my-2 text-body">Inactive</option>

                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      Gender
                    </label>
                    <select
                      name='sex'
                      defaultValue={apiData.sex}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option value={""} className="dark:text-bodydark my-2 text-body">----------</option>
                      <option key={0} value={"Male"} className="dark:text-bodydark my-2 text-body">Male</option>
                      <option key={1} value={"Female"} className="dark:text-bodydark my-2 text-body">Female</option>

                    </select>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      EMAIL
                    </label>
                    <input
                      type="text"
                      name="email"
                      defaultValue={apiData.email}
                      required={true}
                      placeholder={apiData.email}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white mb-2 text-black">
                      TELEPHONE
                    </label>
                    <input
                      type="text"
                      name="telephone"
                      defaultValue={apiData.telephone}
                      required={true}
                      placeholder={apiData.telephone}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-bluedark bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-3 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Update</button>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}