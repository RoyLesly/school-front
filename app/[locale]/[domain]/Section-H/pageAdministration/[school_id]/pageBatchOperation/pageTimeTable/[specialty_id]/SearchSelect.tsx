'use client';
import React, { useState } from 'react';
import Select from 'react-select';


const SearchSelect = ({ name, defaultValue, data, register, className}: { name: string, defaultValue?: any, data?: any, register?: any, className?: any,}) => {
    const [selectedOption, setSelectedOption] = useState(defaultValue);

    return (
        <div className='w-full'>
            <Select 
                name={name}
                defaultValue={selectedOption}
                options={data && data.map((item: { id: number, main_course__course_name: string}) => { return {value: item.id, label: item.main_course__course_name} })}
            />
        </div>
    )
}

export default SearchSelect