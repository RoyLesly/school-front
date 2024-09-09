import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import TabsAdmin from './TabsAdmin'

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
          link1="/Section-H/pageAdministration" 
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