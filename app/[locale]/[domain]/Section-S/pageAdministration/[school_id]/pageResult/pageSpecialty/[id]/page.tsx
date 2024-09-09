import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import Specialty from './Specialty'

const page = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  
  return (
    <LayoutAdmin >
      <>
        <Breadcrumb
          pageName="Specialty" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration/pageResult" 
        />

        <Specialty id={id} />
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