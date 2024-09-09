import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetFieldUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListFieldPage from '@/componentsTwo/ListSettings/ListFieldPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetFieldUrl, { ...searchParams, fieldList: [ "id", "field_name", "domain__domain_name", "domain__id"] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListFieldPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Field-Settings",
  description: "This is Fields Settings Page",
};
