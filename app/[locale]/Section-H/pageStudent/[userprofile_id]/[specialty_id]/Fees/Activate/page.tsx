import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import Form from './Form';
import { GetSchoolFeesUrl, TransactionUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';
import { getData } from '@/functions';
import NotificationError from '@/section-h/common/NotificationError';
import { collectMoney } from '@/payment';
import { SchemaTransactionCreate } from '@/NoDomain/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { GetSchoolFeesInter } from '@/NoDomain/Utils-H/feesControl/feesInter';


const page = async ({
  params,
  searchParams,
}: {
  params: { userprofile_id: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const schoolFees: any = await getData(GetSchoolFeesUrl, {
    userprofile__id: params.userprofile_id, fieldList: [
      "id", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", "balance", "platform_paid", "platform_charges",
      "userprofile__specialty__tuition", "userprofile__user__matricle", "userprofile__specialty__academic_year", "userprofile__specialty__level__level",
      "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
  });

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

  const onActivate = async (formData: FormData) => {
    "use server"

    var payer = formData.get("payer");
    var operator = formData.get("operator");

    const data = {
      schoolfees_id: schoolfees.id,
      telephone: payer,
      operator: operator,
      payment_method: operator,
      amount: schoolfees.platform_charges,
      reason: "PLATFORM CHARGES",
      status: "completed",
    }

    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer });
    console.log(pay, 66);

    if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
      redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Cancelled by User`)
    }
    if (!pay.operation && pay.transaction == "low-balance-payer") {
      redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Not Enough Funds`)
    }
    if (!pay.operation && pay.transaction == "ENOTFOUND") {
      redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Error`)
    }
    if (!pay.operation && !pay.transaction) {
      redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=Transaction Error`)
    }

    if (pay.operation) {
      const response = await ActionCreate(data, SchemaTransactionCreate, TransactionUrl, `/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees`)
      console.log(response, 80)

      if (response.error) {
        redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      }
      if (response?.errors) {
        redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
      }
      if (response?.detail) {
        redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
      }
      if (response?.id) {
        redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees?success=Successfully Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
      }
    } else {
      redirect(`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/${params.schoolfees_id}?error=Transaction Failed`)
    }
  }

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

    <div className='bg-slate-200 flex font-bold items-center justify-center my-6 p-1 rounded text-lg'>ACCOUNT ACTIVATION</div>

    <Form onActivate={onActivate} params={params} schoolfees={schoolfees} />

  </div>
}