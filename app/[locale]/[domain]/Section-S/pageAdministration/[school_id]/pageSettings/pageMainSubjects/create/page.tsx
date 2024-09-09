import { MainSubjectUrl } from '@/Domain/Utils-S/appControl/appConfig';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { SchemaCreateEditMainSubject } from '@/Domain/Utils-S/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Create Subject Title" 
          pageName1="Settings" 
          pageName2="Course Title" 
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <Create params={params} />

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Title-Create",
  description: "This is Subject Page",
};

const Create = async ({ params }: any) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const d = formData.get("subject_name")

    const data = {
      subject_name: d ? d.toString().toUpperCase() : d,
    }
    const response = await ActionCreate(data, SchemaCreateEditMainSubject, protocol  + "api" + params.domain + MainSubjectUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects`)
    console.log(response)

    if (response?.error) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.id) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects?created=${JSON.stringify(response.subject_name).replaceAll(" ", "-")}-Created`)
    }
    else { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create?error=Error-Occured`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <form className="flex flex-col gap-10 p-6.5" action={onSubmitServerAction}>

                <div className="flex flex-col">
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Subject Title Name
                  </label>
                  <input
                    type="text"
                    name="subject_name"
                    required={true}
                    placeholder="Enter Subject Name e.g Mathematics ..."
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <button type="submit" className="bg-greendark bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mt-10 px-5 py-2.5 rounded text-center text-lg text-white tracking-widest w-full">Save</button>

              </form>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}