import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { CourseUrl, GetCourseUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { ActionEdit, ActionDelete } from '@/serverActions/actionGeneral';
import { GetCourseInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import { SchemaCreateEditLevel } from '@/Domain/schemas/schemas';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string,  domain: string, lecturer_id: string, id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetCourseUrl, {id: params.id, fieldList: [ 
    "id", 
    "main_course__course_name", 
    "specialty__school__campus__name", 
    "specialty__school__campus__region", 
    "specialty__level__level", 
    "specialty__main_specialty__specialty_name",
    "specialty__level__level", 
    "specialty__academic_year" ,
    "hours", 
    "course_code", 
    "semester", 
    "course_credit",
    "date_assigned",
  ]});

  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="Course Details" 
          pageName1="Home" 
          pageName2="Courses" 
          link1={`/Section-H/pageLecturer/${params.school_id}`}
          link2={`/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`}
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {/* {apiData && apiData["unauthorized"] && <SessionExpired />} */}
        {apiData && !apiData["unauthorized"] && apiData != "ECONNREFUSED" && <EditDelete apiData={apiData} params={params} />}
      </>
    </LayoutLecturer>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Course-Detail",
  description: "This is Level Page",
};


interface EditDeleteProps {
  apiData: GetCourseInter
  params: any
}

const EditDelete:FC<EditDeleteProps> = ( { apiData, params }) => {

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const data = {
      level_id: params.level_id,
      level: formData.get("level"),
    }
    const response = await ActionEdit(data, params.level_id, SchemaCreateEditLevel, protocol + "api" + params.domain + CourseUrl, `/Section-H/pageLecturer/${params.school_id}/pageSettings/pageLevels`)

    if (response.error) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response.errors) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/pageSettings/pageLevels/create?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/pageSettings/pageLevels?updated=Successfully-Updated-${JSON.stringify(response.level).replaceAll(" ", "-")}`)
    }
  }

  const onSubmitDeleteAction = async () => {
    'use server'

    const response = await ActionDelete(protocol + "api" + params.domain + CourseUrl, params.id)

    if (response?.error) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
    }
    if (response?.detail) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${params.level_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.success) {
      redirect(`/pageAdministration/${params.school_id}/pageSettings/pageLevels?deleted=Successfuly-Deleted-!!!`)
    }
  }

  console.log(102, apiData)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

              <div className='flex items-center justify-between px-4 py-6 text-centent'>
                <span className='w-1/4'>Course Name:</span>
                <span className='w-3/4'><b>{apiData.main_course__course_name}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Campus:</span>
                <span className='w-3/4'>
                  <b>{apiData.specialty__school__campus__region} - </b>
                  <b>{apiData.specialty__school__campus__name}</b>
                </span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Specialty:</span>
                <span className='w-3/4'><b>{apiData.specialty__main_specialty__specialty_name}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Year:</span>
                <span className='w-3/4'><b>{apiData.specialty__academic_year}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Level:</span>
                <span className='w-3/4'><b>{apiData.specialty__level__level}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Semester:</span>
                <span className='w-3/4'><b>{apiData.semester}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Hours:</span>
                <span className='w-3/4'><b>{apiData.hours}</b> Hours</span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Code:</span>
                <span className='w-3/4'><b>{apiData.course_code}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Credit:</span>
                <span className='w-3/4'><b>{apiData.course_credit}</b></span>
              </div>

              <div className='flex items-center justify-between pb-3 px-4 text-centent'>
                <span className='w-1/4'>Date Assigned:</span>
                <span className='w-3/4'><b>{apiData.date_assigned}</b></span>
              </div>

            </div>


          </div>
        </div>
      </div>
    
    </div>
  )
}