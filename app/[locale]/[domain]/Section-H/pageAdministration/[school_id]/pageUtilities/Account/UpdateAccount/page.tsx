import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetSysConstantUrl } from '@/Domain/Utils-H/appControl/appConfig'
import UpdateForm from './UpdateForm'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { })
  const apiSysConst: any = await getData(protocol + "api" + params.domain + GetSysConstantUrl, { sys_category__name: "Account", nopage: true })

  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiSysConst && apiAcadYears && apiSysConst.length && apiAcadYears.count && <UpdateForm params={params} years={apiAcadYears.results} accounts={apiSysConst} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin-Accounts",
  description: "This is Admin-Account Page",
};

