import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { ActionEdit, DeleteAction } from '@/serverActions/actionGeneral';
import { CustomUserUrl, GetSecondaryProfileUrl, SecondaryProfileUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import TabsStudent from './TabsStudent';
import { UserProfileStudentEditSchema } from '@/NoDomain/Utils-S/schemas/schemas-user';
import NotificationError from '@/section-s/common/NotificationError';
import { GetSecondaryProfileInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetSecondaryProfileUrl, {id: params.student_id, fieldList: [
    "id", "user__first_name", "user__last_name", "user__matricle", "session", "user__telephone", "user__email"
  ]});


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Personal Info"
          pageName1="Student"
          link1={`/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={1} />

        {apiData && apiData.count && <EditDelete apiData={apiData.results[0]} student_id={params.student_id} school_id={params.school_id} searchParams={searchParams} />}
      
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
  searchParams: any
  apiData: GetSecondaryProfileInter
  school_id: string
  student_id: string
}

const EditDelete: FC<EditDeleteProps> = async ({ apiData, school_id, student_id, searchParams }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      id: student_id,
      user_id: apiData.user__id,
      secondary_classroom__id: apiData.secondary_classroom__id,
      // username: apiData.user.username,
      // matricle: apiData.user.matricle,
      // first_name: fn ? fn.toString().toUpperCase() : "",
      // last_name: ln ? ln.toString().toUpperCase() : "",
      email: formData.get("email"),
      telephone: formData.get("telephone"),
      // role: apiData.user.role,
      session: formData.get("session"),
    }
    

    const response = await ActionEdit(data, apiData.id.toString(), UserProfileStudentEditSchema, SecondaryProfileUrl, `/pageAdministration/${school_id}`)

    console.log(response)
    if (response.error) {
      redirect(`/pageAdministration/${school_id}/pageStudents/detail/${student_id}?error=${JSON.stringify(response.error)}`)
    }
    if (response.errors) {
      redirect(`/pageAdministration/${school_id}/pageStudents/detail/${student_id}?error=${JSON.stringify(response.errors)}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${school_id}/pageStudents/detail/${student_id}?error=${JSON.stringify(response.detail)}`)
    }
    if (response?.id) {
      redirect(`/pageAdministration/${school_id}/pageStudents?updated=Updated Student Info`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await DeleteAction(SecondaryProfileUrl, student_id)

    console.log(95, response)
    if (response?.error) {
      // redirect(`/pageAdministration/${school_id}/pageStudents/details/${student_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      redirect(`/pageAdministration/${school_id}/pageStudents/details/${student_id}?error=Cannot-Delete-Profile----Contact-System-Admin`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/pageStudents/details/${student_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      const response2 = await DeleteAction(CustomUserUrl, apiData.user__id)
      if (response2?.success) {
        redirect("/pageAdministration/pageStudents?deleted=Profile-Deleted-Successfully-!!!")
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

                <NotificationError errorMessage={searchParams} />

                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>

              </div>

              <form className="flex flex-col gap-4 md:gap-6 p-6.5" action={onSubmitServerAction}>


                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                      MATRICLE
                    </label>
                    <input
                      type="text"
                      name="matricle"
                      readOnly={true}
                      disabled
                      defaultValue={apiData.user__matricle}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      // required={true}
                      readOnly={true}
                      disabled
                      defaultValue={apiData.user__first_name}
                      placeholder={`${apiData.user__first_name}`}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-2 text-black">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      // required={true}
                      // readOnly={true}
                      disabled
                      defaultValue={apiData.user__last_name}
                      placeholder={`${apiData.user__last_name}`}
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
                      // readOnly={true}
                      disabled
                      defaultValue={apiData.user__telephone}
                      // required={true}
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
                      // required={true}
                      disabled
                      readOnly={true}
                      placeholder={apiData.user__email}
                      className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">

                  <div className="flex flex-col w-full">
                    <label className="block dark:text-white font-medium mb-3 text-black">
                      SESSION
                    </label>
                    <select
                      name='session'
                      required={true}
                      defaultValue={apiData?.session}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                      <option value={0}>------------------</option>
                      {["Morning", "Evening"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                        {item}
                      </option>)
                      )}
                    </select>
                  </div>
                </div>

                {/* <button type="submit" className="bg-bluedark dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-10 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Update</button> */}

              </form>

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}