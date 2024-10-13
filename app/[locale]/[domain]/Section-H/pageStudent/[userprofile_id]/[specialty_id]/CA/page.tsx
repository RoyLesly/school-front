import { getData } from '@/functions';
import { ConfigData, protocol } from "@/config";
import { Metadata } from 'next';
import React, { Suspense } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import { GetSchoolFeesUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import FormModal from '@/componentsTwo/FormModal';
import initTranslations from '@/i18n';
import { collectMoney } from '@/payment';
import { redirect } from 'next/navigation';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas';
import NotificationError from '@/section-h/common/NotificationError';


export const metadata: Metadata = {
    title: "CA Page",
    description: "Student CA Page",
};

const page = async ({
    params,
    searchParams
}: {
    params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const { t } = await initTranslations(params.locale, ['common'])

    const apiSchoolFees: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
        userprofile__id: params.userprofile_id, nopage: true, fieldList: [
          'id', "userprofile__id", "platform_paid", "balance", "userprofile__specialty__tuition", "platform_charges",
          "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
        ]
    });

    const apiProfile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.userprofile_id, fieldList: ["user__username"] });
    const apiDataSem1: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_ca: true, course__specialty__id: params.specialty_id, fieldList: [ "id", "course__main_course__course_name", "ca" ] });
    const apiDataSem2: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_ca: true, course__specialty__id: params.specialty_id, fieldList: [ "id", "course__main_course__course_name", "ca" ] });
    
    const onActivate = async (formData: FormData) => {
        "use server"
  
        var payer = formData.get("telephone");
        var operator = formData.get("operator");
        var url = formData.get("url");
        var origin = formData.get("origin");
  
        const data = {
          schoolfees_id: apiSchoolFees[0].id,
          telephone: payer,
          operator: operator,
          payment_method: operator,
          amount: apiSchoolFees[0].platform_charges,
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

    
    return (
        <div>
            {searchParams && <NotificationError errorMessage={searchParams} />}
            {apiSchoolFees ?
                apiSchoolFees.length == 1 ?
                    apiSchoolFees[0].platform_paid ?
                        <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

                            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>CA RESULTS</div>

                            <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                            <div className="bg-bluedark dark:border-strokedark grid grid-cols-7 md:grid-cols-7 px-2 py-1 text-lg text-white tracking-wider">
                                <div className="col-span-5 flex items-center">
                                    <span className="font-medium">Course</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">CA</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium text-sm"></span>
                                </div>
                            </div>

                            <Suspense fallback={<div>Loading ...</div>}>
                                {apiDataSem1?.count ?
                                    (apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[0] / 100)) ?
                                        apiDataSem1.results.map((item: GetResultInter, key: number) => (
                                            <div
                                                className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-7 md:grid-cols-7 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                key={key}
                                            >
                                                <div className="col-span-5 flex items-end">
                                                    <span className="md:text-lg text-sm">
                                                        {item.course__main_course__course_name}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 flex items-end justify-end">
                                                    <span className="">
                                                        {item.ca}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 flex items-end justify-end">
                                                    <span className="">
                                                        {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData[params.domain]["higher"].ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                    :
                                    <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No CA Results</div>
                                }</Suspense>


                            <br />


                            <div className='justify-centerfont-medium py-2 text-center tracking-wide'>Semester II</div>

                            <div className="bg-bluedark dark:border-strokedark grid grid-cols-7 md:grid-cols-7 px-2 py-1 text-lg text-white tracking-wider">
                                <div className="col-span-5 flex items-center">
                                    <span className="font-medium">Course</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">CA</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium"></span>
                                </div>
                            </div>


                            <Suspense fallback={<div>Loading ...</div>}>
                                {apiDataSem2?.count ?
                                    (apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[2] / 100)) ?
                                        apiDataSem2.results.map((item: GetResultInter, key: number) => (
                                            <div
                                                className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-7 md:grid-cols-7 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                key={key}
                                            >
                                                <div className="col-span-5 flex items-end">
                                                    <span className="md:text-lg text-sm">
                                                        {item.course__main_course__course_name}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 flex items-end justify-end">
                                                    <span className="">
                                                        {item.ca}
                                                    </span>
                                                </div>
                                                <div className="col-span-1 flex items-end justify-end">
                                                    <span className="">
                                                        {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData[params.domain]["higher"].ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                    :
                                    <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No CA Results</div>
                                }</Suspense>

                            <div className='flex flex-col mb-20 mt-6 px-2'>
                                <span className='font medium'>Dear {apiProfile.count && apiProfile.results[0].user__username},</span>
                                <span className='italic'>We encourage you to keep on going, even when it gets tough.</span>
                                <span className='italic mb-16'>Learning is a life long enriching journey.</span>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col gap-10 items-center justify-center pt-40 text-[18px] text-black'>
                            <span className='font-bold text-xl'>Account Not Active</span>
                            <FormModal
                                table="platform_charge"
                                type="custom"
                                params={params}
                                icon={<FaPlus />}
                                data={apiSchoolFees[0]}
                                extra_data={{
                                    url: `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/CA`,
                                    type: "single",
                                    onActivate: onActivate,
                                }}
                                buttonTitle={`${t("pay_now")}`}
                                customClassName={`flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize gap-2 cursor-pointer`}
                            />
                        </div>
                    :
                    <div className='text-black'>No School Fees Information</div>
                :
                <div className='text-black'>No School Fees Information</div>
            }
        </div>
    )
}

export default page