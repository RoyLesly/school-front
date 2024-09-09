'use client';
import { AcademicYearUrl, SubjectUrl, LevelUrl, ClassroomUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { SubjectInter, DomainInter, LevelInter, ClassroomInter, GetClassroomInter, GetSubjectInter } from '@/Domain/Utils-S/appControl/appInter';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { protocol } from '@/config';

const Filter = () => {

    const router = useRouter();
    const [ count, setCount ] = useState<number>(0)
    const [domain, setDomain] = useState<DomainInter>()
    const [domains, setDomains] = useState<DomainInter[]>()
    const [specialty, setSpecialty] = useState<ClassroomInter>()
    const [classrooms, setclassrooms] = useState<ClassroomInter[]>()
    const [levels, setLevels] = useState<LevelInter[]>()
    const [level, setLevel] = useState<LevelInter>()
    const [subjects, setsubjects] = useState<SubjectInter[]>()
    const [ course, setCourse ] = useState<SubjectInter>() 
    const [academicYear, setAcademicYear] = useState<string>()
    const [academicYears, setAcademicYears] = useState<string[]>()
    const [semester, setSemester] = useState<string>()

    const [ showAcademicYear, setShowAcademicYear ] = useState<boolean>(false)
    const [ showDomain, setShowDomain ] = useState<boolean>(false) 
    const [ showLevel, setShowLevel ] = useState<boolean>(false) 
    const [ showSpecialty, setShowSpecialty ] = useState<boolean>(false) 
    const [ showSemester, setShowSemester ] = useState<boolean>(false) 
    const [ showCourse, setShowCourse ] = useState<boolean>(false) 
    
    useEffect(() => {
        if (count == 0){
            const fetchLevels = async () =>{
                try {
                  const {data: response} = await axios.get(protocol + LevelUrl);
                  setLevels(response.results);
                } catch (error) { console.error(error); }
            }
            const fetchAcademicYear = async () =>{
                try {
                  const {data: response} = await axios.get(protocol + AcademicYearUrl);
                  setAcademicYears(response.results);
                } catch (error) { console.error(error); }
            }
            fetchAcademicYear();
            fetchLevels();
            setCount(1);
        }
        if (count == 2 && academicYear && domain && level){
            const fetchclassrooms = async () =>{
                try {
                  const {data: response} = await axios.get(protocol + ClassroomUrl + `?main_specialty__field__domain__id=${domain.id}&&academic_year=${academicYear}&&level__level=${level.level}`);
                  setclassrooms(response.results);
                } catch (error) { console.error(error); }
            }
            fetchclassrooms();
            setCount(3)
        }
        if (count == 4 && specialty && semester){
            const fetchsubjects = async () =>{
                try {
                  const {data: response} = await axios.get(protocol + SubjectUrl + `?specialty__id=${specialty.id}&&semester=${semester}`);
                  setsubjects(response.results);
                } catch (error) { console.error(error); }
            }
            fetchsubjects();
            setCount(5)
        }
        if (count == 6 && academicYear && domain && semester && specialty && course ){
            router.push(`/Section-S/pageAdministration/pageResult?course__id=` + course.id);
            setCount(7)
        }
    }, [ count, academicYear, domain, level, specialty, semester, course, router ])
    
    return (
        <div className='flex flex-col gap-2 mb-2 sm:mb-4 sm:text-lg text-black'>
            <div className='flex flex-col gap-4 items-center justify-between sm:flex-row'>
                
                <ButtonSelectAcademicYear showAcademicYear={showAcademicYear} setShowAcademicYear={setShowAcademicYear} academicYear={academicYear} academicYears={academicYears} setAcademicYear={setAcademicYear} setCount={setCount} />
                <ButtonSelectDomain showDomain={showDomain} setShowDomain={setShowDomain} domains={domains} domain={domain} setDomain={setDomain} setCount={setCount} />
                <ButtonSelectLevel showLevel={showLevel} setShowLevel={setShowLevel} levels={levels} level={level} setLevel={setLevel} setCount={setCount} />
                <div className='bg-blue-500 flex items-center justify-center mt-2 px-4 rounded tracking-wide'>Reset</div>

            </div>

            <div className='flex flex-col gap-2 items-center justify-between sm:flex-row'>
                
                {domain && level && academicYear && <ButtonSelectSpecialty showSpecialty={showSpecialty} setShowSpecialty={setShowSpecialty} classrooms={classrooms} specialty={specialty} setSpecialty={setSpecialty} setCount={setCount} />}
                <ButtonSelectSemester showSemester={showSemester} setShowSemester={setShowSemester} semester={semester} setSemester={setSemester} setCount={setCount} />
                {specialty && <ButtonSelectCourse showCourse={showCourse} setShowCourse={setShowCourse} subjects={subjects} course={course} setCourse={setCourse} setCount={setCount} />}

            </div>
        </div>
    )
}

export default Filter





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


const ButtonSelectDomain = ({domains, domain, setDomain, showDomain, setShowDomain, setCount}: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button" 
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => {setShowDomain(!showDomain)} }
                >
                <span className="flex items-center">
                <span className="block ml-3 truncate">{domain ? domain.domain_name : "Select Domain"}</span>
                </span>
                <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                    <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
                </button>

                <ul className={`${ showDomain ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {domains && domains.map((d: DomainInter) => (
                        <li key={d.id} 
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => { setDomain(d); setShowDomain(!showDomain); setCount(2)}}
                        >
                            <div className="flex items-center">
                                <span className="block font-normal ml-3 truncate">{d.domain_name}</span>
                            </div>

                            {domain && <span className={`${d.id == domain.id ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </span>}
                        </li>
                    ))}
                
                </ul>
            </div>
        </div>
    )
}


