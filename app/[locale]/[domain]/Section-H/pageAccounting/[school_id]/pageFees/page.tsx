import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetDomainUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccTransactionNewPage from '@/componentsTwo/ListAccounting/ListAccTransactionNewPage'
import { GetSchoolFeesUrl, GetTransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  console.log(new Date().toISOString().slice(0, 10))

  const apiTodayTransactions: any = await getData(protocol + "api" + params.domain + GetTransactionUrl, { nopage: true, 
    created_at: new Date().toISOString().slice(0, 10),
    fieldList: [ "id", "schoolfees__userprofile__user__full_name", "schoolfees__balance", "amount", "schoolfees__userprofile__specialty__main_specialty__specialty_name",
      "schoolfees__userprofile__specialty__level__level", "payment_method", "telephone", "amount", "reason", ] })
  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true })
  const apiSchoolFees: any = searchParams && Object.keys(searchParams) && searchParams.value ? await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { 
    nopage: true, 
    userprofile__user__full_name: searchParams.value, userprofile__specialty__main_specialty__field__domain__id: searchParams.domain, 
    fieldList: [ "id", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__level__level",
      "userprofile__specialty__academic_year", "balance"
    ]
  }) : undefined

  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiDomains && <ListAccTransactionNewPage
          params={params} 
          data={apiTodayTransactions}
          apiDomains={apiDomains}
          apiSchoolFees={apiSchoolFees}
        />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "New Transaction",
  description: "This is New Transaction Accounting Page",
};
