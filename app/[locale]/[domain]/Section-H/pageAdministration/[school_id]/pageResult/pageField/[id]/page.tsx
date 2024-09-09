import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Fields from './Field'

const page = ({
  params,
  searchParams,
}: {
  params: { id: string,  domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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

        <Fields params={params} />
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