import { getData } from '@/functions';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetResultInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { Metadata } from 'next';
import React from 'react'
import { FaMinus } from 'react-icons/fa6';
import { GrClose, GrStatusGood } from 'react-icons/gr';


export const metadata: Metadata = {
    title: "Resit Page",
    description: "Student Resit Page",
};

const page = async ({
    params,
}: {
    params: { userprofile_id: string, specialty_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

    const apiDataSem1: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "I", publish_resit: true, fieldList: [ "course__main_course__course_name", "resit" ] });
    const apiDataSem2: any = await getData(GetResultUrl, { student__id: params.userprofile_id, course__semester: "II", publish_resit: true, fieldList: [ "course__main_course__course_name", "resit" ] });

    return (
        <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

            <div className='flex font-semibold items-center justify-center mb-2 text-xl'>RESIT RESULTS</div>
                
                {apiDataSem1 ? <div className='font-medium justify-center py-2 text-center tracking-wide'>Semester I</div> : <>No Semester 1 Results</>}
                {apiDataSem1 ? <div className="bg-bluedark dark:border-strokedark grid grid-cols-9 md:font-medium md:grid-cols-9 md:text-lg md:tracking-wider px-2 py-1 text-sm text-white">
                    <div className="col-span-6 flex items-center">
                        <span className="">Course</span>
                    </div>
                    <div className="col-span-2 flex items-end justify-end mr-2">
                        <span className="">Resit</span>
                    </div>
                    <div className="col-span-1 flex items-end justify-end">
                        <span className="">Status</span>
                    </div>
                </div> : <></>}


                {apiDataSem1?.count ? apiDataSem1.results.map((item: GetResultInter, key: number) => (
                    <div
                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-9 lg:grid-cols-9 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                        key={key}
                    >
                        <div className="col-span-6 flex items-end">
                            <span className="md:text-lg text-sm">
                                {item.course__main_course__course_name}
                            </span>
                        </div>
                        <div className="col-span-2 flex items-end justify-end mr-2">
                            <span className="">
                                {item.resit}
                            </span>
                        </div>
                        <div className="col-span-1 flex items-end justify-end">
                            <span className="">
                                {item.resit == null ? <FaMinus size={20} /> : parseInt(item.resit?.toString()) > 29.9 ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
                            </span>
                        </div>
                    </div>
                )) : <>No Resit Results</>}



                <br />



                {apiDataSem2.count ? <div className='justify-centerfont-medium py-2 text-center tracking-wide'>Semester II</div> : <></>}

                {apiDataSem2.count ? <div className="bg-bluedark dark:border-strokedark grid grid-cols-9 md:font-medium md:grid-cols-9 md:text-lg md:tracking-wider px-2 py-1 text-sm text-white">
                    <div className="col-span-6 flex items-center">
                        <span className="">Course</span>
                    </div>
                    <div className="col-span-2 flex items-end justify-end mr-2">
                        <span className="">Resit</span>
                    </div>
                    <div className="col-span-1 flex items-end justify-end">
                        <span className="">Status</span>
                    </div>
                </div> : <></>}


                {apiDataSem2?.count ? apiDataSem2.results.map((item: GetResultInter, key: number) => (
                    <div
                        className="border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-9 lg:grid-cols-9 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 text-back text-black"
                        key={key}
                    >
                        <div className="col-span-6 flex items-end">
                            <span className="md:text-lg text-sm">
                                {item.course__main_course__course_name}
                            </span>
                        </div>
                        <div className="col-span-2 flex items-end justify-end mr-2">
                            <span className="">
                                {item.resit}
                            </span>
                        </div>
                        <div className="col-span-1 flex items-end justify-end">
                            <span className="">
                                {item.resit == null ? <FaMinus size={20} /> : parseInt(item.resit?.toString()) > 29.9 ? <GrStatusGood color='green' size={20} /> : <GrClose color='red' size={20} />}
                            </span>
                        </div>
                    </div>
                )) : <>No Resit Results</>}
        </div>
    )
}

export default page