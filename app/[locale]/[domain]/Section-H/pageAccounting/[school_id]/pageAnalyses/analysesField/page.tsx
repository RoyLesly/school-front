import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetStatsByFieldUrl } from '@/Domain/Utils-H/dashControl/dashConfig'
import { AcademicYearUrl, GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccFieldPage from '@/componentsTwo/ListAccounting/ListAccFieldPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {


  const apiYears = await getData(protocol + "api" + params.domain + AcademicYearUrl, {})
  const filteredYear = await searchParams && Object.keys(searchParams).length && apiYears.count && searchParams.academic_year && apiYears && apiYears.count ? searchParams.academic_year : apiYears.results.sort((a: string, b: string) => a[3]<b[3] ? 1 : a[3]>b[3] ? -1 : 0)[0]

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsByFieldUrl, { 
    school: params.school_id,
    academic_year: filteredYear,
    ...searchParams
  })
  
  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccFieldPage
          params={params} data={apiData}
          years={apiYears.results} 
          thisYear={filteredYear} 
          />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Field-Accounting",
  description: "This is Field Accounting Page",
};
