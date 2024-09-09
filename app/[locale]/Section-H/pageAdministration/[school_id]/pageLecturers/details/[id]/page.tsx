import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/NoDomain/section-h/common/NotificationError';
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { CustomUserUrl, DepartmentUrl, GetUserProfileUrl, UserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { DeptInter, GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { SchemaEditCustomUser } from '@/schemas-user';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string, school_id: string  };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetUserProfileInter | any = await getData(protocol + GetUserProfileUrl, { id: params.id, nopage: true });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Lecturer Details"
          pageName1="Settings"
          link1={`/Section-H/pageAdministration/${params.school_id}pageLectruers`}
        />
        <NotificationError errorMessage={searchParams} />
          {apiData && <EditDelete apiData={apiData} id={params.id} params={params} />}
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
  params: any
  apiData: GetUserProfileInter
  id: string
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, id, params }) => {

  const deptData: DeptInter | any = await getData(DepartmentUrl, {});

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const fn = formData.get("first_name")
    const ln = formData.get("last_name")

    const data = {
      id: id,
      username: apiData.user__username,
      first_name: fn ? fn.toString().toUpperCase() : "",
      last_name: ln ? ln.toString().toUpperCase() : "",
      email: formData.get("email")?.toString().toLowerCase(),
      telephone: formData.get("telephone")?.toString().length == 9 ? "+237" + formData.get("telephone") : formData.get("telephone")?.toString().length == 13 ? formData.get("telephone") : "",
      title: formData.get("title"),
      role: formData.get("role"),
      // dept_id: apiData.user.dept,
    }
    console.log(apiData)
    // return
    const response = await ActionEdit(data, apiData.user__id, SchemaEditCustomUser, CustomUserUrl)

    if (response?.detail) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageLecturers/details?error=Error-${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageLecturers?updated=Updated-${JSON.stringify(response.full_name).replaceAll(" ", "-")}`)
    } else {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageLecturers/details/${id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(UserProfileUrl, apiData.user__id)

    if (response?.error) {
      redirect(`/Section-H/pageAdministration/pageLecturers/details/${id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/pageLecturers/details/${id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      const response2 = await ActionDelete(CustomUserUrl, apiData.user__id)
      if (response2?.success) {
        redirect("/Section-H/pageAdministration/pageLecturers?deleted=Profile-Deleted-Successfully-!!!")
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
                  {apiData.user__full_name}
                </h3>

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
                    defaultValue={apiData.user__username}
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
                      defaultValue={apiData.user__first_name}
                      placeholder={`${apiData.user__first_name}`}
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
                      defaultValue={apiData.user__last_name}
                      placeholder={`${apiData.user__last_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>


                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      ROLE
                    </label>
                    <select
                      name='role'
                      defaultValue={apiData.user__role}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option key={0} value={"teacher"} className="dark:text-bodydark my-2 text-body">Lecturer</option>
                      <option key={1} value={"admin"} className="dark:text-bodydark my-2 text-body">Admin</option>

                    </select>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      SELECT DEPARTMENT
                    </label>
                    <select
                      name='dept_id'
                      // defaultValue={apiData.dept_id}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      {deptData.results && deptData.results.map((item: DeptInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.name}
                      </option>)
                      )}
                    </select>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      Title
                    </label>
                    <select
                      name='title'
                      defaultValue={apiData.user__title}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      {["Prof","Dr", "Mr", "Mrs", "Miss", "Engr"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                      </option>)
                      )}

                    </select>
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
                      defaultValue={apiData.user__telephone}
                      required={true}
                      placeholder={apiData.user__telephone}
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
                      defaultValue={apiData.user__email}
                      required={true}
                      placeholder={apiData.user__email}
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