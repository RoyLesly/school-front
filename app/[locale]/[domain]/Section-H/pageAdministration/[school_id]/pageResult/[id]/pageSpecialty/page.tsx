import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Specialty from './Specialty'

const page = () => {
  
  return (
    <LayoutAdmin >
      <>
        <Breadcrumb
          pageName="Specialty" 
          pageName1="Main Dashboard" 
          link1="/Section-H/Section-H/pageAdministration/pageResult" 
        />

        <Specialty />
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Specialty",
  description: "This is Result Page",
};