const ButtonSelectLevel = ({levels, level, setLevel, showLevel, setShowLevel, setCount}: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button" 
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => {setShowLevel(!showLevel)} }
                >
                <span className="flex items-center">
                <span className="block ml-3 truncate">Level - {level ? level.level : "Select Level"}</span>
                </span>
                <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                    <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
                </button>

                <ul className={`${ showLevel ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {levels && levels.map((d: LevelInter) => (
                        <li key={d.id} 
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => { setLevel(d); setShowLevel(!showLevel); setCount(2)}}
                        >
                            <div className="flex items-center">
                                <span className="block font-normal ml-3 truncate">Level-{d.level}</span>
                            </div>

                            {level && <span className={`${d.id == level.id ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </span>}
                        </li>
                    ))}
                
                </ul>
            </div>
        </div>
    )
}


const ButtonSelectSpecialty = ({specialty, setSpecialty, classrooms, showSpecialty, setShowSpecialty, setCount}: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button" 
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => {setShowSpecialty(!showSpecialty)} }
                >
                <span className="flex items-center">
                <span className="block ml-3 truncate">{specialty ? (specialty.main_specialty?.specialty_name + " " + specialty?.level?.level + " " + specialty?.academic_year) : "Select Specialty"}</span>
                </span>
                <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                    <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
                </button>

                <ul className={`${ showSpecialty ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {classrooms && classrooms.map((m: GetClassroomInter) => (
                        <li key={m.id} 
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => {  setSpecialty(m); setShowSpecialty(!showSpecialty); setCount(4)}}
                        >
                            <div className="flex items-center">
                                <span className="block font-normal ml-3 truncate">{m.level__level} {m.level__option + " " + m.academic_year}</span>
                            </div>

                            <span className={`${m.id == specialty?.id ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
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

const ButtonSelectSemester = ({semester, setSemester, showSemester, setShowSemester, setCount}: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button" 
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => {setShowSemester(!showSemester)} }
                >
                <span className="flex items-center">
                <span className="block ml-3 truncate">{semester ? "Semester-" + semester : "Select Semester"}</span>
                </span>
                <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                    <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
                </button>

                <ul className={`${ showSemester ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {["I", "II"].map((m: string) => (
                        <li key={m} 
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => { setSemester(m); setShowSemester(!showSemester); setCount(4)}}
                        >
                            <div className="flex items-center">
                                <span className="block font-normal ml-3 truncate">Semester-{m}</span>
                            </div>

                            {semester && <span className={`${m == semester ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </span>}
                        </li>
                    ))}
                
                </ul>
            </div>
        </div>
    )
}


const ButtonSelectCourse = ({course, setCourse, subjects, showCourse, setShowCourse, setCount}: any) => {

    return (
        <div className='flex w-full'>
            <div className="mt-2 relative w-full">
                <button type="button" 
                    className="bg-white cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-3 pr-10 py-1.5 relative ring-1 ring-gray-300 ring-inset rounded-md shadow-sm sm:leading-6 text-left w-full" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                    onClick={() => {setShowCourse(!showCourse)} }
                >
                <span className="flex items-center">
                <span className="block ml-3 truncate">{course ? (course.main_course?.course_name) : "Select Course"}</span>
                </span>
                <span className="absolute flex inset-y-0 items-center ml-3 pointer-events-none pr-2 right-0">
                    <svg className="h-5 text-gray-400 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </span>
                </button>

                <ul className={`${ showCourse ? "" : "hidden"} absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3`}>

                    {subjects && subjects.map((m: GetSubjectInter) => (
                        <li key={m.id} 
                            className="cursor-default pl-3 pr-9 py-2 relative select-none text-gray-900" id="listbox-option-0"
                            onClick={() => {  setCourse(m); setShowCourse(!showCourse); setCount(6)}}
                        >
                            <div className="flex flex-row font-normal items-center justify-between ml-3 truncate">
                                {/* <span className='flex'>S-{m.semester}</span> */}
                                <span className='flex'>{m.classroom__level__level} {m.classroom__level__option}</span>
                            </div>

                            <span className={`${m.id == course?.id ? "flex" : "hidden"} text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4`}>
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
