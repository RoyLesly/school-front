import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import TabsStudent from './TabsStudent';
import SpecialtyAssignment from './SpecialtyAssignment';
import { GetUserProfileUrl, UserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { CustomUserInter } from '@/Domain/Utils-H/userControl/userInter';
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl, GetMainSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { ActionEdit } from '@/serverActions/actionGeneral';
import NotificationError from '@/section-h/common/NotificationError';
import { protocol } from '@/config';
import { SchemaAssignSpecialty } from '@/Domain/schemas/schemas';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.student_id, fieldList: [ 
    "id",
    "user__id",
    "program__id",
  ] });
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Assign Student To Class"
          pageName1="Student"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={1} />

        {apiData && <AssignSpecialty apiData={apiData.results[0]} params={params} searchParams={searchParams} />}
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


interface AssignSpecialtyProps {
  searchParams: CustomUserInter | any
  apiData: CustomUserInter | any
  params: any
}

const AssignSpecialty: FC<AssignSpecialtyProps> = async ({ apiData, params, searchParams }) => {

  const domain: any = await getData(protocol + "api" + params.domain + GetDomainUrl, {});
  const mainSpecialty: any = await getData(protocol + "api" + params.domain + GetMainSpecialtyUrl, {});
  const academicYear: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, {});
  const level: any = await getData(protocol + "api" + params.domain + GetLevelUrl, {});

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const domainID = formData.get("domain_id")
    const academicYear = formData.get("academic_year")
    const level = formData.get("level_id")
    const specialty_id = formData.get("specialty_id")

    const data = {
      ...apiData,
      user_id: apiData.user__id,
      program_id: apiData.program__id,
      studentID: params.student_id,

      domainID: domainID ? domainID : 0,
      academicYear: academicYear ? academicYear : "",
      levelID: level ? level : 0,
      specialty_id: specialty_id ? specialty_id : 0,
    }

    const response = await ActionEdit(data, params.student_id, SchemaAssignSpecialty, protocol + "api" + params.domain + UserProfileUrl, `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned`)

    if (response?.detail) {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}?error=Error-${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned?updated=${response.user.full_name}-Assigned-to-${JSON.stringify(response.specialty?.main_specialty?.specialty_name).replaceAll(" ", "-")}`)
    } else {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
    }
  }

  console.log("object")

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-9">
            {/* <!-- Input Fields --> */}
            <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
              <div className="border-b border-stroke dark:border-strokedark flex flex-col items-center justify-between md:flex-row px-6.5 py-2">
                <h3 className="dark:text-white font-medium text-black">
                  {apiData.user__full_name}
                </h3>

                <NotificationError errorMessage={searchParams} />

              </div>

              <SpecialtyAssignment 
                domain={domain && domain.results}
                mainSpecialty={mainSpecialty && mainSpecialty.results}
                academicYear={academicYear && academicYear.results}
                level={level && level.results}
                onSubmitServerAction={onSubmitServerAction}
                school_id={params.school_id}
              />

            </div>


          </div>
        </div>
      </div>

    </div>
  )
}