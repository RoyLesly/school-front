import { GetMainSubjectUrl, MainSubjectUrl } from '@/Domain/Utils-S/appControl/appConfig'
import { MainSubjectInter } from '@/Domain/Utils-S/appControl/appInter'
import { getData } from '@/functions'
import { usePathname } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'


interface SubjectsListProps {
    data: MainSubjectInter[]
    addMainSubjectItems: any
}

const MainSubjectsList: FC<SubjectsListProps> = ({ data, addMainSubjectItems }) => {
    return (
        <div className='flex flex-col'>
            <List data={data} addMainSubjectItems={addMainSubjectItems} />
        </div>
    )
}

export default MainSubjectsList


const List: FC<SubjectsListProps> = ({ data, addMainSubjectItems }) => {

    const [ count, setCount ] = useState<number>(0)
    const [ searchText, setSearchText ] = useState<string>()
    const [ tableData, setTableData ] = useState<MainSubjectInter[]>()
    const [ mainSubjectsToAssign, setMainSubjectsToAssign ] = useState<MainSubjectInter[]>(data)

    const pathUrl = usePathname()

    useEffect(() => {
        if (count == 1 && searchText && searchText.length > 1) {
            const searchBack = async () => {
                const res = await getData(GetMainSubjectUrl, { "subject_name": searchText, nopage: true })
                if (res){
                    setMainSubjectsToAssign(res)
                    setCount(2)
                }
            }
            searchBack()             
        } 
        if (count == 1 && searchText && searchText.length < 2) {
            setMainSubjectsToAssign(data)
        }
    }, [ count, tableData, pathUrl, data, searchText ]);

    return (
        <div className='flex flex-col'>

            <input
                placeholder='Search Course Name Here ...' className='border-2 dark:bg-slate-700 dark:border-slate-300 dark:text-white flex font-semibold mb-2 px-6 py-2 w-full' 
                onChange={ (e) => { setSearchText(e.target.value); setCount(1) } }
            />

            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-7 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-1 items-center justify-center md:flex">
                    <span className="font-medium">No</span>
                </div>

                <div className="col-span-6 items-center justify-start md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>
            </div>
            {
                mainSubjectsToAssign && mainSubjectsToAssign.length > 0 && mainSubjectsToAssign.map((item: MainSubjectInter, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t cursor-pointer dark:bg-slate-700 dark:border-strokedark dark:hover:bg-teal-700 font-semibold grid grid-cols-7 hover:bg-teal-300 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                        onClick={() => { addMainSubjectItems(item); }}
                    >

                        <div className="col-span-1 items-center justify-center md:flex">
                            <span className="dark:text-white text-black">
                                {index + 1}
                            </span>
                        </div>

                        <div className="col-span-6 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.subject_name}
                            </span>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}