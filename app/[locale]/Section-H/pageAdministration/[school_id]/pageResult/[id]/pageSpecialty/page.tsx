import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import Specialty from './Specialty'

const page = () => {
  
  return (
    <LayoutAdmin >
      <>
        <Breadcrumb
          pageName="Specialty" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration/pageResult" 
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