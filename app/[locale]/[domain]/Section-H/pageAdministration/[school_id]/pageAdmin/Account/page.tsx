import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import ListAccountPage from '@/componentsTwo/List/ListAccountPage'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetAccountUrl } from '@/Domain/Utils-H/feesControl/feesConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  console.log(searchParams);

  const apiData: any = await getData(protocol + "api" + params.domain + GetAccountUrl, {  ...searchParams, fieldList: [ "id", "name", "number", "status", "year", "balance"]})
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiData.results && <ListAccountPage params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin-Accounts",
  description: "This is Admin-Depts Page",
};
