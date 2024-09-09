import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SelectSpecialty from './SelectSpecialty'
import { redirect } from 'next/navigation'
import NotificationError from '@/section-h/common/NotificationError'
import { GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true });
  console.log(apiDomains)

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Select Class and Semester For Course Assignment`}
                pageName1="Dashboard" 
                link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiDomains && <Select params={params} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };


const Select = ({ params }: any) => {
  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const specialty_id = formData.get("specialty_id")
    const semester = formData.get("semester")

    if (!specialty_id) return;
    if (!semester) return;

    if (specialty_id && semester) { 
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment/Actions?specialty_id=${specialty_id}&semester=${semester}` )
    }
  }

    return <form className='border-2 flex flex-col gap-10 items-center justify-center rounded' action={onSubmitServerAction}>

      <SelectSpecialty params={params} />

      <button type='submit' className='bg-green-500 font-medium my-10 px-6 py-2 rounded text-lg text-white'>Next</button>
      

    </form>
}