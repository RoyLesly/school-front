import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { GetMainCourseUrl, MainCourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetMainCourseInter, MainCourseInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { SchemaCreateEditMainCourse } from '@/NoDomain/schemas/schemas';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, main_course_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: MainCourseInter | any = await getData(protocol + GetMainCourseUrl,  {...searchParams, id: params.main_course_id});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Detail Course Titles" 
          pageName1="Settings" 
          pageName2="Course Titles" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`}
        />

        { apiData && apiData.count && <Edit apiData={apiData.results[0]} params={params} />}
      
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "MainCourse-Edit",
  description: "This is Main Course Page",
};


interface EditProps {
  apiData: GetMainCourseInter
  params: { school_id: string, main_course_id: string }
}

const Edit:FC<EditProps> = async ( { apiData, params }) => {

  console.log(59, apiData)

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const d = formData.get("course_name")

    const data = {
      course_name: d ? d.toString().toUpperCase() : d,
    }
    const response = await ActionEdit(data, params.main_course_id, SchemaCreateEditMainCourse, protocol + MainCourseUrl, `/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`)
    
    if (response.error) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/create?error=${response.error.replaceAll(" ", "-")}` )
    }
    if (response.errors) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/create?error=${response.errors.replaceAll(" ", "-")}` )
    }
    if (response?.detail) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/create?error=${response.detail.replaceAll(" ", "-")}` )
    }
    if (response?.id) { 
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses?updated=Successfully-Updated-${JSON.stringify(response.course_name)}`)
     }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(MainCourseUrl, params.main_course_id)

    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/${params.main_course_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) { 
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/${params.main_course_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageMainCourses?deleted=Successfuly-Deleted-!!!`)
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
                  Editing ...  {apiData.course_name}
                </h3>
                <form action={onSubmitDeleteAction} className='flex mb-2'>
                  <button className='bg-reddark font-medium md:px-6 mt-2 px-4 py-2 rounded text-white tracking-wide'>Delete</button>
                </form>
              </div>

              <form className="flex flex-col gap-5.5 p-6.5" action={onSubmitServerAction}>

                <div>
                  <label className="block dark:text-white font-medium mb-3 text-black text-sm">
                    Course Title Name
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    placeholder={apiData.course_name}
                    defaultValue={apiData.course_name}
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