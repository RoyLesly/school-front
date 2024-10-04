import { Metadata } from 'next';
import React, { FC } from 'react'
import Link from 'next/link';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { AcademicYearUrl, GetPublishUrl, GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { getData } from '@/functions';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { getSession } from '@/serverActions/sessionAction';
import CreateMissingResults from './CreateMissingResultsD';
import { protocol } from '@/config';
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
// import CreateMissingResults from './CreateMissingResults';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcademicYear: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { ...searchParams, school: params.school_id })
  const apiResult: any = await getData( protocol + "api" + params.domain + GetResultUrl, { ...searchParams, course__id: params.course_id, course__semester: searchParams?.sem, nopage: true, fieldList: ["id", "course__specialty__id", "student__id"] })

  console.log(apiResult, 26)
  console.log(apiAcademicYear, 26)
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="SELECT"
          pageName1="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
        />

        {apiAcademicYear && apiAcademicYear.count && apiResult && apiResult.length > 0 ? <Select
          searchParams={searchParams}
          params={params}
          apiYear={apiAcademicYear}
          specialty_id={apiResult[0].course__specialty__id}
          results={apiResult}
        />
          :
          <div className='bg-black flex flex-col font-semibold gap-10 items-center justify-center py-32 rounded text-2xl text-white'>
            <div>Admit Student and Assign to Specialty</div>
            <div>OR</div>
            <div>Create Subject and Assign to Specialty</div>
            <div><Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/create?sub=${params.course_id}`} className='bg-bluedark my-2 p-2 px-6 rounded'>Generate Results</Link></div>
          </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Select-Marks",
  description: "This is Marks Page",
};


interface SelectProps {
  apiYear: any
  params: any
  searchParams: any
  specialty_id: number
  results: GetResultInter[]
}

const LinkOne: any = [
  { id: 1, page: "FillCAMarks?ca=I", title: "Sem I CA" },
  { id: 2, page: "FillExamMarks?exam=I", title: "Sem I Exam" },
  { id: 3, page: "FillResitMarks?resit=I", title: "Sem I Resit" },
]
const Links: any = [
  { id: 1, page: "FillCAMarks?ca=II", title: "Sem II CA" },
  { id: 2, page: "FillExamMarks?exam=II", title: "Sem II Exam" },
  { id: 3, page: "FillResitMarks?resit=II", title: "Sem II Resit" },
]

const Select: FC<SelectProps> = async ({ params, searchParams, apiYear, specialty_id, results }) => {

  const apiSpecialtyStudentsCount: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { ...searchParams, nopage: true, specialty__id: specialty_id, fieldList: ["id", "user__full_name"] })
  const stutIDs = await apiSpecialtyStudentsCount.map((item: GetResultInter) => item.id)
  const resIDs = await results.map((item: GetResultInter) => item.student__id)
  const filA = await stutIDs.filter((item: number) => !resIDs.includes(item))
  const filB = await apiSpecialtyStudentsCount.filter((item: GetResultInter) => item.id == (filA.length > 0 ? filA[0] : 0))
  const session = await getSession()

  console.log(apiSpecialtyStudentsCount.length, 95)
  console.log(results.length, 96)



  const apiDataPublish: any = await getData(protocol + "api" + params.domain + GetPublishUrl, {
    // specialty__level__academic_year: apiYear.results[apiYear.count - 1], specialty__id: specialty_id, fieldList: [
    specialty__id: specialty_id, fieldList: [
      "id", "specialty__id", "specialty__level__level", "specialty__academic_year", "specialty__main_specialty__field__domain__domain_name",
      "portal_ca", "portal_exam", "portal_resit", "semester"
    ]
  })

  console.log(searchParams)
  console.log(apiDataPublish, 105)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col justify-center px-20 rounded-sm shadow-default">

      {searchParams.sem == "I" && <div className='gap-10 grid grid-cols-3 items-center justify-center py-16'>
        {LinkOne.map((item: any) => (
          <Link
            className='bg-blue-900 flex font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full'
            key={item.id} href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${params.course_id}/${item.page}`}
          >
            {item.title}
          </Link>
        ))}
      </div>}

      {searchParams.sem == "II" && <div className='gap-10 grid grid-cols-3 items-center justify-center py-16'>
        {Links.map((item: any) => (
          <Link
            className='bg-blue-900 flex font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full'
            key={item.id} href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${params.course_id}/${item.page}`}
          >
            {item.title}
          </Link>
        ))}
      </div>}

      {apiSpecialtyStudentsCount.length > results.length ? <CreateMissingResults filB={filB} params={params} session={session} lecturer_id={searchParams.lec} /> : <></>}

    </div>
  )
}

