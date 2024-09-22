import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListLecturersPage from '@/componentsTwo/ListProfiles/ListLecturersPage'
import { GetCustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, is_staff: false, role: "teacher", school__id: params.school_id, ...searchParams, fieldList: [
    "id", "matricle", "full_name", "telephone", "username", "email", "sex", "title", "first_name", "last_name", "title", "dob", "pob"
  ] })

  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListLecturersPage params={params} data={apiData} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Lecturer Settings",
  description: "This is Lecturer Settings Page",
};
