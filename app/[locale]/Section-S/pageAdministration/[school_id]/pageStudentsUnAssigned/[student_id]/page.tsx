import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { GetSecondaryProfileUrl, SecondaryProfileUrl } from '@/NoDomain/Utils-S/userControl/userConfig';
import { CustomUserInter, GetSecondaryProfileInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import TabsStudent from './TabsStudent';
import ClassAssignment from './ClassAssignment';
import { AcademicYearUrl, GetLevelUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { SchemaAssignClassroom } from '@/NoDomain/Utils-S/schemas/schemas';
import NotificationError from '@/section-s/common/NotificationError';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetSecondaryProfileUrl, { nopage: true, id: params.student_id, fieldList: [ 
    "id", "user__id",
  ] });
  
  console.log(apiData, 28)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Assign Student To Class"
          pageName1="Student"
          link1={`/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={1} />

        {apiData && apiData.length > 0 && <AssignSpecialty apiData={apiData[0]} params={params} searchParams={searchParams} />}
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
  apiData: GetSecondaryProfileInter
  params: { school_id: string, student_id: string}
}

const AssignSpecialty: FC<AssignSpecialtyProps> = async ({ apiData, params, searchParams }) => {

  const academicYear: any = await getData(AcademicYearUrl, {});
  const level: any = await getData(GetLevelUrl, {});

  const onSubmitServerAction = async (formData: FormData) => {
    'use server'

    const session = formData.get("session")
    const classroom_id = formData.get("classroom_id")


    const data = {
      ...apiData,
      user_id: apiData.user__id,
      session: session,
      classroom_id: classroom_id ? classroom_id : 0,
    }

    const response = await ActionEdit(data, params.student_id, SchemaAssignClassroom,  protocol + SecondaryProfileUrl, `/Section-S/pageAdministration/${params.school_id}/pageStudentsUnAssigned`)

    if (response?.detail) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}?error=Error-${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
    }
    if (response?.id) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents?updated=${response.user.full_name} - Assigned Successfully`)
    } else {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudentsUnAssigned/${params.student_id}?error=Error-${JSON.stringify(response).replaceAll(" ", "-")}`)
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

              <ClassAssignment 
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