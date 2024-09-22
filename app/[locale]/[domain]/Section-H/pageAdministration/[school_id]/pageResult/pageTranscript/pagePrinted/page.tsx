import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetTranscriptApplicationUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import ListTranscriptPrintedPage from '@/componentsTwo/ListResult/ListTranscriptPrintedPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiTranscriptApplications: any = await getData(protocol + "api" + params.domain + GetTranscriptApplicationUrl, { nopage: true, status: "PRINTED", ...searchParams, fieldList: [
    "id", "status", "approved_by__full_name", "printed_by__full_name", "approved_at", "printed_at", "created_at", "print_count", "userprofile__id",
    "userprofile__user__full_name", "userprofile__user__matricle", "userprofile__user__sex", "userprofile__user__telephone",
    "userprofile__specialty__id", "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__academic_year", "userprofile__specialty__level__level"
  ] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiTranscriptApplications && <ListTranscriptPrintedPage params={params} data={apiTranscriptApplications} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Transcript",
  description: "This is Transcript Page",
};
