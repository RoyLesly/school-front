import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListStudsInfoPage from '@/componentsTwo/ListProfiles/ListStudsInfoPage'
import ListStudsTransactionsPage from '@/componentsTwo/ListProfiles/ListStudsTransactionsPage'
import { GetSchoolFeesUrl, GetTransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetTransactionUrl, { 
    nopage: true, schoolfees__userprofile__id: params.student_id, ...searchParams, fieldList: [
    "id", "schoolfees__userprofile__user__matricle", "schoolfees__userprofile__user__full_name", "schoolfees__userprofile__specialty__main_specialty__specialty_name", 
    "schoolfees__userprofile__specialty__academic_year", "schoolfees__userprofile__specialty__level__level", "created_at", "amount", "reason", "account",
    "schoolfees__userprofile__specialty__tuition", "schoolfees__balance"
] })
  const apiDataFees: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { 
    nopage: true, userprofile__id: params.student_id, ...searchParams, fieldList: [
    "id", "userprofile__user__matricle", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", 
    "userprofile__specialty__academic_year", "userprofile__specialty__level__level",
    "userprofile__specialty__tuition", "balance"
] });
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListStudsTransactionsPage params={params} data={apiData} school={apiDataFees[0]} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Fees Settings",
  description: "This is Fees Settings Page",
};
