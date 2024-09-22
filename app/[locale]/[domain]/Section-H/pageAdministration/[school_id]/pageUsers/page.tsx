import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListLecturersPage from '@/componentsTwo/ListProfiles/ListLecturersPage'
import { GetCustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListUsersPage from '@/componentsTwo/ListProfiles/ListUsersPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, is_staff: false, role: "admin", school__id: params.school_id, ...searchParams, fieldList: [
    "id", "full_name", "telephone", "matricle", "email", "sex", "is_active", "first_name", "last_name", "title", "dob", "pob", "last_login"
  ] })

  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListUsersPage params={params} data={apiData} user_type='Admin' page={1} extra_data={["admin"]} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Admin Users",
  description: "This is Admin Users Page",
};
