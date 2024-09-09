import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import React, { FC } from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { GetResultClassroomUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { protocol } from '@/config';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, classroom_id: string };
  searchParams?: { sequence: string };
}) => {

    const apiClassResult = await getData(protocol + GetResultClassroomUrl, { student__classroom__id: params.classroom_id})
    console.log(apiClassResult, 18)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="SELECT"
          pageName1="Back"
          link1={`/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
        />

        {apiClassResult && apiClassResult.length == 2 && <ClassListMarks
          results={apiClassResult[1]}
          subjects={apiClassResult[0]}
          params={params}
        />}
        
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Class-List-Marks",
  description: "This is Marks Page",
};


interface SelectProps {
  results: any
  subjects: any
  params: any
}

const ClassListMarks: FC<SelectProps> = async ({ params, results, subjects }) => {
    console.log(results[1], 58)

  return (
    <div className="bg-white border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col gap-10 h-full justify-center rounded-sm shadow-default">


    </div>
  )
}