import { getData } from '@/functions';
import ServerError from '@/section-h/common/ServerError';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetSchoolFeesUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react'
import { FaDownload, FaMinus } from 'react-icons/fa6';


export const metadata: Metadata = {
    title: "Exam Page",
    description: "Student Exam Page",
};

const page = async ({
    params,
    searchParams,
}: {
    params: { userprofile_id: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiSchoolFees: any = await getData(GetSchoolFeesUrl, {
        userprofile__id: params.userprofile_id, nopage: true, fieldList: ["id", "platform_charges", "platform_paid", "balance",
            "userprofile__specialty__tuition", "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
        ]
    });
    const apiProfile: any = await getData(GetUserProfileUrl, { id: params.userprofile_id, fieldList: ["user__username"] });
    const apiDataSem1: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_exam: true, fieldList: ["id", "ca", "exam", "course__main_course__course_name"] });
    const apiDataSem2: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_exam: true, fieldList: ["id", "ca", "exam", "course__main_course__course_name"] });

    console.log(apiDataSem1, 28)
    return (
        <div>
            {apiSchoolFees ?
                apiSchoolFees.length == 1 ?
                    apiSchoolFees[0].platform_paid ?

                        <div className='h-screen mb-20 mt-16 mx-1 p-1 rounded text-black'>

                            {apiDataSem1 == "ECONNRESET" && <ServerError />}

                            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>EXAM RESULTS</div>




                            {/* SEMESTER I DIV */}
                            <div className='flex flex-col'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                                    <div className="col-span-6 flex items-center">
                                        <span className="">Course</span>
                                    </div>
                                    <div className="col-span-5 flex items-end justify-between">
                                        <span className="">CA</span>
                                        <span className="">Exam</span>
                                        <span className="">Total</span>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-between ml-2">
                                        <span className="hidden md:flex w-20">Grade</span>
                                        <span className="md:hidden md:item-center w-6">Gd</span>
                                    </div>
                                </div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem1?.count ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (64.9 / 100)) ?
                                                apiDataSem1.results.map((item: GetResultInter, key: number) => (
                                                    <div
                                                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                        key={key}
                                                    >
                                                        <div className="col-span-6 flex items-end">
                                                            <span className="md:text-lg text-sm">
                                                                {item.course__main_course__course_name}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-5 flex items-end justify-between">
                                                            <span className="">{item.ca}</span>
                                                            <span className="">{item.exam}</span>
                                                            <span className="">{parseInt(item.ca?.toString()) + parseInt(item.exam?.toString())}</span>
                                                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                                                        </div>
                                                        <div className="col-span-1 flex items-end justify-end">
                                                            <span className="">
                                                                {/* {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData.ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />} */}
                                                            </span>
                                                        </div>

                                                    </div>



                                                ))
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }

                                            <button className="bg-bluedark flex font-medium items-center justify-center md:gap-2 md:text-lg mt-4 px-4 py-1 rounded text-white">
                                                Download <FaDownload />
                                            </button>

                                        </>
                                        :
                                        <div className='flex font-medium items-center justify-center py-24 tracking-wider'>No CA Results</div>
                                    }
                                </Suspense>

                            </div>





                            {/* SEMESTER II DIV */}
                            <div className='flex flex-col mt-10'>

                                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester II</div>

                                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                                    <div className="col-span-6 flex items-center">
                                        <span className="">Course</span>
                                    </div>
                                    <div className="col-span-5 flex items-end justify-between">
                                        <span className="">CA</span>
                                        <span className="">Exam</span>
                                        <span className="">Total</span>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-between ml-2">
                                        <span className="hidden md:flex w-20">Grade</span>
                                        <span className="md:hidden md:item-center w-6">Gd</span>
                                    </div>
                                </div>

                                <Suspense fallback={<div>Loading ...</div>}>
                                    {apiDataSem2?.count ?
                                        <>
                                            {(apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (99.9 / 100)) ?
                                                apiDataSem2.results.map((item: GetResultInter, key: number) => (
                                                    <div
                                                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                        key={key}
                                                    >
                                                        <div className="col-span-6 flex items-end">
                                                            <span className="md:text-lg text-sm">
                                                                {item.course__main_course__course_name}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-5 flex items-end justify-between">
                                                            <span className="">{item.ca}</span>
                                                            <span className="">{item.exam}</span>
                                                            <span className="">{parseInt(item.ca?.toString()) + parseInt(item.exam?.toString())}</span>
                                                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                                                        </div>
                                                        <div className="col-span-1 flex items-end justify-end">
                                                            <span className="">
                                                                {/* {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData.ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />} */}
                                                            </span>
                                                        </div>

                                                    </div>



                                                ))
                                                :
                                                <div className='flex font-medium items-center justify-center px-10 py-24 text-center text-wrap tracking-wider'>Not Meeting Minimum Required School Fees to View Results</div>
                                            }

                                            <button className="bg-bluedark flex font-medium items-center justify-center md:gap-2 md:text-lg mt-4 px-4 py-1 rounded text-white">
                                                Download <FaDownload />
                                            </button>

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
                        <div className='flex flex-col gap-4 items-center justify-center pt-40 text-[18px] text-black'>
                            <span>Account Not Active</span>
                            <Link href={`/pageStudent/${params.userprofile_id}/${params.specialty_id}/Fees/Activate/`} className='bg-bluedark font-medium px-4 py-1 rounded text-white tracking-wider'>Activate</Link>
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



