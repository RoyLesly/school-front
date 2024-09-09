import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  console.log("Accounting Page Here !!!")
  
  return (
    <LayoutAccounting>
      <>
        <Breadcrumb
          pageName="Accounting" 
          pageName1="Main Dashboard" 
          link1="/pageAccounting" 
        />

        <div>
          Main Admin Page
        </div>
      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Admin-Dash",
  description: "This is Admin Dash",
};