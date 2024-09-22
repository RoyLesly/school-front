import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetSchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import ListPendingPlatformPage from '@/componentsTwo/ListUtitlity/ListPendingPlatformPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { 
    nopage: true, userprofile__specialty__school__campus__id: params.school_id, platform_paid: false, userprofile__no_specialty: false, ...searchParams, fieldList: [ 
    "id", "userprofile__id", "userprofile__user__full_name", "userprofile__user__username", "userprofile__user__matricle", "platform_charges", "balance",
    "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__level__level"
  ] });  

  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.length && <ListPendingPlatformPage params={params} data={apiData} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation-Settings",
  description: "This is Activation-Settings Page",
};

