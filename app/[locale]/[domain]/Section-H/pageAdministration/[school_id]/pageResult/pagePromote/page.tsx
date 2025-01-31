import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { redirect } from 'next/navigation';
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import Link from 'next/link'
import { AcademicYearUrl, GetDomainUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetDomainInter, GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter'
import { protocol } from '@/config'
import SearchButton from '@/section-h/common/SearchButton'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcademicYear: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { ...searchParams, school: params.school_id })

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Promote - ${searchParams && !searchParams.specialty__academic_year ? apiAcademicYear && apiAcademicYear.count && apiAcademicYear.results[apiAcademicYear.count - 1] : searchParams?.specialty__academic_year}`}
          pageName1="Main Dashboard"
          link1={`/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiAcademicYear == "ECONNREFUSED" && <ServerError />}

        <div className='flex flex-col gap-4'>

          {apiAcademicYear && apiAcademicYear.count && <PromoteList searchParams={searchParams} params={params} apiYear={apiAcademicYear.results} />}

        </div>

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Promote",
  description: "This is Promote Page",
};


const PromoteList = async ({ apiYear, params, searchParams }: any) => {

  const apiDomain: any = await getData( protocol + "api" + params.domain + GetDomainUrl, { fieldList: [ "id", "domain_name" ] });

  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { ...searchParams, school__id: params.school_id, nopage: true,  fieldList: [
      "id", "level__level", "academic_year", "main_specialty__specialty_name"
    ]
  })


  const onSearchServerAction = async (formData: FormData) => {
    'use server'

    const domain = formData.get("domain")
    const year = formData.get("year")

    if (year && year.toString().length > 1 && domain) {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote?academic_year=${year}&main_specialty__field__domain__id=${domain}`)
    }
    redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote`)

  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex items-center justify-center my-2 text-lg'>
        <form action={onSearchServerAction} className='flex gap-4'>
          <select name="domain" className='border px-4 py-2' defaultValue={""}>
            <option value={""}>----------------</option>
            {apiDomain && apiDomain.count && apiDomain.results.map((item: GetDomainInter) => (
              <option key={item.id} value={item.id}>{item.domain_name}</option>
            ))}
          </select>
          <select name="year" className='px-4 py-2' defaultValue={apiYear[apiYear.length - 1]}>
            {apiYear.map((item: string) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <SearchButton />
        </form>
      </div>

      <div className='border-2 my-2 rounded'>
        <div className="bg-bluedark border-t dark:border-strokedark grid grid-cols-7 md:px-6 px-4 py-2 sm:text-xl text-white">

          <div className="flex items-center w-full">
            <span className="font-medium w-full">No</span>
          </div>
          <div className="col-span-3 flex items-center w-full">
            <span className="font-medium w-full">Specialty</span>
          </div>
          <div className="col-span-2 flex items-center w-full">
            <span className="font-medium">Year / Level</span>
          </div>
          <div className="flex items-center justify-center w-full">
            <span className="font-medium">Action</span>
          </div>
        </div>
        {apiSpecialty && apiSpecialty.length > 0 && apiSpecialty.map((item: GetSpecialtyInter, key: number) => (
          <div
            className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-7 md:px-6 px-4 py-2 sm:text-xl"
            key={key}
          >
            <div className="flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm">
                {key + 1}
              </span>
            </div>
            <div className="col-span-3 flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm">
                {item.main_specialty__specialty_name}
              </span>
            </div>
            <div className="col-span-2 flex font-medium items-center tracking-wider w-full">
              <span className="dark:text-white italic text-black text-sm w-full">
                {item.academic_year} - {item.level__level}
              </span>
            </div>
            <div className="flex items-center justify-center w-full">
              <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote/${item.id}`} className="bg-bluedark flex font-medium italic items-center px-4 py-1 rounded text-center text-white">
                Select
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}