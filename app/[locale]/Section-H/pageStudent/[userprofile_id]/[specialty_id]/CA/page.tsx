import { getData } from '@/functions';
import { ConfigData } from "@/config";
import { Metadata } from 'next';
import React, { Suspense } from 'react'
import { FaMinus } from 'react-icons/fa6';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import Link from 'next/link';
import { GetSchoolFeesUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig';
import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';


export const metadata: Metadata = {
    title: "CA Page",
    description: "Student CA Page",
};

const page = async ({
    params,
}: {
    params: { userprofile_id: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {
    const fieldList = [
        "id", "course__main_course__course_name", "ca"
    ]
    const apiSchoolFees: any = await getData(GetSchoolFeesUrl, {
        userprofile__id: params.userprofile_id, nopage: true, fieldList: ["id", "platform_charges", "platform_paid", "balance",
            "userprofile__specialty__tuition", "userprofile__specialty__payment_one", "userprofile__specialty__payment_two", "userprofile__specialty__payment_three"
        ]
    });
    const apiProfile: any = await getData(GetUserProfileUrl, { id: params.userprofile_id, fieldList: ["user__username"] });
    const apiDataSem1: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_ca: true, course__specialty__id: params.specialty_id, fieldList: [...fieldList] });
    const apiDataSem2: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_ca: true, course__specialty__id: params.specialty_id, fieldList: [...fieldList] });

    console.log(apiDataSem1, 37)
    console.log(apiSchoolFees, 38)

    return (
        <div>
            {apiSchoolFees ?
                apiSchoolFees.length == 1 ?
                    apiSchoolFees[0].platform_paid ?
                        <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

                            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>CA RESULTS</div>

                            <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                            <div className="bg-bluedark dark:border-strokedark grid grid-cols-4 md:grid-cols-4 px-2 py-1 text-lg text-white tracking-wider">
                                <div className="col-span-2 flex items-center">
                                    <span className="font-medium">Course</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">Marks</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">Status</span>
                                </div>
                            </div>

                            <Suspense fallback={<div>Loading ...</div>}>
                                {apiDataSem1?.count ?
                                    (apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (34.9 / 100)) ?
                                        apiDataSem1.results.map((item: GetResultInter, key: number) => (
                                            <div
                                                className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-4 md:grid-cols-4 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                key={key}
                                            >
                                                <div className="col-span-2 flex items-end">
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
                                                        {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData.ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
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

                            <div className="bg-bluedark dark:border-strokedark grid grid-cols-4 md:grid-cols-4 px-2 py-1 text-lg text-white tracking-wider">
                                <div className="col-span-2 flex items-center">
                                    <span className="font-medium">Course</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">Marks</span>
                                </div>
                                <div className="col-span-1 flex items-end justify-end">
                                    <span className="font-medium">Status</span>
                                </div>
                            </div>


                            <Suspense fallback={<div>Loading ...</div>}>
                                {apiDataSem2?.count ?
                                    (apiSchoolFees[0].userprofile__specialty__tuition - apiSchoolFees[0].balance) > (apiSchoolFees[0].userprofile__specialty__tuition * (84.9 / 100)) ?
                                        apiDataSem2.results.map((item: GetResultInter, key: number) => (
                                            <div
                                                className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-4 md:grid-cols-4 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                                                key={key}
                                            >
                                                <div className="col-span-2 flex items-end">
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
                                                        {item.ca == null ? <FaMinus size={20} /> : item.ca > ConfigData.ca_mark ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
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