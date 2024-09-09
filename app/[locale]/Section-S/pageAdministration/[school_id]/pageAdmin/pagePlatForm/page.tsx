import { Metadata } from 'next'
import React, { FC } from 'react'
import Link from 'next/link'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import TabsAdmin from '../TabsAdmin'

const page = () => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Admin"
          pageName1="Dashboard"
          link1="/pageAdministration"
        />

        <TabsAdmin />

        <PlatFormPage />

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


const PlatFormPage = () => {

  return (
    <div>PlatForm Page</div>
  )
}