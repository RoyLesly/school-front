import { calcTotalandGrade, getData } from '@/functions';
import ServerError from '@/section-h/common/ServerError';
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSchoolFeesUrl, TransactionUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react'
import { ConfigData, protocol } from '@/config';
import Table from '@/componentsTwo/Table';
import { TableRowClassName } from '@/constants';
import NotificationError from '@/section-h/common/NotificationError';
import initTranslations from '@/i18n';
import FormModal from '@/componentsTwo/FormModal';
import { FaPlus } from 'react-icons/fa6';
import { redirect } from 'next/navigation';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaTransactionCreate } from '@/Domain/schemas/schemas';
import { collectMoney } from '@/payment';


export const metadata: Metadata = {
    title: "Exam Page",
    description: "Student Exam Page",
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
    const apiDataSem1: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_exam: true, nopage: true, fieldList: [
        "id", "ca", "exam", "resit", "average", "course__main_course__course_name", "student__user__full_name", "student__specialty__academic_year", "student__specialty__level__level", "student__specialty__main_specialty__specialty_name",
        "course__id", "student__specialty__school__school_name", "student__specialty__school__address", "student__specialty__school__region"
    ]});
    const apiDataSem2: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_exam: true, nopage: true, fieldList: [
        "id", "ca", "exam", "resit", "average", "course__main_course__course_name", "student__user__full_name", "student__specialty__academic_year", "student__specialty__level__level", "student__specialty__main_specialty__specialty_name",
        "course__id", "student__specialty__school__school_name", "student__specialty__school__address", "student__specialty__school__region"
    ]});

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

                        <div className='h-screen mb-20 mt-16 mx-1 p-1 rounded text-black'>

                            {apiDataSem1 == "ECONNRESET" && <ServerError />}

                            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>EXAM RESULTS</div>




                            {/* SEMESTER I DIV */}
                            <div className='flex flex-col'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem2?.length ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[1] / 100)) ?
                                                <Table key={2}
                                                    columns={columns}
                                                    renderRow={renderRow}
                                                    data={apiDataSem1}
                                                    headerClassName='bg-blue-800 font-medium text-slate-50 italic'
                                                />
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }

                                        </>
                                        :
                                        <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No CA Results</div>
                                    }
                                </Suspense>

                            </div>





                            {/* SEMESTER II DIV */}
                            <div className='flex flex-col mt-10'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester II</div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem2?.length ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[3] / 100)) ?
                                                <Table key={2}
                                                    columns={columns}
                                                    renderRow={renderRow}
                                                    data={apiDataSem2}
                                                    headerClassName='bg-blue-800 font-medium text-slate-50 italic'
                                                />
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }
                                        </>
                                        :
                                        <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No CA Results</div>
                                    }
                                </Suspense>

                            </div>



                            <div className='flex flex-col mb-20 mt-6 px-2'>
                                <span className='font medium'>Dear {apiProfile.count && apiProfile.results[0].user__username},</span>
                                <span className='italic'>Education is the key to success.</span>
                                <span className='italic mb-16'>You must learn a skill to survive financcially.</span>
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
                                    url: `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Exam`,
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


const columns = [
    {
        header: "Course",
        accessor: "id",
        className: "table-cell w-7/12 border-r border-white",
    },
    {
        header: "CA",
        accessor: "ca",
        className: "table-cell w-1/12 text-[13px] border-r border-white",
    },
    {
        header: "Exam",
        accessor: "exam",
        className: "table-cell w-1/12 text-[13px] border-r border-white",
    },
    {
        header: "",
        accessor: "action",
        className: "table-cell w-1/12",
    },
];

const renderRow = (item: GetResultInter, index: number) => (
    <tr
        key={item.id}
        className={`${"font-semibold bg-blue-700" + TableRowClassName.sm}`}
    >
        <td className={`${item.course__main_course__course_name.length > 25 ? "text-[13px]" : "text-[14px]"} items-center table-cell`}>{item.course__main_course__course_name.slice(0, 40)}</td>
        {/* <td className={`${item.course__main_course__course_name.length > 20 ? "text-[13px]" : ""} items-center table-cell`}>{item.course__main_course__course_name.slice(0, 30)}</td> */}
        <td className="items-center justify-center table-cell text-[13px] text-center">{item.ca}</td>
        <td className="items-center justify-center table-cell text-[13px] text-center">{item.exam}</td>
        {/* <td className="items-center justify-center table-cell text-[14px] text-center">{calcTotalandGrade(item.ca, item.exam, item.resit).mark}{calcTotalandGrade(item.ca, item.exam, item.resit).withResit ? <span className='text-lg text-red'>*</span> : ""}</td> */}
        <td className={`${calcTotalandGrade(item.ca, item.exam, item.resit).passed ? "text-green-600" : "text-red"} items-center justify-center table-cell text-center`}>{calcTotalandGrade(item.ca, item.exam, item.resit).grade}</td>
    </tr>
);