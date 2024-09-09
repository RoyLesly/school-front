import { generateGrade, getData } from '@/functions';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { Metadata } from 'next';
import React from 'react'
import { FaDownload } from 'react-icons/fa6';


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

    const apiDataSem1: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_exam: true, fieldList: ["id", "ca", "exam", "resit", "average", "course__main_course__course_name"] });
    const apiDataSem2: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_exam: true, fieldList: ["id", "ca", "exam", "resit", "average", "course__main_course__course_name"] });


    return (
        <div className='h-screen mb-20 mt-16 mx-1 p-1 rounded text-black'>

            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>FINAL RESULTS</div>

            <div className='flex flex-col'>

                <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div>

                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                    <div className="col-span-6 flex items-center">
                        <span className="">Course</span>
                    </div>
                    <div className="col-span-5 flex items-end justify-between">
                        <span className="">CA</span>
                        <span className="">Exam</span>
                        <span className="">Resit</span>
                        <span className="">Total</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-between ml-2">
                        <span className="hidden md:flex w-20">Grade</span>
                        <span className="md:hidden md:item-center w-6">Gd</span>
                    </div>
                </div>


                {apiDataSem1.results && apiDataSem1.results.map((item: GetResultInter, key: number) => (
                    <div
                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 md:text-lg odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-black text-sm"
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
                            <span className="">{item.resit}</span>
                            <span className="">{item.average}</span>
                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                        </div>
                        <div className="col-span-1 flex items-center justify-between md:w-20 ml-2 w-6">
                            <span className="items-start">
                                {generateGrade(item.average)}
                            </span>
                        </div>

                    </div>
                ))}

                <div className='flex items-center justify-center py-2'>
                    {apiDataSem1.count ? <button className="bg-bluedark flex font-medium items-center justify-center md:gap-2 md:text-lg px-4 py-1 rounded text-white">
                        Download <FaDownload />
                    </button> : <></>}
                </div>

                <br />
                <div className='justify-centerfont-medium py-2 text-center tracking-wide'>Semester II</div>


                <div className="bg-bluedark dark:border-strokedark grid grid-cols-12 lg:grid-cols-12 md:px-2 md:text-lg py-1 text-sm text-white tracking-wider">
                    <div className="col-span-6 flex items-center">
                        <span className="">Course</span>
                    </div>
                    <div className="col-span-5 flex items-end justify-between">
                        <span className="">CA</span>
                        <span className="">Exam</span>
                        <span className="">Resit</span>
                        <span className="">Total</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-between ml-2">
                        <span className="hidden md:flex w-20">Grade</span>
                        <span className="md:hidden md:item-center w-6">Gd</span>
                    </div>
                </div>


                {apiDataSem2.results && apiDataSem2.results.map((item: GetResultInter, key: number) => (
                    <div
                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-12 md:grid-cols-12 md:text-lg odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-black text-sm"
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
                            <span className="">{item.resit}</span>
                            <span className="">{item.average}</span>
                            {item.resit && <span className="items-start"><span className='font-bold text-lg text-red'>*</span></span>}
                        </div>
                        <div className="col-span-1 flex items-center justify-between md:w-20 ml-2 w-6">
                            <span className="items-start">
                                {generateGrade(item.average)}
                            </span>
                        </div>
                    </div>
                ))}

                <div className='flex items-center justify-center py-2'>
                    {apiDataSem2.count ? <button className="bg-bluedark flex font-medium items-center justify-center md:gap-2 md:text-lg px-4 py-1 rounded text-white">
                        Download <FaDownload />
                    </button> : <></>}
                </div>

            </div>

        </div>
    )
}

export default page