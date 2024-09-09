import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { getData } from '@/functions';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { CustomUserInter, GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import { SchemaCreateEditSecSchoolFees, SchemaCreateEditTransactions } from '@/Domain/Utils-S/schemas/schemas';
import NotificationError from '@/section-s/common/NotificationError';
import { GetSecSchoolFeesUrl, GetSecTransactionUrl, SecSchoolFeesUrl, SecTransactionUrl } from '@/Domain/Utils-S/feesControl/feesConfig';
import { GetSecSchoolFeesInter, GetSecTransactionsInter } from '@/Domain/Utils-S/feesControl/feesInter';
import Link from 'next/link';
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig';
import { ConfigData, protocol } from '@/config';

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, student_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiData: GetSecTransactionsInter[] | any = await getData(protocol + GetSecTransactionUrl, {
        ...searchParams, secschoolfees__secondaryprofile__id: params.student_id, nopage: true, fieldList: [
            "id", "reason", "payment_method", "amount", "secschoolfees__secondaryprofile__user__full_name", "secschoolfees__balance", "payer_name", "telephone", "status",
            "secschoolfees__secondaryprofile__secondary_classroom__tuition", "operator", "created_at",
        ]
    });
    const apiStudentSchoolFees: GetSecSchoolFeesInter[] | any = await getData(protocol + GetSecSchoolFeesUrl, {
        ...searchParams, secondaryprofile__id: params.student_id, nopage: true, fieldList: [
            "id", "secondaryprofile__user__full_name",
        ]
    });
    const apiStudentProfile: GetSecondaryProfileInter[] | any = await getData(protocol + GetSecondaryProfileUrl, {
        id: params.student_id, nopage: true, fieldList: [ 
            "id", "secondary_classroom__tuition",
        ]
    });

    const onCreateSchooFeesServerAction = async (formData: FormData) => {
        'use server'

        const secondaryprofile_id = params.student_id
        const platform_paid= false;
        const balance = apiStudentProfile[0].secondary_classroom__tuition;

        const data = {
            secondaryprofile_id,
            platform_paid,
            balance
        }

        const response = await ActionCreate(data, SchemaCreateEditSecSchoolFees, protocol + SecSchoolFeesUrl)

        console.log(response, 56)

        if (response?.detail) { }
        if (response?.id) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create?created=Operation Successfull`)
        } else {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create?error=Operation Failed`)
        }
    }


    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName={`School Fee Payment -  ${apiStudentSchoolFees && apiStudentSchoolFees.length == 1 ? apiStudentSchoolFees[0].secondaryprofile__user__full_name : ""}`}
                    pageName1="Back"
                    link1={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.school_id}`}
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}

                {apiData && apiStudentSchoolFees && apiStudentSchoolFees.length == 1 ? 
                    <List apiData={apiData} params={params} searchParams={searchParams} schoolfees={apiStudentSchoolFees[0]} />
                    : 
                    <div className="flex flex-col font-semibold gap-6 items-center justify-center py-20 text-2xl tracking-widest">
                        <div>No School Fee Info Found</div>
                        <form action={onCreateSchooFeesServerAction}>
                            <button type='submit' className="bg-bluedash font-medium px-6 py-2 rounded text-white tracking-widest">Create Fee Info</button>
                        </form>
                    </div>
                }

            </>
        </LayoutAdmin>
    )
}

export default page



export const metadata: Metadata = {
    title:
        "Student-Fees",
    description: "This is Student DeFeestail Page",
};


interface ListProps {
    searchParams: CustomUserInter | any
    apiData: CustomUserInter | any
    schoolfees: { id: number }
    params: any
}

const List: FC<ListProps> = async ({ apiData, params, searchParams, schoolfees }) => {

    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        const secschoolfees_id = schoolfees.id
        const amount = formData.get("amount")
        const reason = formData.get("reason")
        const payment_method = formData.get("payment_method")
        const ref = formData.get("ref")

        const data = {
            secschoolfees_id,
            reason,
            amount,
            payment_method,
            ref
        }
        const response = await ActionCreate(data, SchemaCreateEditTransactions, protocol + SecTransactionUrl)

        if (response?.detail) { }
        if (response?.id) {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees?created=Operation Successfull`)
        } else {
            redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create?error=Operation Failed`)
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
                                    {apiData.full_name}
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
                                            {!ConfigData.registration_seperate_tuition && <option key={1} value={"REGISTRATION"} className="dark:text-bodydark my-2 text-body">REGISTRATION</option>}
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




