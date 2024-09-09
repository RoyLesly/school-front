import { Metadata } from 'next'
import React from 'react'
import SessionExpired from '@/section-s/common/SessionExpired'
import { revalidatePath } from 'next/cache'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import NotLoggedIn from '@/section-s/common/NotLoggedIn'
import { getSession } from '@/serverActions/sessionAction'


interface PageProps {
  id: number
  title: string
  link: string
}
const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const session = await getSession();

  if (!session.isLoggedIn) {
    return <NotLoggedIn />
  }

  if (session.isLoggedIn){
    revalidatePath("/pageAdministration")

    if (new Date(session.exp) < new Date()){
      return <SessionExpired />
    }
 
    return (
      <LayoutAdmin>
        <>
          <Breadcrumb
            pageName="Dashboard" 
            link1={`/Section-S/pageAdministration/${params.school_id}`}
          />

          <div className='gap-4 grid grid-cols-2 h-full md:gap-10 md:grid-cols-3 md:p-6'>
            T      
          </div>
        </>
      </LayoutAdmin>
    )
  }
}

export default page

export const metadata: Metadata = {
  title:
    "Admin-Page",
};