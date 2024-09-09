import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import ServerError from '@/section-s/common/ServerError'
import NotificationError from '@/section-s/common/NotificationError'
import { redirect } from 'next/navigation'
import { GetSecTransactionUrl, SecTransactionUrl } from '@/Domain/Utils-S/feesControl/feesConfig'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { SchemaTransactionCreate } from '@/Domain/Utils-S/schemas/schemas'
import { collectMoney } from '@/payment';
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, schoolfees_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiMyProfile: any = await getData( protocol + GetSecTransactionUrl, { id: params.schoolfees_id, platform_paid: false, fieldList: [ 
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
          pageName="Account Activation " 
          pageName1="Back" 
          link1={`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiMyProfile == "ECONNREFUSED" && <ServerError />}
        {apiMyProfile && apiMyProfile.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiMyProfile.count && apiMyProfile != "ECONNREFUSED" && <List apiData={apiMyProfile.results[0]} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Account Activation",
  description: "This is Account Activation Page",
};



const List = ( {apiData, params}: any ) => {

  const onActivate = async (formData: FormData) => {
    "use server"

    var payer = formData.get("payer");
    var operator = formData.get("operator");

    const data = {
      schoolfees_id: params.schoolfees_id,
      telephone: payer,
      operator: operator,
      payment_method: operator,
      amount: 10,
      reason: "PLATFORM CHARGES",
      status: "completed",
    }

    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: data.amount, service: data.operator, payer: payer});
    console.log(pay)

    if (pay.transaction) {
      const response = await ActionCreate(data, SchemaTransactionCreate, protocol + SecTransactionUrl, `/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`)
      console.log(response)
      // return
  
      if (response.error) {
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${params.schoolfees_id}?error=${JSON.stringify(response.error).replaceAll(" ", "-")}`)
      }
      if (response?.errors) {
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${params.schoolfees_id}?error=${JSON.stringify(response.errors).replaceAll(" ", "-")}`)
      }
      if (response?.detail) {
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${params.schoolfees_id}?error=${JSON.stringify(response.detail).replaceAll(" ", "-")}`)
      }
      if (response?.id) {
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation?updated=Successfully-Activated-${JSON.stringify(response.schoolfees.userprofile.user.full_name).replaceAll(" ", "-")}`)
      }
    } else {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${params.schoolfees_id}?error=Transaction Failed`)
    }
  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-2xl text-black">
          {apiData.userprofile__user__full_name}
        </h4>

      </div>

      <div className="dark:text-white flex flex-col gap-2 md:p-10 md:text-2xl p-2 tracking-widest">
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Class</span>: <span className='font-semibold'>{apiData.userprofile__classroom__level__level}</span></div>
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Option</span>: <span className='font-semibold'>{apiData.userprofile__classroom__level__option}</span></div>
        <div className='flex gap-4 md:gap-10'><span className='md:w-24 w-10'>Year</span>: <span className='font-semibold'>{apiData.userprofile__classroom__academic_year}</span></div>
      </div>

      <form action={onActivate} className='flex flex-row gap-10 items-center justi justify-center mb-10 text-lg'>
          <select name="operator" required={true} className='border-2 px-10 py-2 rounded'>
            <option value={""}>--------------</option>
            <option value={"MTN"}>MTN</option>
            <option value={"ORANGE"}>ORANGE</option>
          </select>
          <input
            className='border-2 px-6 py-1 rounded w-60'
            placeholder='Payer Number'
            name="payer"
            type='number'
            max={699999999}
            min={600000000}
            required={true}
          />

          <button type='submit' className='bg-green-600 font-semibold px-6 py-2 rounded text-lg text-white tracking-wide'>Pay 1.000F</button>

        </form>

    </div>
  )
}


