import { Metadata } from 'next'
import React, { Suspense } from 'react';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { getData } from '@/functions';
import PromoteForm from './PromoteForm';
import NotificationError from '@/section-h/common/NotificationError';
import { redirect } from 'next/navigation';
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetProgramUrl, GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiStudents = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { specialty__id: params.specialty_id, active: true, fieldList: [
    "id", "user__id", "user__full_name", "user__matricle"
  ] })
  const apiSpecialty: GetSpecialtyInter[] = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { id: params.specialty_id, nopage: true,  fieldList: [
    "id", "level__level", "main_specialty__specialty_name", "main_specialty__field__id", "academic_year", "main_specialty__field__domain__id"
  ] })

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Promote - ${apiSpecialty && apiSpecialty.length > 0 && (apiSpecialty[0].main_specialty__specialty_name + " - " + apiSpecialty[0].academic_year + " - " + apiSpecialty[0].level__level)}`}
          pageName1="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote`}
        />

        {apiStudents && apiStudents["unauthorized"] && redirect(`/pageAuthentication/pageSessionExpired`)}

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <div className='flex flex-col gap-4'>

          {apiStudents && apiSpecialty && apiSpecialty.length > 0 && apiStudents.count ? <PromoteList params={params} apiStudents={apiStudents.results} specialty={apiSpecialty[0]} /> 
          : 
          <div className='bg-white flex font-semibold italic items-center justify-center py-40 rounded text-xl tracking-widest'>No Students in This Class</div>
          }

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


const PromoteList = async ({ apiStudents, params, specialty }: any) => {
  const getYear = (year: string) => {
    var start = [...year.slice(0, 4)]
    var end = [...year.slice(5, 9)]
    start[3] = (parseInt(start[3]) + 1).toString()
    end[3] = (parseInt(end[3]) + 1).toString()
    return start.join("") + "/" + end.join("")
  }
  const apiPrograms = await getData(protocol + "api" + params.domain + GetProgramUrl, { fieldList: [ "id", "name" ] })
  const thisYear = await getYear(specialty.academic_year)

  const apiNextSpecialty = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { 
    school__id: params.school_id,
    level__level: parseInt(specialty.level__level) + 100,
    main_specialty__field__domain__id: specialty.main_specialty__field__domain__id,
    academic_year: thisYear,
    fieldList: [
    "id", "level__level", "main_specialty__specialty_name", "academic_year"
  ] })
  

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div></div>

      <Suspense fallback={<div>Loading ...</div>}>
      { apiStudents &&<PromoteForm studentData={apiStudents} params={params}  programs={apiPrograms.results} nextSpecialty={apiNextSpecialty} />}
      </Suspense>


    </div>
  )
}