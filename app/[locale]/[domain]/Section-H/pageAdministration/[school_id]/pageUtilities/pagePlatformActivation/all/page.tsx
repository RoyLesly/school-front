import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import ServerError from '@/section-h/common/ServerError'
import NotificationError from '@/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
import { GetSchoolFeesUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { collectMoney } from '@/payment'
import { GetSchoolFeesInter } from '@/Domain/Utils-H/feesControl/feesInter'
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiNotActiveAccounts: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, { userprofile__specialty__school__campus__id: params.school_id, nopage: true, platform_paid: false, fieldList: ["id", "userprofile__id", "userprofile__user__full_name", "userprofile__user__username", "userprofile__user__matricle", "platform_charges", "balance"] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Payment of All Platform Charges"
          pageName1="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiNotActiveAccounts == "ECONNREFUSED" && <ServerError />}
        {apiNotActiveAccounts && apiNotActiveAccounts.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiNotActiveAccounts && apiNotActiveAccounts.length > 0 && apiNotActiveAccounts != "ECONNREFUSED" && <List apiData={apiNotActiveAccounts} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation",
  description: "This is Activation Page",
};


const List = async ({ apiData, params }: any) => {

  console.log(apiData, 55)

  const total = apiData.map((item: GetSchoolFeesInter) => item.platform_charges).reduce((prev: number, next: number) => prev + next);

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const telephone = formData.get("payer")
    const operator = formData.get("operator")
    const payment_method = formData.get("operator")
    const reason = "PLATFORM CHARGES"
    const status = "completed"

    const data = {
      telephone, operator, payment_method, reason, status
    }

    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: total, service: data.operator, payer: data.telephone });
    console.log(74, pay)

    if (!pay.operation && pay.transaction == "could-not-perform-transaction") {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=Transaction Cancelled By USer`)
    }
    if (!pay.operation && pay.transaction == "low-balance-payer") {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=Not Enough Funds`)
    }
    if (!pay.operation && pay.transaction == "ENOTFOUND") {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=Transaction Error`)
    }

    if (pay.operation) {

      for (let index = 0; index < apiData.length; index++) {
        const element = apiData.results[index];
        const response = await ActionCreate({ ...data, schoolfees_id: element.id }, SchemaTransactionCreate, protocol + "api" + params.domain + TransactionUrl)
        if (index == apiData.length - 1) {
          if (response.error && Object.keys(response.error).length > 0) {
            redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=${JSON.stringify(response.error)}`)
          }
          if (response.id) {
            redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation?success=SUCESSFULL ACTIVATION`)
          }
        }
      }
    } else {
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=Transaction Failed`)
    }
  }


  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark pt-20 rounded-sm shadow-default">

      <form action={onSubmitServerAction} className='flex flex-col flex-grow gap-10 items-center justify-center pb-20 text-xl'>
        <div className='flex flex-row gap-10'>
          <div className='flex flex-col font-medium gap-4 italic text-xl tracking-widest'>
            <span>Student Accounts:</span>
            <span className=''>Total Amount Account:</span>
            <span className='h-10'>Select Payment Method:</span>
            <span className='h-10'>Telephone Number:</span>
          </div>
          <div className='flex flex-col gap-4'>
            <span>{apiData.length}</span>
            <span>
              <span>{total.toLocaleString()} F</span>
            </span>
            <span>
              <select name="operator" className='border-2 px-4 py-2 rounded' required={true}>
                <option value="">-----------------</option>
                <option value="MTN">MOBILE MONEY-</option>
                <option value="ORANGE">ORANGE MONEY</option>
              </select>
            </span>
            <span>
              <input name="payer" placeholder='Telephone Number ...' className='border-2 px-4 py-1 rounded w-60' type='number' max={999999999} min={610000000} required={true} />
            </span>
          </div>
        </div>
        <button type='submit' className="bg-bluedash font-medium my-4 px-6 py-2 rounded text-white tracking-widest">Pay</button>
      </form>

    </div>
  )
}