import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import { AcademicYearUrl, GetDomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import SelectSpecialty from './SelectSpecialty'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const apiDomains: any = await getData(protocol + GetDomainUrl, { nopage: true });
  const apiYears: any = await getData(protocol + AcademicYearUrl, { nopage: true });

  console.log(apiDomains, 22)

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Import Classes From Another Year`}
                pageName1="Dashboard" 
                link1="/pageShop" 
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiDomains && apiYears && apiYears.count && <SelectSpecialty params={params} apiDomains={apiDomains} apiYears={apiYears.results} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };
