import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { GetCustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { AcademicYearUrl, GetCourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetCourseInter } from '@/NoDomain/Utils-H/appControl/appInter'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import SessionExpired from '@/section-h/common/SessionExpired'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { redirect } from 'next/navigation'
import { RiSearch2Fill } from 'react-icons/ri'
import { protocol } from '@/config'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiData = await getData(protocol + GetCourseUrl, {
        ...searchParams, specialty__school__id: params.school_id, nopage: true, assigned_to__id: params.lecturer_id, fieldList: [
            "id",
            "main_course__course_name",
            "specialty__level__level",
            "specialty__academic_year",
            "course_code",
            "course_credit",
            "specialty__main_specialty__specialty_name",
            "specialty__main_specialty__field__domain__domain_name",
        ]
    })
    const apiLecturer = await getData(protocol + GetCustomUserUrl, { id: params.lecturer_id, nopage: true })

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName={`${apiLecturer && apiLecturer[0].full_name} - Courses`}
                    pageName1="Back"
                    link1={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
                />

                {apiData == "ECONNREFUSED" && <SessionExpired params={params} />}

                {apiData && apiLecturer.length == 1 && <SelectLecturer data={apiData} params={params} lecturer={apiLecturer} />}


            </>
        </LayoutAdmin>
    )
}

export default page

export const metadata: Metadata = {
    title: "Marks Entry ",
    description: "This is Marks Entry  Page",
};

const SelectLecturer = async ({ data, params, lecturer }: any) => {

    return (
        <div className='flex flex-col h-full'>

            <SearchYear params={params} />

            <div className="bg-bluedark dark:-strokedark grid grid-cols-12 md:grid-cols-12 md:text-lg px-2 py-1 text-sm text-white tracking-wider">
                <div className="col-span-4 flex items-center justify-between md:mx-4 mx-2">
                    <span className="font-medium">Course Name</span>
                </div>
                <div className="col-span-6 grid grid-cols-12 px-2">
                    <div className="col-span-4 flex items-center px-2 text-wrap w-full">Class</div>
                    <div className="col-span-1 flex items-center px-2 text-wrap w-full">Level</div>
                    <div className="col-span-2 flex items-center px-2 text-wrap w-full">Year</div>
                    <div className="col-span-1 flex items-center px-2 text-wrap w-full">-</div>
                    <div className="col-span-3 flex items-center px-2 text-wrap w-full">Domain</div>
                </div>

                <div className="col-span-2 flex-col gap-4 items-center justify-center md:col-span-2 md:flex md:flex-row px-2">
                    <div className="col-span-1 flex items-center justify-center px-2 text-wrap w-full">Code</div>
                    <div className="col-span-1 flex items-center justify-center px-2 text-center text-wrap w-full">Action</div>
                </div>

            </div>
            {data && data.length > 0 ? data.map((item: GetCourseInter, key: number) => (
                <div
                    className="-stroke -t dark:-strokedark grid grid-cols-12 md:grid-cols-12 md:px-4 md:text-lg odd:bg-slate-50 odd:dark:bg-slate-800 px-3 py-1 text-sm"
                    key={key}
                >
                    <div className="col-span-4 flex items-center justify-between md:mr-4 mx-2">
                        <span className="dark:text-white text-black">
                            {item.main_course__course_name}
                        </span>
                    </div>

                    <div className="col-span-6 grid grid-cols-12 md:col-span-6 px-2">
                        <span className="col-span-4 dark:text-white text-black">{item.specialty__main_specialty__specialty_name}</span>
                        <span className="col-span-1 dark:text-white text-black">{item.specialty__level__level}</span>
                        <span className="col-span-2 dark:text-white hidden md:flex text-black">{item.specialty__academic_year}</span>
                        <span className="col-span-2 dark:text-white flex md:hidden text-black">{item.specialty__academic_year.slice(0, 4)}</span>
                        <span className="col-span-1 dark:text-white text-black">-</span>
                        <span className="col-span-3 dark:text-white text-black">{item.specialty__main_specialty__field__domain__domain_name}</span>
                    </div>

                    <div className='col-span-2 grid grid-cols-2 px-2'>
                        <span className="col-span-1 dark:text-white flex items-center justify-center text-black text-center">{item.course_code}</span>
                        <div className="col-span-1 flex items-center justify-center md:text-lg md:text-md text-center">
                            <button className='flex items-center justify-center'>
                                <MyButtonCustom
                                    title='View'
                                    type='view'
                                    href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${item.id}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            ))
        :
        <div className='bg-white flex font-semibold justify-center pb-72 pt-40 rounded text-[30px] tracking-widest'>No Course For This Selected Year</div>}

            <MyPagination
                prevLink={data.previous}
                nextLink={data.next}
                count={data.count}
                thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/${params.lecturer_id}?user__role=teacher`}
            />

        </div>
    )
}


const SearchYear = async ({ params }: any) => {

    const years = await getData(AcademicYearUrl, {})

    const onSearchDrugServerAction = async (formData: FormData) => {
      'use server'
  
      var year = formData.get("name")
  
      if (year && year.toString().length > 1) {
        redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/${params.lecturer_id}?specialty__academic_year=${year}`)
      }
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/${params.lecturer_id}`)
  
    }
    return (
        <form action={onSearchDrugServerAction} className='flex flex-row gap-2 items-center justify-center py-2 text-black'>
  
          <select name='name' className='border-2 border-slate-700 flex px-2 py-1 rounded text-black w-4/5'>
            {years && years.results.map((item: string) => <option key={item}>{item}</option>)}
          </select>
  
          <button type='submit' className='hidden items-center justify-center md:flex ml-2 w-1/5'><RiSearch2Fill size={23} /></button>
  
        </form>
    )
  }