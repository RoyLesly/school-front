import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import MyPagination from '@/NoDomain/section-h/common/Pagination/MyPagination'
import { redirect } from 'next/navigation';
import { GrStatusGood } from 'react-icons/gr'
import { FaArrowRight } from 'react-icons/fa6'
import Link from 'next/link'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import ServerError from '@/NoDomain/section-h/common/ServerError'
import { AcademicYearUrl, GetPublishUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetPublishInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcademicYear: any = await getData(protocol + AcademicYearUrl, { ...searchParams })

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Publish Results - ${searchParams && !searchParams.specialty__academic_year ? apiAcademicYear && apiAcademicYear.count && apiAcademicYear.results[apiAcademicYear.count - 1] : searchParams?.specialty__academic_year}`}
          pageName1="Main Dashboard"
          link1={`/Section-H/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiAcademicYear == "ECONNREFUSED" && <ServerError />}

        <div className='flex flex-col gap-4'>

          {apiAcademicYear && apiAcademicYear.count && <PublishList searchParams={searchParams} params={params} apiYear={apiAcademicYear.results} />}

        </div>

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Publish",
  description: "This is Publish Page",
};


const PublishList = async ({ apiYear, params, searchParams }: any) => {

  const apiDataI: any = await getData(protocol + GetPublishUrl, {
      specialty__academic_year: apiYear[apiYear.length - 1], ...searchParams, semester: "I", fieldList: [
      "id", "ca", "semester", "exam", "resit", "specialty__level__level", "specialty__academic_year", "specialty__main_specialty__specialty_name"
    ]
  })
  const apiDataII: any = await getData(GetPublishUrl, {
    specialty__academic_year: apiYear[apiYear.length - 1], ...searchParams, semester: "II", fieldList: [
      "id", "ca", "semester", "exam", "resit", "specialty__level__level", "specialty__academic_year", "specialty__main_specialty__specialty_name"
    ]
  })

  const onSearchPubishServerAction = async (formData: FormData) => {
    'use server'

    const year = formData.get("year")

    if (year && year.toString().length > 1) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish?specialty__academic_year=${year}`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish`)

  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex items-center justify-center my-2 text-lg'>
        <form action={onSearchPubishServerAction} className='flex gap-4'>
          <select name="year" className='px-4 py-2' defaultValue={apiYear[apiYear.length - 1]}>
            {apiYear.map((item: string) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button type='submit'>Search</button>
        </form>
      </div>

      <div className='border-2 my-2 rounded'>
        <div className="bg-blue-800 border-t dark:border-strokedark grid grid-cols-8 md:px-6 px-4 py-2 sm:text-xl text-white">

          <div className="col-span-2 flex items-center w-full">
            <span className="font-medium w-full">Specialty</span>
          </div>
          <div className="col-span-2 flex items-center w-full">
            <span className="font-medium">Year / Level</span>
          </div>
          <div className="flex items-center w-full">
            <span className="font-medium">Semester</span>
          </div>
          <div className="flex items-center w-20">
            <span className="font-medium">CA</span>
          </div>
          <div className="flex items-center w-20">
            <p className="font-medium">Exam</p>
          </div>
          <div className="items-center sm:flex w-20">
            <p className="font-medium">Resit</p>
          </div>
        </div>
        {apiDataI && apiDataI.results && apiDataI.results.map((item: GetPublishInter, key: number) => (
          <div
            className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-8 md:px-6 px-4 py-2 sm:text-xl"
            key={key}
          >
            <div className="col-span-2 flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm">
                {item.specialty__main_specialty__specialty_name}
              </span>
            </div>
            <div className="col-span-2 flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm w-full">
                {item.specialty__academic_year} - {item.specialty__level__level}
              </span>
            </div>
            <div className="flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white flex italic items-center text-black text-sm w-full">
                {item.semester}
              </span>
            </div>
            <div className="flex items-center justify-center w-32">
              {item.ca ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?ca=true`}><FaArrowRight /></Link>}
            </div>
            <div className="flex items-center justify-center w-32">
              {item.exam ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?exam=true`}><FaArrowRight /></Link>}
            </div>
            <div className="flex items-center justify-center w-32">
              {item.resit ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?resit=true`}><FaArrowRight /></Link>}
            </div>
          </div>
        ))}

        {
          apiDataI && <MyPagination
            prevLink={apiDataI.previous}
            nextLink={apiDataI.next}
            count={apiDataI.count}
            thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish`}
          />
        }
      </div>



      <div className='border-2 my-2 rounded'>

        <div className="bg-blue-800 border-stroke border-t dark:border-strokedark grid grid-cols-8 md:px-6 px-4 py-2 sm:text-xl text-white">

          <div className="col-span-2 flex items-center w-full">
            <span className="font-medium w-full">Specialty</span>
          </div>
          <div className="col-span-2 flex items-center w-full">
            <span className="font-medium">Year / Level</span>
          </div>
          <div className="flex items-center w-full">
            <span className="font-medium">Semester</span>
          </div>
          <div className="flex items-center w-20">
            <span className="font-medium">CA</span>
          </div>
          <div className="flex items-center w-20">
            <p className="font-medium">Exam</p>
          </div>
          <div className="items-center sm:flex w-20">
            <p className="font-medium">Resit</p>
          </div>
        </div>
        {apiDataII && apiDataII.results && apiDataII.results.map((item: GetPublishInter, key: number) => (
          <div
            className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-8 md:px-6 px-4 py-2 sm:text-xl"
            key={key}
          >
            <div className="col-span-2 flex font-medium items-center tracking-wider w-full">
              <p className="dark:text-white italic text-black text-sm">
                {item.specialty__main_specialty__specialty_name}
              </p>
            </div>
            <div className="col-span-2 flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm w-full">
                {item.specialty__academic_year} - {item.specialty__level__level}
              </span>
            </div>
            <div className="flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm w-full">
                {item.semester}
              </span>
            </div>
            <div className="flex items-center justify-center w-32">
              {item.ca ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?ca=true`}><FaArrowRight /></Link>}
            </div>
            <div className="flex items-center justify-center w-32">
              {item.exam ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?exam=true`}><FaArrowRight /></Link>}
            </div>
            <div className="flex items-center justify-center w-32">
              {item.resit ? <GrStatusGood color='green' size={30} /> : <Link className="border px-2 py-1 rounded" href={`/pageAdministration/${params.school_id}/pageResult/pagePublish/${item.id}?resit=true`}><FaArrowRight /></Link>}
            </div>
          </div>
        ))}

        {
          apiDataII && <MyPagination
            prevLink={apiDataII.previous}
            nextLink={apiDataII.next}
            count={apiDataII.count}
            thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish`}
          />
        }

      </div>
    </div>
  )
}