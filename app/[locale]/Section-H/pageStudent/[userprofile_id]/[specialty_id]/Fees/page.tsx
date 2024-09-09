import NotificationError from '@/section-h/common/NotificationError';
import { getData } from '@/functions';
import Link from 'next/link';
import React, { FC } from 'react'
import { GrStatusGood, GrStatusWarning } from 'react-icons/gr';
import { GetSchoolFeesInter, GetTransactionsInter } from '@/NoDomain/Utils-H/feesControl/feesInter';
import { GetSchoolFeesUrl, GetTransactionUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';


const page = async ({
  params,
  searchParams,
}: {
  params: { userprofile_id: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const schoolFees: any = await getData(GetSchoolFeesUrl, {
    userprofile__id: params.userprofile_id, fieldList: [
      "id", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", "balance", "platform_paid",
      "userprofile__specialty__tuition", "userprofile__user__matricle", "userprofile__specialty__academic_year", "userprofile__specialty__level__level",
      "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
  });

  console.log(schoolFees, 21)

  return (
    <div className='mt-16 px-2'>
      {searchParams && <NotificationError errorMessage={searchParams} />}
      {schoolFees && schoolFees.count && <List schoolfees={schoolFees.results[0]} params={params} />}
    </div>
  )
}

export default page



interface Props {
  schoolfees: GetSchoolFeesInter
  params: any
}
const List: FC<Props> = async ({ schoolfees, params }) => {


  const transactions: any = await getData(GetTransactionUrl, {
    schoolfees__id: schoolfees.id, fieldList: [
      "id", "schoolfees__id", "amount", "reason", "status", "telephone", "payer_name", "operator", "ref",
      "created_by__first_name", "payment_method", "created_at"
    ]
  });


  return <div className='bg-slate-50 mb-32 rounded text-black'>

    <div className='flex flex-col items-center justify-center'>
      <span className='flex font-semibold items-center py-2 text-center text-lg text-wrap'>{schoolfees.userprofile__user__full_name} - {schoolfees.userprofile__user__matricle}</span>
      <span>{schoolfees.userprofile__specialty__main_specialty__specialty_name}</span>
      <span>Academic Year: {schoolfees.userprofile__specialty__academic_year}</span>
    </div>

    <div className='flex items-center justify-between px-2'>
      <div>      
        <span>Level: {schoolfees.userprofile__specialty__level__level}</span>
      </div>
      <div>      
        <span className='text-lg'>Tuition: {schoolfees.userprofile__specialty__tuition.toLocaleString()} F</span>
      </div>
    </div>

    <div className='flex items-center justify-between px-2'>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>1st: </span>
        <span className='font-semibold italic'>{schoolfees.userprofile__specialty__payment_one.toLocaleString()} F</span>
      </div>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>2nd: </span>
        <span className='font-semibold italic'>{schoolfees.userprofile__specialty__payment_two.toLocaleString()} F</span>
      </div>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>3rd: </span>
        <span className='font-semibold italic'>{schoolfees.userprofile__specialty__payment_three.toLocaleString()} F</span>
      </div>
    </div>

    <div className='bg-slate-200 flex font-bold items-center justify-center my-2 p-1 rounded text-lg'>TRANSATIONS</div>

    <div className='bg-blue-800 font-medium grid grid-cols-9 px-1 text-white'>
      <div className='col-span-1'>No</div>
      <div className='col-span-4'>Moitf</div>
      <div className='col-span-2'>Amount</div>
      <div className='col-span-2'>Date</div>
    </div>

    {transactions && transactions.count ?
      transactions.results.map((item: GetTransactionsInter, index: number) => (
        <div key={item.id} className='bg-slate-200 grid grid-cols-9 odd:bg-blue-200 px-1 py-1 rounded'>
          <div className='col-span-1 text-[14px]'>{index + 1}</div>
          <div className='col-span-4 text-[14px]'>{item.reason}</div>
          <div className='col-span-2'>{item.amount.toLocaleString()}</div>
          <div className='col-span-2 text-[14px]'>{item.created_at.slice(2, 10)}</div>
        </div>
      ))
      :
      <div>No Fee Transactions</div>}

    <div className='grid grid-cols-11 mt-4 text-lg'>
      <div className='col-span-1'></div>
      <div className='col-span-5'>Total Paid</div>
      <div className='col-span-3 font-bold italic'>{(schoolfees.userprofile__specialty__tuition - schoolfees.balance).toLocaleString()} F</div>
      <div className='col-span-2'></div>
    </div>

    <div className='bg-slate-200 flex items-center justify-between mt-2 px-4 py-2 rounded text-lg'>
      <div className='flex gap-4 items-center'>
        <span className='flex'></span>
        <span className='flex font-semibold'></span>
      </div>
      <div className='flex gap-4 items-center'>
        <span className='flex'>Balance:</span>
        <span className='flex font-semibold'>{(schoolfees.userprofile__specialty__tuition - (schoolfees.userprofile__specialty__tuition - schoolfees.balance)).toLocaleString()} F</span>
      </div>
    </div>

    <div className='flex gap-6 items-center justify-between mb-2 mt-10 px-4'>
      <span>Account Status:</span>
      <div>{schoolfees.platform_paid ? 
        <span className='px-4 py-1 rounded'><GrStatusGood color='green' size={40} /></span> 
        : 
        <div className='flex gap-2'>
          {/* <Link href={`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate`} className='font-medium px-4 py-1 rounded'><GrStatusWarning color='red' size={40} />In acctive</Link> */}
          <Link href={`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate`} className='bg-red font-medium px-4 py-1 rounded text-white'>Activate</Link>
        </div>}
      </div>
    </div>

  </div>
}