import { Metadata } from 'next'
import React from 'react'
import TabsAdmin from './TabsAdmin'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Admin" 
          pageName1="Dashboard" 
          link1="/pageAdministration" 
        />

        <TabsAdmin school_id={params.school_id} />

        <AdminPage />

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Admin",
  description: "This is Admin Page",
};


const AdminPage = () => {

  return (
    <div>Admin Page</div>
  )
}