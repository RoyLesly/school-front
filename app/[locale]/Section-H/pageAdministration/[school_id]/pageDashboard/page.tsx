import { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import { revalidatePath } from 'next/cache'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import NotLoggedIn from '@/NoDomain/section-h/common/NotLoggedIn'
import { getSession } from '@/serverActions/sessionAction'


interface PageProps {
  id: number
  title: string
  link: string
}
const page = async () => {

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
            link1="/pageAdministration" 
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