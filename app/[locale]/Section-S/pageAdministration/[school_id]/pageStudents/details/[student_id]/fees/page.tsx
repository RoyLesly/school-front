import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { CustomUserInter } from '@/NoDomain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { FC } from 'react'
import TabsStudent from '../TabsStudent';
import { GetSecSchoolFeesInter, GetSecTransactionsInter } from '@/NoDomain/Utils-S/feesControl/feesInter';
import NotificationError from '@/section-s/common/NotificationError';
import { GetSecSchoolFeesUrl, GetSecTransactionUrl } from '@/NoDomain/Utils-S/feesControl/feesConfig';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiDataSchoolFee: GetSecSchoolFeesInter[] | any = await getData(protocol + GetSecSchoolFeesUrl, { ...searchParams, secondaryprofile__id: params.student_id, nopage: true, fieldList: [ 
    "id", "secondaryprofile__secondary_classroom__tuition", "secondaryprofile__user__full_name", "secondaryprofile__secondary_classroom__academic_year", "secondaryprofile__secondary_classroom__level__level", 
    "secondaryprofile__secondary_classroom__domain", "secondaryprofile__secondary_classroom__level__option", "balance",
  ] });

  const apiData: GetSecTransactionsInter[] | any = await getData(protocol + GetSecTransactionUrl, { ...searchParams, secschoolfees__secondaryprofile__id: params.student_id, nopage: true, fieldList: [ 
    "id", "reason", "payment_method", "amount", "secschoolfees__secondaryprofile__user__full_name", "secschoolfees__balance", "payer_name", "telephone", "status", 
    "ref", "secschoolfees__secondaryprofile__secondary_classroom__tuition", "operator", "created_at",
  ] });

  console.log(apiDataSchoolFee, 31)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Fee Info"
          pageName1="Student"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={3} />

        <NotificationError errorMessage={searchParams} />

        {apiDataSchoolFee && apiDataSchoolFee.length > 0 ? <List apiData={apiData} apiDataSchoolFee={apiDataSchoolFee[0]} student_id={params.student_id} school_id={params.school_id} params={params} /> 
          : 
          <div className='flex flex-col italic'>
            <span className='flex justify-end'><Link className='bg-blue-900 font-medium px-10 py-2 rounded text-lg text-white tracking-widest' href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create`}>+ Add</Link></span>
            <span className='flex items-center justify-center py-72 text-2xl tracking-widest'>No Payment History</span>
          </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title:
    "Student-Fees",
  description: "This is Student DeFeestail Page",
};


interface ListProps {
  params: any
  apiData: CustomUserInter | any
  apiDataSchoolFee: GetSecSchoolFeesInter
  school_id: string
  student_id: string
}

const List: FC<ListProps> = async ({ apiData, apiDataSchoolFee, school_id, student_id, params }) => {
  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex flex-col font-medium gap-6 justify-center md:flex-row py-2 text-lg w-full'>
        <div className='flex gap-2'><span>Full Name :</span><span className='font-semibold italic tracking-wide'>{apiDataSchoolFee?.secondaryprofile__user__full_name}</span></div>
        <div className='flex gap-2'><span>Domain :</span><span className='font-semibold italic tracking-wide'>{apiDataSchoolFee?.secondaryprofile__secondary_classroom__domain}</span></div>
        <div className='flex gap-2'><span>Class :</span><span className='font-semibold italic tracking-wide'>{apiDataSchoolFee?.secondaryprofile__secondary_classroom__level__level}</span></div>
        <div className='flex gap-2'><span>Option :</span><span className='font-semibold italic tracking-wide'>{apiDataSchoolFee?.secondaryprofile__secondary_classroom__level__option}</span></div>
        <div className='flex gap-2'><span>Year :</span><span className='font-semibold italic tracking-wide'>{apiDataSchoolFee?.secondaryprofile__secondary_classroom__academic_year}</span></div>
      </div>

      <div className='flex flex-col justify-between md:flex-row pb-4 px-4 text-2xl w-full'>
        <div className='flex gap-6'><span>School Fee :</span><span className='font-semibold italic'>{apiDataSchoolFee?.secondaryprofile__secondary_classroom__tuition.toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><span>Paid :</span><span className='font-semibold italic'>{(apiDataSchoolFee?.secondaryprofile__secondary_classroom__tuition - apiDataSchoolFee?.balance).toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><span>Balance :</span><span className='font-semibold italic'>{apiDataSchoolFee?.balance.toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><Link href={`/Section-S/pageAdministration/${school_id}/pageStudents/details/${student_id}/fees/create`} className='bg-blue-900 font-semibold italic px-10 py-1 rounded text-md text-white tracking-widest'>+ Add</Link></div>
      </div>

      <div className="bg-blue-900 border-stroke border-t dark:border-strokedark font-semibold grid grid-cols-3 md:grid-cols-8 md:px-6 md:text-lg px-4 py-1 text-white">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">No</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-medium">Reason</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Amount</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Method</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Reference</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Date</span>
        </div>
        <div className="flex items-center justify-center text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>


      {apiData.length > 0 && apiData.map((item: GetSecTransactionsInter, index: number) => <div key={item.id} className="border-stroke border-t dark:border-strokedark dark:text-white font-semibold grid grid-cols-3 md:grid-cols-8 md:px-6 md:text-lg px-4 py-2">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">{index + 1}</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-medium">{item.reason}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">{item.amount.toLocaleString()} F</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">{item.payment_method}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">{item.ref}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">{item.created_at.slice(0, 10)}</span>
        </div>
        <div className="flex items-center justify-center text-center">
          <Link href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/${item.id}`} className="font-medium">Details</Link>
        </div>
      </div>)}



    </div>
  )
}



