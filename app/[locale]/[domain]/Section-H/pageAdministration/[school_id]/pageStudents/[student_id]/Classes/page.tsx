import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React from 'react'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter';
import { protocol } from '@/config';
import NotificationError from '@/section-h/common/NotificationError';
import ListStudsSpecialtiesPage from '@/componentsTwo/ListProfiles/ListStudsSpecialtiesPage';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: GetUserProfileInter | any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { 
    id: params.student_id, 
    fieldList: [ "id", "user__id", "user__full_name", "specialty__id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level" ] 
  });

  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.count && <ListStudsSpecialtiesPage params={params} data={apiData.results[0]} />}

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

