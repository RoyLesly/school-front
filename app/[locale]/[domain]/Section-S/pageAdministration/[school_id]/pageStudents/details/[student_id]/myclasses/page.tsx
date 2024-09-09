import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { Metadata } from 'next';
import React, { FC } from 'react'
import TabsStudent from '../TabsStudent';
import Classes from './Classes';
import { protocol } from '@/config';
import { UserProfileInter } from '@/serverActions/interfaces';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: UserProfileInter | any = await getData(protocol + GetSecondaryProfileUrl, { 
    id: params.student_id, nopage: true,
    fieldList: [ "id", "user__id", "user__full_name", "secondary_classroom__level__level", "secondary_classroom__level__option", "secondary_classroom__academic_year", "secondary_classroom__domain" ] 
  });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Classes"
          pageName1="Student"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={2} />

          {apiData && apiData.length > 0 && <Classes studentProfile={apiData[0]} />}
      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Student-Detail",
  description: "This is Student Detail Page",
};

