

import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import React, { FC } from 'react'
import Link from 'next/link';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { AcademicYearUrl, GetPublishUrl, GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { getData } from '@/functions';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string, subject_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcademicYear: any = await getData(protocol + AcademicYearUrl, { ...searchParams })
  const apiResult: any = await getData(protocol + GetResultUrl, { ...searchParams, subject__id: params.subject_id, fieldList: ["id", "course__specialty__id"] })

  console.log(apiResult, 20)


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="SELECT"
          pageName1="Back"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
        />

        {apiAcademicYear && apiAcademicYear.count && apiResult && apiResult.count ? <Select
          searchParams={searchParams}
          params={params}
          apiYear={apiAcademicYear}
          classroom_id={apiResult.results[0].subject__classroom__id}
        />
          :
          <div className='bg-black flex flex-col font-semibold gap-10 items-center justify-center py-32 rounded text-2xl text-white'>
            <div>Admit Student and Assign to Specialty</div>
            <div>OR</div>
            <div>Create Subject and Assign to Specialty</div>
            <div><Link href={`/Section-H/pageAdministration/${params.school_id}/pageResult/create?sub=${params.subject_id}`} className='bg-bluedark my-2 p-2 px-6 rounded'>Generate Results</Link></div>
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
  classroom_id: number
}

const Links: any = [
  { id: 1, page: "FillSeqMarks", title: "Submit Sequence 1" },
  { id: 3, page: "FillSeqMarks", title: "Submit Sequence 3" },
  { id: 5, page: "FillSeqMarks", title: "Submit Sequence 5" },
  { id: 2, page: "FillSeqMarks", title: "Submit Sequence 2" },
  { id: 4, page: "FillSeqMarks", title: "Submit Sequence 4" },
  { id: 6, page: "FillSeqMarks", title: "Submit Sequence 6" },
  // { id: 7, page: "FillExamMarks", title: "Submit Exam 1"},
  // { id: 8, page: "FillExamMarks", title: "Submit Exam 2"},
  // { id: 9, page: "FillExamMarks", title: "Submit Exam 3"},
]

const Select: FC<SelectProps> = async ({ params, searchParams, apiYear, classroom_id }) => {

  const apiDataPublish: any = await getData(GetPublishUrl, {
    classroom__academic_year: apiYear.results[apiYear.count - 1], classroom__id: classroom_id, fieldList: [
      "id", "classroom__id", "classroom__level__level", "classroom__level__option", "classroom__domain",
      "publish_item", "publish_type", "publish", "portal", "created_by__full_name",
    ]
  })

  console.log(apiDataPublish, 74)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex justify-center rounded-sm shadow-default">

      <div className='gap-10 grid grid-cols-3 items-center justify-center px-10 py-10'>
        {Links.map((item: any) => (
          <Link
            className='bg-blue-900 flex font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full'
            key={item.id} href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${params.subject_id}/${item.page}?type=${item.id}`}
          >
            {item.title}
          </Link>
        ))}
      </div>

    </div>
  )
}