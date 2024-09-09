import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetStatsByDomainUrl } from '@/Domain/Utils-H/dashControl/dashConfig'
import { AcademicYearUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccDomainPage from '@/componentsTwo/ListAccounting/ListAccDomainPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {


  const apiYears = await getData(protocol + "api" + params.domain + AcademicYearUrl, {})
  const filteredYear = await searchParams && Object.keys(searchParams).length && apiYears.count && searchParams.academic_year && apiYears && apiYears.count ? searchParams.academic_year : apiYears.results.sort((a: string, b: string) => a[3]<b[3] ? 1 : a[3]>b[3] ? -1 : 0)[0]

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsByDomainUrl, { 
    school: params.school_id,
    academic_year: filteredYear,
    ...searchParams
  })
  
  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccDomainPage params={params} data={apiData} years={apiYears.results} thisYear={filteredYear} />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Domain-Accounting",
  description: "This is Domain Accounting Page",
};
