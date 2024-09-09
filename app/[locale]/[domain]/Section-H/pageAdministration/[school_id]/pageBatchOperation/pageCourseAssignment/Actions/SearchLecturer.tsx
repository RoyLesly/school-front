'use client';
import { GetCustomUserInter } from '@/Domain/Utils-H/userControl/userInter';
import React, { useState } from 'react';

const SearchLecturer = ({ apiLecturer, updateCourseAssignedTo, item }: any) => {
    const [ newData, setNewData ] = useState<GetCustomUserInter[]>(apiLecturer);
    const onSearch = (text: string) => {
        if (text.length > 2){
            const fil = apiLecturer.filter((item: GetCustomUserInter) => item.full_name.toLowerCase().includes(text.toLowerCase()))
            setNewData(fil)
        }
        else { setNewData(apiLecturer)}
    }

    return (
        <div className="col-span-2 flex-col items-center justify-center md:flex mx-0 px-0">
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search Lecturer"
                className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-2 py-1 rounded-lg text-black transition w-40"
            />
            <select defaultValue={item.assigned_to_id} onChange={(e) => { updateCourseAssignedTo(item.main_course_id, parseInt(e.target.value)) }} className='border-2 px-1 py-1 rounded w-40'>
                <option value={0}>------------------</option>
                {newData && newData.map((item: GetCustomUserInter) => (<option key={item.id} value={item.id} className="dark:text-bodydark my-2 text-body">
                    {item.full_name.slice(0, 15)}
                    </option>)
                )}
            </select>
        </div>
    )
}

export default SearchLecturer