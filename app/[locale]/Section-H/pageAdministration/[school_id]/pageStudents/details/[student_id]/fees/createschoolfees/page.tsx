import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import NotificationError from '@/section-h/common/NotificationError';
import { CustomUserInter, GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter';
import { getData } from '@/functions';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { SchemaCreateEditSchoolFees } from '@/NoDomain/schemas/schemas';
import { SchoolFeesUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';

const page = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, student_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const student = await getData(GetUserProfileUrl, { id: params.student_id, nopage: true, fieldList: [ 
        "id", "user__full_name", "specialty__main_specialty__specialty_name", "specialty__level__level", "specialty__academic_year", "specialty__tuition" 
    ]})

    console.log(student, 23)

    return (
        <LayoutAdmin>
            <>
                <Breadcrumb
                    pageName={`Create School Fee`}
                    pageName1="Back"
                    link1={`/pageAdministration/${params.school_id}/pageStudents/details/${params.school_id}`}
                />

                {searchParams && <NotificationError errorMessage={searchParams} />}

                {student && student.length == 1 && <List apiData={student[0]} params={params} searchParams={searchParams} />}

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
    apiData: GetUserProfileInter
    params: any
}

const List: FC<ListProps> = async ({ apiData, params, searchParams }) => {

    const onSubmitServerAction = async (formData: FormData) => {
        'use server'

        const data = {
            userprofile_id: apiData.id,
            balance: apiData.specialty__tuition,
            platform_charges: 1000,
            platform_paid: false
        }

        const response = await ActionCreate(data, SchemaCreateEditSchoolFees, SchoolFeesUrl)

        if (response?.detail) { }
        if (response?.id) {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees?created=Operation Successfull`)
        } else {
            redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${params.student_id}/fees/create?error=Operation Failed`)
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
                                    {apiData.user__full_name}
                                </h3>
                            </div>

                            <form className="bg-slate-50 dark:bg-slate-700 flex flex-col font-medium gap-4 md:gap-10 p-6.5 tracking-wide" action={onSubmitServerAction}>


                                <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="block dark:text-white mb-2 text-black">
                                            TUITION
                                        </label>
                                        <input
                                            type="number"
                                            name="balance"
                                            readOnly={true}
                                            required={false}
                                            placeholder={`${parseInt(apiData.specialty__tuition.toString()).toLocaleString()} F CFA`}
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




