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

  const apiData: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { nopage: true, is_staff: false, school_id: params.school_id, role: "student", ...searchParams, fieldList: [
    "id", "full_name", "telephone", "matricle", "email", "sex", "is_active", "first_name", "last_name", "title", "dob", "pob", "last_login"
  ] })

  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListUsersPage params={params} data={apiData} user_type='Student' page={3} extra_data={["student"]} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Student Users",
  description: "This is Student Users Page",
};
