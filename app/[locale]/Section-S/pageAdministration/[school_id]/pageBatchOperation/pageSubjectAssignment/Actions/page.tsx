import { Metadata } from 'next'
import React from 'react'
import SubjectAssignAction from './SubjectAssignAction'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import { GetMainSubjectUrl } from '@/NoDomain/Utils-S/appControl/appConfig'
import NotificationError from '@/section-s/common/NotificationError'
import { GetCustomUserUrl } from '@/NoDomain/Utils-S/userControl/userConfig'
import Link from 'next/link'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetMainSubjectUrl, { nopage: true });
  const apiLecturer: any = await getData(protocol + GetCustomUserUrl, { role: "teacher", is_active: true, is_staff: false, nopage: true, school__campus__id: params.school_id, fieldList: ["id", "full_name"] });
  const apiAdmin: any = await getData(protocol + GetCustomUserUrl, { role: "admin", is_active: true, is_staff: false, nopage: true, school__campus__id: params.school_id, fieldList: ["id", "full_name"] });

  console.log(apiLecturer, 23)
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Set Subject Properties`}
          pageName1="Back"
          link1={`/pageAdministration/${params.school_id}/pageBatchOperation/pageSubjectAssignment`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiLecturer && apiLecturer.length > 0 ?
          apiData && <SubjectAssignAction apiData={apiData} searchParams={searchParams} apiAdmin={apiAdmin} apiLecturer={apiLecturer} />
          :
          <div className="flex flex-col font-semibold gap-10 items-center justify-center pb-32 pt-40 tracking-widest">
            <div className='italic text-2xl'>No Lecturers</div>
            <Link href={`/pageAdministration/${params.school_id}/pageLecturers/pageAdmission`} className='bg-bluedark px-6 py-1 rounded text-lg text-white'>New Lecturer</Link>
          </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
  title:
    "Course Assignment",
};