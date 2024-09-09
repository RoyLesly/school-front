'use client';
import { GetDomainUrl, GetLevelUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { DomainInter, GetLevelInter, GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { MyButtonSubmitCreate } from '@/NoDomain/section-h/common/MyButtons/MyButtonSubmit';
import { getData } from '@/functions';
import { ProgramUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { ProgramInter } from '@/NoDomain/Utils-H/userControl/userInter';
import React, { useEffect, useState } from 'react';
import { protocol } from '@/config';

const SelectSpecialty = ({ school_id }: any) => {

    const [count, setCount] = useState<number>(0)
    const [programData, setProgramData] = useState<ProgramInter[]>()
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
            const getPrograms = async () => {
                var res = await getData(protocol + ProgramUrl, {})
                if (res && res.results) { setProgramData(res.results) }
            }
            getLevels();
            getDomains();
            getPrograms();
            setCount(1);
        }
        if (count == 1) {
            if (domainDataID && yearDataID && levelDataID) {
                const getSpecialties = async () => {
                    var res = await getData(protocol + GetSpecialtyUrl, { 
                        school__campus__id: school_id, 
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
    }, [count, school_id, domainDataID, yearDataID, levelDataID])

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='dark:text-white font-semibold md:text-xl my-6 text-black text-center w-full'>ASSIGN CLASS</div>
            <div className='flex flex-col gap-2 justify-between md:flex-row md:text-lg text-sm'>
                <div className='flex items-center justify-center w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Domain
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setDomainDataID(parseInt(e.target.value))} }
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
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Year
                    </label>
                    <select
                        required={true}
                        onChange={(e) => { setCount(1); setYearDataID(e.target.value)} }
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
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Level
                    </label>
                    <select
                        required={true}
                        onChange={(e) => {setCount(1); setLevelDataID(parseInt(e.target.value))}}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {levelData && levelData.map((item: GetLevelInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.level}
                        </option>))}
                    </select>
                </div>

            </div>


            <div className='flex flex-col gap-2 justify-between md:flex-row md:gap-6 md:text-lg text-sm'>
                <div className='flex items-center justify-center md:w-1/2 w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select Class
                    </label>
                    <select
                        name='specialty_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {specialtyData && specialtyData.map((item: GetSpecialtyInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.main_specialty__specialty_name} - {item.level__level} - {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>
                <div className='flex items-center justify-center md:w-1/4 w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Program
                    </label>
                    <select
                        name='program_id'
                        required={true}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {programData && programData.map((item: ProgramInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                            {item.name}
                        </option>)
                        )}
                    </select>
                </div>
                <div className='flex items-center justify-center md:w-1/4 w-full'>
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