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


  const acadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id })
  const filteredYear = await searchParams && Object.keys(searchParams).length && acadYears.count && searchParams.academic_year && acadYears && acadYears.count ? searchParams.academic_year : acadYears.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)[0]

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsByDomainUrl, {
    school: params.school_id,
    academic_year: filteredYear,
    ...searchParams
  })

  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccDomainPage
          params={params}
          data={apiData}
          years={acadYears.results}
          thisYear={filteredYear}
          searchParams={searchParams}
        />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Domain-Accounting",
  description: "This is Domain Accounting Page",
};
