import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { FC } from 'react'
import { GetSecTransactionUrl } from '@/Domain/Utils-S/feesControl/feesConfig';
import { GetSecTransactionsInter } from '@/Domain/Utils-S/feesControl/feesInter';
import NotificationError from '@/section-s/common/NotificationError';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, student_id: string, transaction_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const apiData: GetSecTransactionsInter[] | any = await getData(protocol + GetSecTransactionUrl, { id: params.transaction_id, nopage: true, fieldList: [ 
    "id", "reason", "payment_method", "amount", "schoolfees__userprofile__user__full_name", "schoolfees__balance", "payer_name", "telephone", "status", 
    "ref", "schoolfees__userprofile__classroom__tuition", "operator", "created_at", "created_by__full_name",
  ] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Fee Transaction Details"
          pageName1="Back"
          link1={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees`}
        />

        <NotificationError errorMessage={searchParams} />

        {apiData ? <List apiData={apiData[0]} student_id={params.student_id} school_id={params.school_id} params={params} /> 
          : 
          <div className='flex flex-col italic'>
            <span className='flex justify-end'><Link className='bg-blue-900 font-medium px-10 py-2 rounded text-lg text-white tracking-widest' href={`/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create`}>+ Add</Link></span>
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
  apiData: GetSecTransactionsInter | any
  school_id: string
  student_id: string
}

const List: FC<ListProps> = async ({ apiData, params }) => {


  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-col items-center justify-center md:flex-row md:gap-16 md:px-20 md:py-40 rounded shadow-default">

      <div className='flex flex-col gap-2'>
        <div>Payment Purpose :</div>
        <div>Amount :</div>
        <div>Payment Method :</div>
        <div>Status :</div>
        <div>Telephone :</div>
        <div>Reference :</div>
        <div>By :</div>
        <div>Date :</div>
      </div>

      <div className='flex flex-col gap-2'>
        <div>{apiData.reason}</div>
        <div>{apiData.amount}</div>
        <div>{apiData.payment_method}</div>
        <div>{apiData.status}</div>
        <div>{apiData.telephone}</div>
        <div>{apiData.ref ? apiData.telephone : "/"}</div>
        <div>{apiData.ref ? apiData.ref : "/"}</div>
        <div>{apiData.created_by__full_name}</div>
        <div>{apiData.created_at}</div>
      </div>



      {/* {apiData.length > 0 && apiData.map((item: GetTransactionsInter, index: number) => <div key={item.id} className="border-stroke border-t dark:border-strokedark dark:text-white font-semibold grid grid-cols-3 md:grid-cols-8 md:px-6 md:text-lg px-4 py-2">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">{index + 1}</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-medium">{item.reason}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">{parseInt(item.amount).toLocaleString()} F</span>
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
          <Link href={`/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/${item.id}`} className="font-medium">Details</Link>
        </div>
      </div>)} */}



    </div>
  )
}



