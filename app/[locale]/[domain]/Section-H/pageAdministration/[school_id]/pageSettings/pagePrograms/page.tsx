import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetProgramUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListProgramPage from '@/componentsTwo/ListSettings/ListProgramPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetProgramUrl, { ...searchParams })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListProgramPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Programs Settings",
  description: "This is Programs Settings Page",
};
