import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { FC } from 'react'
import TabsStudent from '../TabsStudent';
import NotificationError from '@/section-h/common/NotificationError';
import { GetSchoolFeesInter, GetTransactionsInter } from '@/Domain/Utils-H/feesControl/feesInter';
import { GetSchoolFeesUrl, GetTransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { CustomUserInter } from '@/Domain/Utils-H/userControl/userInter';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiDataSchoolFee: GetTransactionsInter[] | any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { ...searchParams, userprofile__id: params.student_id, fieldList: [ 
    "id", "userprofile__specialty__tuition", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__level__level", "userprofile__specialty__academic_year", "balance", "created_at",
  ] });

  const apiData: GetTransactionsInter[] | any = await getData(protocol + "api" + params.domain + GetTransactionUrl, { ...searchParams, nopage: true, schoolfees__userprofile__id: params.student_id, fieldList: [ 
    "id", "reason", "account", "payment_method", "amount", "schoolfees__userprofile__user__full_name", "schoolfees__balance", "payer_name", "telephone", "status", 
    "ref", "schoolfees__userprofile__specialty__tuition", "operator", "created_at",
  ] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Student Fee Info"
          pageName1="Student"
          link1={`School-H/pageAdministration/${params.school_id}/pageStudents`}
        />

        <TabsStudent params={params} page={3} />

        <NotificationError errorMessage={searchParams} />

        {apiDataSchoolFee && apiDataSchoolFee.count ? 
          apiDataSchoolFee && apiDataSchoolFee.count ? 
            <List apiData={apiData} apiDataSchoolFee={apiDataSchoolFee.results[0]} params={params} /> 
            :
            <div className='flex flex-col italic'>
              <span className='flex justify-end'><Link className='bg-blue-900 font-medium px-10 py-2 rounded text-lg text-white tracking-widest' href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create`}>+ Add</Link></span>
              <span className='flex items-center justify-center py-72 text-2xl tracking-widest'>School Fee Info</span>
            </div>
          : 
          <div className='flex flex-col italic'>
            <span className='flex justify-end'><Link className='bg-blue-900 font-medium px-10 py-2 rounded text-lg text-white tracking-widest' href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/createschoolfees`}>+ Add Fee Info</Link></span>
            <span className='flex items-center justify-center py-72 text-2xl tracking-widest'>School Fee Info</span>
          </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page



export const metadata: Metadata = {
  title: "Student-Fees",
  description: "This is Student Fees Page",
};


interface ListProps {
  params: any
  apiData: CustomUserInter | any
  apiDataSchoolFee: GetSchoolFeesInter
}

const List: FC<ListProps> = async ({ apiData, apiDataSchoolFee, params }) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex flex-col font-medium gap-6 justify-center md:flex-row py-2 text-lg w-full'>
        <div className='flex gap-2'><span>Full Name :</span><span>{apiDataSchoolFee?.userprofile__user__full_name}</span></div>
        <div className='flex gap-2'><span>Class :</span><span>{apiDataSchoolFee?.userprofile__specialty__main_specialty__specialty_name}</span></div>
        <div className='flex gap-2'><span>Year :</span><span>{apiDataSchoolFee?.userprofile__specialty__academic_year}</span></div>
        <div className='flex gap-2'><span>Level :</span><span>{apiDataSchoolFee?.userprofile__specialty__level__level}</span></div>
      </div>

      <div className='flex flex-col font-medium justify-between md:flex-row pb-4 px-4 text-2xl w-full'>
        <div className='flex gap-6'><span>School Fee :</span><span>{apiDataSchoolFee?.userprofile__specialty__tuition.toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><span>Paid :</span><span>{(apiDataSchoolFee?.userprofile__specialty__tuition - apiDataSchoolFee?.balance).toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><span>Balance :</span><span>{apiDataSchoolFee?.balance.toLocaleString()} FCFA</span></div>
        <div className='flex gap-6'><Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create`} className='bg-blue-900 font-medium italic px-6 py-0 rounded text-white tracking-widest'>+ Add</Link></div>
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


      {apiData.length > 0 && apiData.map((item: GetTransactionsInter, index: number) => <div key={item.id} className="border-stroke border-t dark:border-strokedark dark:text-white font-semibold grid grid-cols-3 md:grid-cols-8 md:px-6 md:text-lg px-4 py-2">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">{index + 1}</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-medium">{item.account}</span>
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
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/${item.id}`} className="bg-blue-900 font-medium px-4 py-1 rounded text-white">Details</Link>
        </div>
      </div>)}



    </div>
  )
}



