import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import Notification from '@/section-h/common/Notification';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { CustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { CustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { SchemaEditCustomUser } from '@/schemas-user';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, user_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: CustomUserInter | any = await getData(`${protocol + CustomUserUrl}/${params.user_id}`, {});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="User Details"
          pageName1="Users"
          link1="/Section-H/pageAdministration/pageUsers"
        />

        <div>
          {apiData && <EditDelete apiData={apiData} params={params} searchParams={searchParams} />}
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
  searchParams: CustomUserInter | any
  apiData: CustomUserInter | any
  params: { school_id: string, user_id: string }
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params, searchParams }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const fn = formData.get("first_name")
    const ln = formData.get("last_name")
    const is_active = formData.get("is_active") == "true" ? true : false

    const data = {
      id: params.user_id,
      username: formData.get("username"),
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: ln ? ln.toString().toUpperCase() : "",
      full_name: (fn ? fn.toString().toUpperCase() : "") + (ln ? ln.toString().toUpperCase() : ""),
      email: formData.get("email")?.toString().toLowerCase(),
      telephone: formData.get("telephone"),
      is_active: is_active,
      role: apiData.role,
      dept_id: apiData.dept,
    }

    const response = await ActionEdit(data, params.user_id, SchemaEditCustomUser, protocol + CustomUserUrl)

    if (response?.detail) { }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageUsers?updated=Updated-${JSON.stringify(response.full_name).replaceAll(" ", "-")}`)
    } else {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(protocol + CustomUserUrl, params.user_id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageUsers/details/${params.user_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageUsers?deleted=User-Successfully-Deleted-!!!`)
    }
  }

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

                <Notification searchParams={searchParams} />

                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>

              </div>

              <form className="bg-slate-50 dark:bg-slate-700 flex flex-col font-medium gap-4 md:gap-10 p-6.5 tracking-wide" action={onSubmitServerAction}>


                <div className="flex flex-col">
                  <label className="block dark:text-white mb-2 text-black">
                    USERNAME
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    required={true}
                    defaultValue={apiData.username}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                  />
                </div>

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
                      defaultValue={apiData.is_active}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option key={0} value={"true"} className="dark:text-bodydark my-2 text-body">Active</option>
                      <option key={1} value={"false"} className="dark:text-bodydark my-2 text-body">Inactive</option>

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