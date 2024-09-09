import { ConfigData, protocol } from '@/config'
import { getData } from '@/functions'
import { SchemaCreateEditSchoolFees, SchemaCreateEditTransactions } from '@/NoDomain/schemas/schemas'
import { GetSchoolFeesUrl, SchoolFeesUrl, TransactionUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig'
import { GetSchoolFeesInter, SchoolFeesInter } from '@/NoDomain/Utils-H/feesControl/feesInter'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, schoolfee_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiFeeInfo = await getData(GetSchoolFeesUrl, { 
    id: params.schoolfee_id, nopage: true,
    fieldList: [ 
      "id", "userprofile__user__full_name", "userprofile__specialty__tuition", "userprofile__specialty__academic_year", 
      "userprofile__specialty__main_specialty__specialty_name",
      "userprofile__specialty__level__level"
    ]
   })

  console.log(apiFeeInfo, 22)

    return (
        <LayoutAccounting>
            <>
                <Breadcrumb
                    pageName="New Transaction - Fee Payment"
                    pageName1="Main Dashboard"
                    link1="/Section-H//pageAccounting"
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}
                {apiFeeInfo && apiFeeInfo.length == 1 && <Create params={params} apiFeeInfo={apiFeeInfo[0]} searchParams={searchParams} />}

            </>
        </LayoutAccounting>
    )
}

export default page

export const metadata: Metadata = {
    title: "Acc-New Transaction",
    description: "This is Acc Dash",
};


interface ListProps {
  searchParams: any
  apiFeeInfo: GetSchoolFeesInter
  params: any
}

const Create: FC<ListProps> = async ({ apiFeeInfo, params, searchParams }) => {

  const onSubmitServerAction = async (formData: FormData) => {
      'use server'

      const schoolfees_id = apiFeeInfo.id
      const amount = formData.get("amount")
      const reason = formData.get("reason")
      const payment_method = formData.get("payment_method")
      const ref = formData.get("ref")

      const data = {
          schoolfees_id,
          reason,
          amount,
          payment_method,
          ref
      }

      const response = await ActionCreate(data, SchemaCreateEditTransactions, TransactionUrl)

      console.log(response, 92)

      if (response?.detail) { }
      if (response?.id) {
          redirect(`/Section-H/pageAccounting/${params.school_id}/pageFees?created=Operation Successful`)
      } else {
          redirect(`/Section-H/pageAccounting/${params.school_id}/pageFees/error/create?error=Operation Failed`)
      }
  }

  return (
      <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
          <div className='md:p-6 p-2'>
              <div className="gap-9 grid grid-cols-1">
                  <div className="flex flex-col gap-9">
                      {/* <!-- Input Fields --> */}
                      <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
                          <div className="border-b border-stroke dark:border-strokedark flex flex-col items-center justify-between md:flex-row px-6.5 py-2">
                              <h3 className="dark:text-white font-medium text-black">
                                  {apiFeeInfo.userprofile__user__full_name}
                              </h3>
                          </div>

                          <form className="bg-slate-50 dark:bg-slate-700 flex flex-col font-medium gap-4 md:gap-10 p-6.5 tracking-wide" action={onSubmitServerAction}>


                              <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                                  <div className="flex flex-col w-full">
                                      <label className="block dark:text-white mb-2 text-black">
                                          AMOUNT
                                      </label>
                                      <input
                                          type="number"
                                          name="amount"
                                          required={true}
                                          placeholder="AMOUNT"
                                          className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                                      />
                                  </div>
                                  <div className="flex flex-col w-full">
                                      <label className="block dark:text-white mb-2 text-black">
                                          PAYMENT METHOD
                                      </label>
                                      <select
                                          name='payment_method'
                                          required={true}
                                          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                              }`}
                                      >
                                          <option key={0} value={""} className="dark:text-bodydark my-2 text-body">-----------</option>
                                          <option key={1} value={"DIRECT"} className="dark:text-bodydark my-2 text-body">DIRECT</option>
                                          <option key={2} value={"BANK"} className="dark:text-bodydark my-2 text-body">BANK</option>
                                          <option key={3} value={"ORANGE"} className="dark:text-bodydark my-2 text-body">ORANGE</option>
                                          <option key={4} value={"MTN"} className="dark:text-bodydark my-2 text-body">MTN</option>

                                      </select>

                                  </div>
                              </div>

                              <div className="flex flex-col w-full">
                                      <label className="block dark:text-white mb-2 text-black">
                                          REASON
                                      </label>
                                      <select
                                          name='reason'
                                          required={true}
                                          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-6 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                                              }`}
                                      >
                                          <option key={0} value={""} className="dark:text-bodydark my-2 text-body">-----------</option>
                                          {ConfigData["local"].registration_seperate_tuition.h && <option key={1} value={"REGISTRATION"} className="dark:text-bodydark my-2 text-body">REGISTRATION</option>}
                                          <option key={2} value={"TUITION"} className="dark:text-bodydark my-2 text-body">TUITION</option>
                                          <option key={3} value={"SCHOLARSHIP"} className="dark:text-bodydark my-2 text-body">SCHOLARSHIP</option>

                                      </select>

                                  </div>

                              <div className="flex flex-row gap-10">

                                  <div className="flex flex-col w-full">
                                      <label className="block dark:text-white mb-2 text-black">
                                          REFERENCE ID
                                      </label>
                                      <input
                                          type="text"
                                          name="ref"
                                          required={false}
                                          placeholder="Reference Number"
                                          className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary md:px-6 outline-none px-4 py-2 rounded-lg text-black transition w-full"
                                      />
                                  </div>
                              </div>

                              <button type="submit" className="bg-bluedark bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-700 md:text-lg mt-3 px-5 py-2.5 rounded text-center text-white tracking-widest w-full">Submit</button>

                          </form>

                      </div>


                  </div>
              </div>
          </div>

      </div>
  )
}