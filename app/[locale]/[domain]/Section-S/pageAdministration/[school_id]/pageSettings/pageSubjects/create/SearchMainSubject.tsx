'use client';
import { MainSubjectInter } from '@/Domain/Utils-S/appControl/appInter';
import React, { useState } from 'react';

const SearchMainSubject = ({ mainSubjectData }: any) => {
    const [ newData, setNewData ] = useState<MainSubjectInter[]>(mainSubjectData);
    const onSearch = (text: string) => {
        if (text.length > 2){
            const fil = mainSubjectData.filter((item: MainSubjectInter) => item.subject_name.toLowerCase().includes(text.toLowerCase()))
            setNewData(fil)
        }
        else { setNewData(mainSubjectData)}
    }

    return (
        <div>
            <label className="block dark:text-white font-medium mb-2 text-black text-lg">
                Select Course Title
            </label>
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search Course Title"
                className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-5 py-3 rounded-lg text-black transition w-full"
            />
            <select
                name='main_course_id'
                required={true}
                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    true ? "text-black dark:text-white" : ""
                }`}
            >
                <option value={0}>------------------</option>
                {newData && newData.map((item: MainSubjectInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                    {item.subject_name}
                    </option>)
                )}
            </select>
        </div>
    )
}

export default SearchMainSubject