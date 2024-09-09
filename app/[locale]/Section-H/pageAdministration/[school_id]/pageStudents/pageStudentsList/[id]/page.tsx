import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb';
import Notification from '@/NoDomain/section-h/common/Notification';
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import TabsStudent from './TabsStudent';
import NotificationError from '@/NoDomain/section-h/common/NotificationError';
import { CustomUserUrl, UserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { SchemaCreateCustomUser } from '@/schemas-user';
import { CustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { UserProfileInter } from '@/serverActions/interfaces';

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: UserProfileInter | any = await getData(`${UserProfileUrl}/${params.id}`, {});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Personal Info"
          pageName1="Student"
          link1="/Section-H/pageAdministration/pageStudents"
        />

        <TabsStudent params={params} />
        <NotificationError errorMessage={searchParams} />
        {apiData && <EditDelete apiData={apiData} params={params} searchParams={searchParams} />}
      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Student-Detail",
  description: "This is Student Detail Page",
};


interface EditDeleteProps {
  searchParams: CustomUserInter | any
  apiData: CustomUserInter | any
  params: any
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, params, searchParams }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const fn = formData.get("first_name")
    const ln = formData.get("last_name")

    const data = {
      id: params.id,
      username: apiData.user.username,
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: ln ? ln.toString().toUpperCase() : "",
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      role: apiData.user.role,
    }

    const response = await ActionEdit(data, apiData.user.id, SchemaCreateCustomUser, CustomUserUrl)

    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/pageStudents/details?error=Error-${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/pageStudents?updated=Updated-${JSON.stringify(response.full_name).replaceAll(" ", "-")}`)
    } else {
      redirect(`/Section-H/pageAdministration/pageStudents/details/${params.id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(UserProfileUrl, apiData.id)

    console.log(95, response)
    if (response?.error) {
      redirect(`/Section-H/pageAdministration/pageStudents/details/${params.id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/pageStudents/details/${params.id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      const response2 = await ActionDelete(CustomUserUrl, apiData.user.id)
      if (response2?.success) {
        redirect("/Section-H/pageAdministration/pageStudents?deleted=Profile-Deleted-Successfully-!!!")
      }
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
                  {apiData.user.full_name}
                </h3>

                <Notification searchParams={searchParams} />

                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>

              </div>

              <form className="flex flex-col gap-4 md:gap-10 p-6.5" action={onSubmitServerAction}>


                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    USERNAME
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    readOnly={true}
                    defaultValue={apiData.user.username}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                  />
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required={true}
                      defaultValue={apiData.user.first_name}
                      placeholder={`${apiData.user.first_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required={true}
                      defaultValue={apiData.user.last_name}
                      placeholder={`${apiData.user.last_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      TELEPHONE
                    </label>
                    <input
                      type="number"
                      name="telephone"
                      max={999999999}
                      min={600000000}
                      defaultValue={apiData.user.telephone}
                      required={true}
                      placeholder={apiData.user.telephone}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      EMAIL
                    </label>
                    <input
                      type="text"
                      name="email"
                      defaultValue={apiData.user.email}
                      required={true}
                      placeholder={apiData.user.email}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Update</button>

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}