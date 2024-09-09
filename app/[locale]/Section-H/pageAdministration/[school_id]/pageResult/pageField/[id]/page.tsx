import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import Fields from './Field'

const page = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  console.log("Result Page Here !!!")
  
  return (
    <LayoutAdmin >
      <>
        <Breadcrumb
          pageName="Field" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration/pageResult" 
        />

        <Fields id={id} />
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Field",
  description: "This is Result Page",
};