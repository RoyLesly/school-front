import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import ServerError from '@/section-s/common/ServerError'
import NotificationError from '@/section-s/common/NotificationError'
import { redirect } from 'next/navigation'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { SchemaTransactionCreate } from '@/Domain/Utils-S/schemas/schemas';
import { collectMoney } from '@/payment';
import { GetSecSchoolFeesUrl, SecTransactionUrl } from '@/Domain/Utils-S/feesControl/feesConfig'
import { GetSecSchoolFeesInter } from '@/Domain/Utils-S/feesControl/feesInter'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  console.log(searchParams)

  const apiNotActiveAccounts: any = await getData( protocol + GetSecSchoolFeesUrl, { userprofile__classroom__school__campus__id: params.school_id, platform_paid: false, fieldList: [ 
    "id",     
    "userprofile__id", 
    "userprofile__user__full_name", 
    "userprofile__user__matricle", 
    "platform_charges", 
    "userprofile__classroom__level__level", 
    "userprofile__classroom__level__option", 
    "userprofile__classroom__academic_year", 
    "balance"  
  ] });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Payment of All Platform Charges" 
          pageName1="Dashboard" 
          link1={`/Section-S/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiNotActiveAccounts == "ECONNREFUSED" && <ServerError />}
        {apiNotActiveAccounts && apiNotActiveAccounts.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiNotActiveAccounts && apiNotActiveAccounts.count && apiNotActiveAccounts != "ECONNREFUSED" && <List apiData={apiNotActiveAccounts} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation",
  description: "This is Activation Page",
};


const List = async ( {apiData, params}: any ) => {

  const total = apiData.results.map((item: GetSecSchoolFeesInter) => item.platform_charges).reduce((prev: number, next: number) => prev + next);

  const onSubmitServerAction = async (formData: FormData) => {
    'use server';

    const telephone = formData.get("payer")
    const operator = formData.get("operator")
    const payment_method = formData.get("operator")
    const amount = formData.get("amount")
    const reason = "PLATFORM CHARGES"
    const status = "completed"

    const data = {
      telephone, operator, payment_method, amount, reason, status
    }

    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: data.amount, service: data.operator, payer: data.telephone});

    if (pay.transaction) {

      for (let index = 0; index < apiData.results.length; index++) {
        const element = apiData.results[index];
        const response = await ActionCreate({...data, schoolfees_id: element.id}, SchemaTransactionCreate, protocol + SecTransactionUrl)
        console.log(74, response)
        if (index == apiData.results.length - 1 ){
          if (response.error && Object.keys(response.error).length > 0){
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=${JSON.stringify(response.error)}`)
          }   
          if (response.id){
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation?success=SUCESSFULL ACTIVATION`)
          }   
        }   
      }
    } else {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all?error=Transaction Failed`)
    }
  }


  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark pt-20 rounded-sm shadow-default">

      <form action={onSubmitServerAction} className='flex flex-col flex-grow gap-4 items-center justify-center pb-20 text-xl'>
        <div className='flex gap-4 justify-between'>
          <span className='w-full'>Student Accounts: </span>
          <span className="w-60">{apiData.count}</span>
        </div>
        <div className='flex gap-4 justify-between'>
          <span className='w-full'>Total Amount : </span>
          <span>{total.toLocaleString()} F</span>
          </div>
        <div className='flex gap-4 justify-between'>
          <span className='w-full'>Select Payment Method:</span>
          <select name="operator" className='border-2 px-4 py-2 rounded' required={true}>
            <option value="">-----------------</option>
            <option value="MTN">MOBILE MONEY-</option>
            <option value="ORANGE">ORANGE MONEY</option>
          </select>
        </div>
        <div className='flex gap-4 justify-between'>
          <span className='w-full'>Enter Payment Number:</span>
          <input name="payer" placeholder='Telephone Number ...' className='px-4 py-1 w-60' type='number' max={999999999} min={610000000} required={true} />
        </div>
        <button type='submit' className="bg-bluedash font-medium my-4 px-6 py-2 rounded text-white tracking-widest">Pay</button>
      </form>
    
    </div>
  )
}