import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetStatsBySpecialtyUrl } from '@/Domain/Utils-H/dashControl/dashConfig'
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccTransactionPage from '@/componentsTwo/ListAccounting/ListAccTransactionPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {


  const apiYears = await getData(protocol + "api" + params.domain + AcademicYearUrl, {})
  const apiDomains = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true })
  const apiLevels = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true })
  const filteredYear = await searchParams && Object.keys(searchParams).length && apiYears.count && searchParams.academic_year && apiYears && apiYears.count ? searchParams.academic_year : apiYears.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)[0]

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsBySpecialtyUrl, {
    school: params.school_id,
    academic_year: filteredYear,
    ...searchParams
  })

  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccTransactionPage
          params={params} data={apiData} years={apiYears.results}
          thisYear={filteredYear}
          domains={apiDomains}
          levels={apiLevels}
        />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Class-Accounting",
  description: "This is Class Accounting Page",
};
