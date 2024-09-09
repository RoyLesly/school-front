'use client';
import BigCalendar from '@/componentsTwo/BigCalendar';
import { protocol } from '@/config';
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import { getData } from '@/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SearchData = ({ searchParams, params }: any) => {

    console.log(searchParams, 7)
    console.log(Object.keys(searchParams).length > 0 ? searchParams : 0, 7)
    const check = Object.keys(searchParams).length > 0 ? searchParams : 0

    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(check && searchParams["date"] ? searchParams["date"] : new Date().toISOString());
    const [data, setData] = useState<any>(new Date().toISOString());
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (count == 0) {
            const getTimeSlots = async () => {
                if (searchParams && Object.keys(searchParams).length > 0 && Object.keys(searchParams).includes("date")) {
                    var res = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { nopage: true, dayprogram__date: searchParams.date })
                    if (res && res.length > 0) {
                        setData(res)
                    }
                } else {
                    var res = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { nopage: true, dayprogram__date: new Date().toISOString().slice(0, 10) })
                    if (res && res.length > 0) {
                        setData(res)
                    }
                }
                setCount(4)
            }
            getTimeSlots()
        }
        if (count == 1) {
            if (selectedDate){
                router.push(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyTimeTable/${params.lecturer_id}?date=${selectedDate}`)
            }
        }

    }, [ router, searchParams, selectedDate, count, params ])


    return (
        <div className="flex flex-col gap-2 p-2 w-full">
            <div className="flex gap-6 items-center justify-center w-full">
                <span>Select Date:</span>
                <input defaultValue={selectedDate.slice(0, 10)} type="date" onChange={(e) => { setSelectedDate(e.target.value); setCount(1) }} />
            </div>
            <BigCalendar selectedDate={selectedDate} data="" />
        </div>
    )
}

export default SearchData