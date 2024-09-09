'use client';
import { GetLevelUrl, GetClassroomUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetLevelInter, GetClassroomInter } from '@/NoDomain/Utils-S/appControl/appInter';
import { MyButtonSubmitCreate } from '@/section-s/common/MyButtons/MyButtonSubmit';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { DOMAIN_CHOICES } from '@/NoDomain/Utils-S/data';
import { protocol } from '@/config';

const SelectClassroom = ({ params }: any) => {

    const [count, setCount] = useState<number>(0)
    const [classroomData, setclassroomData] = useState<GetClassroomInter[]>();

    const [domain, setDomain] = useState<string>();
    const [yearDataID, setYearDataID] = useState<string>();

    const thisYear = new Date().getFullYear();



    useEffect(() => {
        if (count == 0) {
            console.log(domain, yearDataID, 23)
            if (domain && yearDataID) {
                const getClassrooms = async () => {
                    var res = await getData(protocol + GetClassroomUrl, {
                        school__campus__id: params.school_id,
                        domain: domain,
                        academic_year: yearDataID,
                        fieldList: ["id", "level__level", "level__option", "academic_year"]
                    })
                    console.log(res, 32)
                    if (res && res.results) { setclassroomData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getClassrooms()
                setCount(1)
            }
        }
        if (count == 2) {
        }
    }, [count, params, domain, yearDataID])

    return (
        <div className='bg-white flex flex-col gap-2 md:w-[500px] mt-20 p-6 rounded'>
            <div className='flex flex-col gap-2 justify-between md:text-lg text-sm'>
                <div className='flex items-center justify-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Domain
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(0); setDomain(e.target.value) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {DOMAIN_CHOICES.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>))}
                    </select>
                </div>
                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Year
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(0); setYearDataID(e.target.value) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>))}
                    </select>
                </div>

                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Class
                    </label>
                    <select
                        name='classroom_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={""}>------------------</option>
                        {classroomData && classroomData.map((item: GetClassroomInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.level__level} {item.level__option} {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>
            </div>


        </div>
    )
}

export default SelectClassroom


export const SubmitAdmitStudentButton = () => {
    const [submitClicked, setSubmitClicked] = useState(false)

    return (
        <div className='flex items-center justify-center'>
            {submitClicked ?
                <div className="animate-spin border-4 border-greenlight border-solid border-t-transparent h-10 mt-4 rounded-full w-10"></div>
                :
                <div onClick={() => setSubmitClicked(true)}><MyButtonSubmitCreate /></div>
            }
        </div>
    )
}