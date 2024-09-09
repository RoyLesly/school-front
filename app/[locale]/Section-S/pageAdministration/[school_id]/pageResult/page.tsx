import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { redirect } from 'next/navigation'
import NotificationError from '@/section-s/common/NotificationError'
import SelectClassroom from './SelectClassroom'

const page = async ({
  params,
  searchParams
}: {
  params: { school_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {


  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Select Class For Results`}
                pageName1="Back" 
                link1={`/Section-S/pageAdministration/${params.school_id}`} 
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            <Select params={params} />
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Selection Page",
  };


const Select = ({ params }: any) => {
  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const classroom_id = formData.get("classroom_id")

    if (!classroom_id) return;

    if (classroom_id) { 
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageResult/${classroom_id}` )
    }
  }

    return <form className='border-2 flex flex-col gap-10 items-center justify-center rounded' action={onSubmitServerAction}>

      <SelectClassroom params={params} />

      <button type='submit' className='bg-green-500 font-medium my-10 px-6 py-2 rounded text-lg text-white'>Next</button>
      

    </form>
}