import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListMainSpecialtyPage from '@/componentsTwo/ListSettings/ListMainSpecialtyPage'
import { GetMainSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetMainSpecialtyUrl, { ...searchParams, fieldList: [
    "id", "specialty_name", "specialty_name_short", "field__id", "field__field_name",
  ] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListMainSpecialtyPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Main-Specialty Settings",
  description: "This is Main-Specialty Settings Page",
};
