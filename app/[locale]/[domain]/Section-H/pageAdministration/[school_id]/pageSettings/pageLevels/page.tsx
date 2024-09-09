import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListLevelPage from '@/componentsTwo/ListSettings/ListLevelPage'
import { GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetLevelUrl, { ...searchParams })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListLevelPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Level-Settings",
  description: "This is Levels Settings Page",
};
