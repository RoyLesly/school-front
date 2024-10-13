import NotificationError from '@/section-h/common/NotificationError';
import { getData } from '@/functions';
import React, { FC } from 'react'
import { GrStatusGood } from 'react-icons/gr';
import { GetSchoolFeesInter, GetTransactionsInter } from '@/Domain/Utils-H/feesControl/feesInter';
import { GetSchoolFeesUrl, GetTransactionUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { protocol } from '@/config';
import FormModal from '@/componentsTwo/FormModal';
import { FaPlus } from 'react-icons/fa6';
import { redirect } from 'next/navigation';
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { collectMoney } from '@/payment';
import initTranslations from '@/i18n';


const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSchoolFees: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
    userprofile__id: params.userprofile_id, nopage: true, fieldList: [
      'id', "userprofile__id", "platform_paid", "balance", "userprofile__specialty__tuition", "platform_charges",
      "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
    ]
});


  return (
    <div className='mt-16 px-2'>
      {searchParams && <NotificationError errorMessage={searchParams} />}
      {apiSchoolFees && apiSchoolFees.length && <List apiSchoolFees={apiSchoolFees[0]} params={params} />}
    </div>
  )
}

export default page



interface Props {
  apiSchoolFees: GetSchoolFeesInter
  params: any
}
const List: FC<Props> = async ({ apiSchoolFees, params }) => {

  const { t } = await initTranslations(params.locale, ['common'])

  const transactions: any = await getData(protocol + "api" + params.domain + GetTransactionUrl, {
    schoolfees__id: apiSchoolFees.id, fieldList: [
      "id", "schoolfees__id", "amount", "reason", "status", "telephone", "payer_name", "operator", "ref",
      "created_by__first_name", "payment_method", "created_at"
    ]
  });
  const onActivate = async (formData: FormData) => {
    "use server"

    var payer = formData.get("telephone");
    var operator = formData.get("operator");
    var url = formData.get("url");
    var origin = formData.get("origin");

    const data = {
      schoolfees_id: apiSchoolFees.id,
      telephone: payer,
      operator: operator,
      payment_method: operator,
      amount: apiSchoolFees.platform_charges,
      reason: "Platform Charges",
      account: "PLATFORM CHARGES",
      status: "completed",
      operation_type: "other",
      origin: origin,
    }

    var pay: any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer });
    console.log(pay, 72);

    if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
      redirect(`${url}?customerror=Transaction Cancelled by User`)
    }
    if (!pay.operation && pay.transaction == "low-balance-payer") {
      redirect(`${url}?customerror=Not Enough Funds`)
    }
    if (!pay.operation && pay.transaction == "ENOTFOUND") {
      redirect(`${url}?error=Transaction Error`)
    }
    if (!pay.operation && !pay.transaction) {
      redirect(`${url}?error=Transaction Error`)
    }

    if (pay.operation) {
      const response = await ActionCreate(data, SchemaTransactionCreate, protocol + "api" + params.domain + TransactionUrl)
      console.log(response, 80)

      if (response.error) {
        redirect(`${url}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      }
      if (response?.errors) {
        redirect(`${url}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
      }
      if (response?.detail) {
        redirect(`${url}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
      }
      if (response?.id) {
        redirect(`${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees?success=Successfully Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
      }
    } else {
    //   redirect(`${url}/${params.schoolfees_id}?error=Transaction Failed`)
    }
}


  return <div className='bg-slate-50 mb-32 rounded text-black'>

    <div className='flex flex-col items-center justify-center'>
      <span className='flex font-semibold items-center py-2 text-center text-lg text-wrap'>{apiSchoolFees.userprofile__user__full_name} - {apiSchoolFees.userprofile__user__matricle}</span>
      <span>{apiSchoolFees.userprofile__specialty__main_specialty__specialty_name}</span>
      <span>Academic Year: {apiSchoolFees.userprofile__specialty__academic_year}</span>
    </div>

    <div className='flex items-center justify-between px-2'>
      <div>
        <span>Level: {apiSchoolFees.userprofile__specialty__level__level}</span>
      </div>
      <div>
        <span className='text-lg'>Tuition: {apiSchoolFees.userprofile__specialty__tuition.toLocaleString()} F</span>
      </div>
    </div>

    <div className='flex items-center justify-between px-2'>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>1st: </span>
        <span className='font-semibold italic'>{apiSchoolFees.userprofile__specialty__payment_one.toLocaleString()} F</span>
      </div>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>2nd: </span>
        <span className='font-semibold italic'>{apiSchoolFees.userprofile__specialty__payment_two.toLocaleString()} F</span>
      </div>
      <div className='flex flex-row gap-2 items-center justify-between text-sm'>
        <span className='flex'>3rd: </span>
        <span className='font-semibold italic'>{apiSchoolFees.userprofile__specialty__payment_three.toLocaleString()} F</span>
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
      <div className='col-span-3 font-bold italic'>{(apiSchoolFees.userprofile__specialty__tuition - apiSchoolFees.balance).toLocaleString()} F</div>
      <div className='col-span-2'></div>
    </div>

    <div className='bg-slate-200 flex items-center justify-between mt-2 px-4 py-2 rounded text-lg'>
      <div className='flex gap-4 items-center'>
        <span className='flex'></span>
        <span className='flex font-semibold'></span>
      </div>
      <div className='flex gap-4 items-center'>
        <span className='flex'>Balance:</span>
        <span className='flex font-semibold'>{(apiSchoolFees.userprofile__specialty__tuition - (apiSchoolFees.userprofile__specialty__tuition - apiSchoolFees.balance)).toLocaleString()} F</span>
      </div>
    </div>

    <div className='flex gap-6 items-center justify-between mb-2 mt-10 px-4'>
      <span>Account Status:</span>
      <div>{apiSchoolFees.platform_paid ?
        <span className='px-4 py-1 rounded'><GrStatusGood color='green' size={40} /></span>
        :
        <FormModal
          table="platform_charge"
          type="custom"
          params={params}
          icon={<FaPlus />}
          data={apiSchoolFees}
          extra_data={{
            url: `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees`,
            type: "single",
            onActivate: onActivate,
          }}
          buttonTitle={`Activate`}
          // buttonTitle={`${t("pay_now")}`}
          customClassName={`flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
        />
      }
      </div>
    </div>

  </div>
}