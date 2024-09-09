'use client';
import { AcademicYearUrl } from '@/Domain/Utils-S/appControl/appConfig';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { protocol } from '@/config';

const FilterTranscript = () => {

    const router = useRouter();
    const [ count, setCount ] = useState<number>(0)
    const [academicYear, setAcademicYear] = useState<string>()
    const [academicYears, setAcademicYears] = useState<string[]>()

    const [ showAcademicYear, setShowAcademicYear ] = useState<boolean>(false)
    
    useEffect(() => {
        if (count == 0){
            const fetchAcademicYear = async () =>{
                try {
                  const {data: response} = await axios.get(protocol + AcademicYearUrl);
                  setAcademicYears(response.results);
                } catch (error) { console.error(error); }
            }
            fetchAcademicYear();
        }
        if (count == 2 && academicYear){
            router.push(`/Section-S/pageAdministration/pageResult/pagePublish?academic_year=` + academicYear);
            setCount(1)
        }
    }, [ count, academicYear, router ])
    
    return (
        <div className='flex flex-col gap-2 text-black text-lg'>
            <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>
                
                <ButtonSelectAcademicYear showAcademicYear={showAcademicYear} setShowAcademicYear={setShowAcademicYear} academicYear={academicYear} academicYears={academicYears} setAcademicYear={setAcademicYear} setCount={setCount} />
            
            </div>
        
        </div>
    )
}

export default FilterTranscript





const ButtonSelectAcademicYear = ({ academicYear, academicYears, setAcademicYear, showAcademicYear, setShowAcademicYear, setCount }: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button"
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => { setShowAcademicYear(!showAcademicYear) }}
                >
                    <span className="flex items-center">
                        <span className="block ml-3 truncate">{academicYear ? academicYear : "Select Academic Year"}</span>
                    </span>
                    <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                        <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>

                <ul className={`${showAcademicYear ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {academicYears && academicYears.map((m: string) => (
                        <li key={m}
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => { setAcademicYear(m); setShowAcademicYear(!showAcademicYear); setCount(2) }}
                        >
                            <div className="flex items-center">
                                <span className="block font-normal ml-3 truncate">{m}</span>
                            </div>

                            <span className={`${m == academicYear ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    )
}
