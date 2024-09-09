import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import React, { FC } from 'react'
import Link from 'next/link';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';

const EditPage = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, classroom_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="SELECT"
          pageName1="Back"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`}
        />

        <Select
          searchParams={searchParams}
          params={params}
        />
        
      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Select-Marks",
  description: "This is Marks Page",
};


interface SelectProps {
  searchParams: any
  params: any
}

const Links: any = [
  { id: 1, sequence: 1 },
  { id: 2, sequence: 2 },
  { id: 3, sequence: 3 },
  { id: 4, sequence: 4 },
  { id: 5, sequence: 5 },
  { id: 6, sequence: 6 },
]

const Select: FC<SelectProps> = async ({ params, searchParams }) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex justify-center rounded-sm shadow-default">

      <div className='gap-10 grid grid-cols-3 items-center justify-center px-10 py-10'>
        {Links.map((item: any) => (
          <Link
            className='bg-blue-900 flex font-semibold h-20 items-center justify-center px-10 rounded text-center text-white text-xl tracking-wide w-full'
            key={item.id} href={`/pageAdministration/${params.school_id}/pageResult/${params.classroom_id}/pageList?sequence=${item.id}`}
          >
            Sequence {item.sequence}
          </Link>
        ))}
      </div>

    </div>
  )
}