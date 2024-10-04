import { getData } from '@/functions';
import ServerError from '@/section-h/common/ServerError';
import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetResultInter } from '@/Domain/Utils-H/appControl/appInter';
import { GetSchoolFeesUrl } from '@/Domain/Utils-H/feesControl/feesConfig';
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react'
import { FaDownload, FaMinus } from 'react-icons/fa6';
import { ConfigData, protocol } from '@/config';


export const metadata: Metadata = {
    title: "Resit Page",
    description: "Student Resit Page",
};

const page = async ({
    params,
    searchParams,
}: {
    params: { userprofile_id: string,  domain: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiSchoolFees: any = await getData(protocol + "api" + params.domain + GetSchoolFeesUrl, {
        userprofile__id: params.userprofile_id, nopage: true, fieldList: ["id", "platform_charges", "platform_paid", "balance",
            "userprofile__specialty__tuition", "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
        ]
    });
    const apiProfile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.userprofile_id, fieldList: ["user__username"] });
    const apiDataSem1: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_resit: true, fieldList: ["id", "ca", "exam", "resit", "course__main_course__course_name", "average"] });
    const apiDataSem2: any = await getData(protocol + "api" + params.domain + GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_resit: true, fieldList: ["id", "ca", "exam", "resit", "course__main_course__course_name", "average"] });

    console.log(apiDataSem1, 1)
    console.log(apiDataSem2, 2)
    console.log(apiSchoolFees, 2)
    return (
        <div>
            {apiSchoolFees ?
                apiSchoolFees.length == 1 ?
                    apiSchoolFees[0].platform_paid ?

                        <div className='h-screen mb-20 mt-16 mx-1 p-1 rounded text-black'>

                            {apiDataSem1 == "ECONNRESET" && <ServerError />}

                            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>RESIT RESULTS</div>




                            {/* SEMESTER I DIV */}
                            <div className='flex flex-col'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                                    <div className="col-span-10 flex items-center">
                                        <span className="">Course</span>
                                    </div>
                                    <div className="col-span-2 flex items-end justify-between">
                                        <span className="">Resit</span>
                                    </div>
                                </div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem1?.count ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[0] / 100)) ?
                                                apiDataSem1.results.filter((item: GetResultInter) => (item.ca + item.exam) < 50).map((item: GetResultInter, key: number) => (
                                                    <div
                                                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                        key={key}
                                                    >
                                                        <div className="col-span-8 flex items-end">
                                                            <span className="md:text-lg text-sm">
                                                                {item.course__main_course__course_name}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-2 flex items-end justify-between">
                                                            <span className="">{item.resit}</span>
                                                        </div>
                                                        <div className="col-span-2 flex items-end justify-between">
                                                            <span className="">{item.average}</span>
                                                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                                                        </div>

                                                    </div>



                                                ))
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }

                                        </>
                                        :
                                        <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No Resit Results</div>
                                    }
                                </Suspense>

                            </div>



                            {/* SEMESTER II DIV */}
                            <div className='flex flex-col mt-10'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester II</div>

                                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                                    <div className="col-span-10 flex items-center">
                                        <span className="">Course</span>
                                    </div>
                                    <div className="col-span-2 flex items-end justify-between">
                                        <span className="">Resit</span>
                                    </div>
                                </div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem2?.count ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (ConfigData[`${params.domain}`]['higher'].schoolfees_control[2] / 100)) ?
                                                apiDataSem2.results.filter((item: GetResultInter) => (item.ca + item.exam) < 50).map((item: GetResultInter, key: number) => (
                                                    <div
                                                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                        key={key}
                                                    >
                                                        <div className="col-span-8 flex items-end">
                                                            <span className="md:text-lg text-sm">
                                                                {item.course__main_course__course_name}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-2 flex items-end justify-between">
                                                            <span className="">{item.resit}</span>
                                                        </div>
                                                        <div className="col-span-2 flex items-end justify-between">
                                                            <span className="">{item.average}</span>
                                                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                                                        </div>

                                                    </div>

                                                ))
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }

                                        </>
                                        :
                                        <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No Resit Results</div>
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
                        <div className='flex flex-col gap-4 items-center justify-center pt-40 text-[18px] text-black'>
                            <span>Account Not Active</span>
                            <Link href={`/${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate/`} className='bg-bluedark font-medium px-4 py-1 rounded text-white tracking-wider'>Activate</Link>
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



