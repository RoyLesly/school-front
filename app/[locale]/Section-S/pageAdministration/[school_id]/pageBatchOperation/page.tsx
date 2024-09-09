import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  console.log("Batch Page Here !!!")
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Batch Operation" 
          pageName1="Dashboard" 
          link1="/pageAdministration" 
        />

        <div>
          Batch Operation Page
        </div>
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Batch Operation",
  description: "This is Batch Operation Page",
};