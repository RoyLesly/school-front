'use client';
import { GetLevelUrl, GetClassroomUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { GetLevelInter, GetClassroomInter } from '@/NoDomain/Utils-S/appControl/appInter';
import { MyButtonSubmitCreate } from '@/section-s/common/MyButtons/MyButtonSubmit';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { DOMAIN_CHOICES } from '@/NoDomain/Utils-S/data';
import { protocol } from '@/config';

const SelectSpecialty = ({ school_id }: any) => {

    const [count, setCount] = useState<number>(0)
    const [levelData, setLevelData] = useState<GetLevelInter[]>()
    const [classroomData, setClassroomData] = useState<GetClassroomInter[]>();

    const [domain, setDomain] = useState<string>();
    const [year, setYear] = useState<string>();
    const [levelID, setLevelID] = useState<number>();

    const thisYear = new Date().getFullYear();

    useEffect(() => {
        if (count == 0) {
            const getLevels = async () => {
                var res = await getData(protocol + GetLevelUrl, { nopage: true})
                if (res && res.length > 0) { setLevelData(res) }
            }
            getLevels();
            setCount(1);
        }
        if (count == 1) {
            if (domain && year && levelID) {
                const getClassrooms = async () => {
                    var res = await getData(protocol + GetClassroomUrl, { school__campus__id: school_id, domain: domain, academic_year: year, level__id: levelID, fieldList: [ 
                        "id", "level__level", "level__option", "academic_year" 
                    ] })
                    if (res && res.results) { setClassroomData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getClassrooms()
                setCount(2)
            }
        }
        if (count == 3) {
        }
    }, [count, school_id, domain, year, levelID])

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='dark:text-white font-semibold md:text-xl my-6 text-black text-center w-full'>ASSIGN CLASS</div>
            <div className='flex flex-col gap-2 justify-between md:flex-row md:text-lg text-sm'>
                <div className='flex flex-col items-center justify-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Domain <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setDomain(e.target.value)} }
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                        <option value={0}>------------------</option>
                        {DOMAIN_CHOICES.map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>))}
                    </select>
                </div>
                <div className='flex flex-col items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Year <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setYear(e.target.value)} }
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                        <option value={0}>------------------</option>
                        {[`${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>))}
                    </select>
                </div>
                <div className='flex flex-col items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Level <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                        required={true}
                        onChange={(e) => {setCount(1); setLevelID(parseInt(e.target.value))}}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                        }`}
                    >
                        <option value={0}>------------------</option>
                        {levelData && levelData.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.level} {item.option}
                        </option>))}
                    </select>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Class <span className='font-bold text-lg text-red'>*</span>
                    </label>
                    <select
                        name='classroom_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {classroomData && classroomData.map((item: GetClassroomInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                        {item.level__level} {item.level__option} - {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>

                <div className='flex flex-col items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Session
                    </label>
                    <select
                        name='session'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {["Morning", "Evening"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
                            {item}
                        </option>)
                        )}
                    </select>
                </div>
            </div>

        </div>
    )
}

export default SelectSpecialty


export const SubmitAdmitStudentButton = () => {
    const [ submitClicked, setSubmitClicked ] = useState(false)

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