'use client';
import { MyButtonSubmitCreate } from '@/NoDomain/section-h/common/MyButtons/MyButtonSubmit';
import { getData } from '@/functions';
import React, { useEffect, useState } from 'react';
import { GetDomainUrl, GetLevelUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { DomainInter, GetLevelInter, GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';

const SelectSpecialty = ({ params }: any) => {

    const [count, setCount] = useState<number>(0)
    const [levelData, setLevelData] = useState<GetLevelInter[]>()
    const [domainData, setDomainData] = useState<DomainInter[]>();
    const [specialtyData, setSpecialtyData] = useState<GetSpecialtyInter[]>();

    const [domainDataID, setDomainDataID] = useState<number>();
    const [yearDataID, setYearDataID] = useState<string>();
    const [levelDataID, setLevelDataID] = useState<number>();

    const thisYear = new Date().getFullYear();



    useEffect(() => {
        if (count == 0) {
            const getLevels = async () => {
                var res = await getData(protocol + GetLevelUrl, {})
                if (res && res.results) { setLevelData(res.results) }
            }
            const getDomains = async () => {
                var res = await getData(protocol + GetDomainUrl, {})
                if (res && res.results) { setDomainData(res.results) }
            }
            getLevels();
            getDomains();
            setCount(1);
        }
        if (count == 1) {
            if (domainDataID && yearDataID && levelDataID) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + GetSpecialtyUrl, {
                        school__campus__id: params.school_id,
                        main_specialty__field__domain__id: domainDataID,
                        academic_year: yearDataID,
                        level__id: levelDataID,
                        fieldList: ["id", "main_specialty__specialty_name", "level__level", "academic_year"]
                    })
                    if (res && res.results) { setSpecialtyData(res.results) }
                    if (res && res["unauthorized"]) { console.log("object") }
                }
                getSpecialties()
                setCount(2)
            }
        }
        if (count == 3) {
        }
    }, [count, params, domainDataID, yearDataID, levelDataID])

    return (
        <div className='bg-white flex flex-col gap-2 md:w-[500px] mt-20 p-6 rounded'>
            <div className='flex flex-col gap-2 justify-between md:text-lg text-sm'>
                <div className='flex items-center justify-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Domain
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setDomainDataID(parseInt(e.target.value)) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {domainData && domainData.map((item: DomainInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.domain_name}
                        </option>))}
                    </select>
                </div>
                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Year
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setYearDataID(e.target.value) }}
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
                        Select Level
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setLevelDataID(parseInt(e.target.value)) }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {levelData && levelData.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.level}
                        </option>))}
                    </select>
                </div>

                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Class
                    </label>
                    <select
                        name='specialty_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={""}>------------------</option>
                        {specialtyData && specialtyData.map((item: GetSpecialtyInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.main_specialty__specialty_name} - {item.level__level} - {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>
                <div className='flex items-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/4">
                        Select Semester
                    </label>
                    <select
                        name='semester'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={""}>------------------</option>
                        {["I", "II"].map((item: string) => (<option key={item} value={item} className="dark:text-bodydark my-2 text-body">
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