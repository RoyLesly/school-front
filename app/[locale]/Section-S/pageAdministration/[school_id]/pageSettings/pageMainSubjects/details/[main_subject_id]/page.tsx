import { GetMainSubjectUrl, MainSubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetMainSubjectInter } from '@/NoDomain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { DeleteAction } from '@/serverActions/actionGeneral';
import { SchemaCreateEditMainSubject } from '@/NoDomain/Utils-S/schemas/schemas';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import SessionExpired from '@/section-s/common/SessionExpired';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, main_subject_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetMainSubjectInter | any = await getData(protocol + GetMainSubjectUrl, { id: params.main_subject_id, nopage: true });
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Edit Subject Titles" 
          pageName1="Settings" 
          pageName2="Course Titles" 
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects`}
        />

        {apiData && apiData.unauthorized && <SessionExpired />}
        {apiData && apiData.length == 1 && <Edit apiData={apiData[0]} params={params} />}
      
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "MainSubject-Edit",
  description: "This is Main Subject Page",
};


interface EditProps {
  apiData: GetMainSubjectInter
  params: { school_id: string, main_subject_id: string }
}

const Edit:FC<EditProps> = async ( { apiData, params }) => {


  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const d = formData.get("subject_name")

    const data = {
      subject_name: d ? d.toString().toUpperCase() : d,
    }
    const response = await ActionEdit(data, parseInt(params.main_subject_id), SchemaCreateEditMainSubject, MainSubjectUrl, `/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`)
    
    if (response.error) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create?error=${response.error.replaceAll(" ", "-")}` )
    }
    if (response.errors) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create?error=${response.errors.replaceAll(" ", "-")}` )
    }
    if (response?.detail) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create?error=${response.detail.replaceAll(" ", "-")}` )
    }
    if (response?.id) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects?updated=Successfully-Updated-${JSON.stringify(response.subject_name)}`)
     }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await DeleteAction(MainSubjectUrl, params.main_subject_id)

    if (response?.error) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/${params.main_subject_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/${params.main_subject_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects?deleted=Successfuly-Deleted-!!!`)
      }
    }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex justify-between px-6.5 py-4">
                <h3 className="dark:text-white font-medium text-black">
                  Editing ...  {apiData.subject_name}
                </h3>
                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Subject Title Name
                  </label>
                  <input
                    type="text"
                    name="subject_name"
                    placeholder={apiData.subject_name}
                    defaultValue={apiData.subject_name}
                    className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
                  />
                </div>

                <button type="submit" className="bg-bluedark bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 mt-10 px-5 py-2.5 rounded text-center text-lg text-white tracking-widest w-full">Edit</button>

              </form>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}