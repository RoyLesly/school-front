'use client';
import BigCalendar from '@/componentsTwo/BigCalendar';
import { protocol } from '@/config';
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import { GetTimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter';
import { getData } from '@/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const SearchData = ({ searchParams, params, apiTimeSlot }: any) => {

    // console.log(searchParams, 7)
    // console.log(Object.keys(searchParams).length > 0 ? searchParams : 0, 7)
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
            if (selectedDate) {
                router.push(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyTimeTable/${params.lecturer_id}?date=${selectedDate}`)
                setCount(2)
            }
        }

    }, [router, searchParams, selectedDate, count, params])

    const onSearch = (formVal: any) => {
        var d = formVal.get("date")
        if (d) {
            router.push(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyTimeTable/${params.lecturer_id}?date=${d}`)
        }
    }


    return (
        <div className="bg-slate-300 flex flex-col gap-2 md:p-2 py-2 rounded w-full">
            <div className="flex gap-4 h-full items-center justify-center w-full">
                <form action={onSearch} className='flex gap-2 items-center justify-center'>
                    <input className='border px-4 py-1 rounded'
                        defaultValue={selectedDate.slice(0, 10)}
                        type="date"
                        name="date"
                        onChange={(e) => { setSelectedDate(e.target.value); setCount(1) }}
                    />
                    <button type="submit"><FaSearch /></button>
                </form>
            </div>

            <BigCalendar selectedDate={selectedDate} data={apiTimeSlot.map((item: GetTimeSlotInter) => ({
                ...item,
                start: new Date(item.start),
                end: new Date(item.end)
            }))}
            />
            <MobileView selectedDate={selectedDate}
                data={Sorting(apiTimeSlot).map(
                    (item: GetTimeSlotInter) => ({
                        ...item,
                        // start: new Date(item.start),
                        // end: new Date(item.end)
                    }))
                } 
                yearweek={apiTimeSlot.map((a: GetTimeSlotInter) => a.timetableday__timetableweek__year_week)}
                params={params}
            />
            <DesktopView selectedDate={selectedDate}
                data={Sorting(apiTimeSlot).map(
                    (item: GetTimeSlotInter) => ({
                        ...item,
                        // start: new Date(item.start),
                        // end: new Date(item.end)
                    }))
                } 
                yearweek={apiTimeSlot.map((a: GetTimeSlotInter) => a.timetableday__timetableweek__year_week)}
                params={params}
            />
        </div>
    )
}

export default SearchData


const Sorting = (arr: GetTimeSlotInter[]) => {
    return arr.sort(function (a, b) {
        let af = a.timetableday__timetableweek__year_week;
        let bf = b.timetableday__timetableweek__year_week;
        let as = new Date(a.start);
        let bs = new Date(b.start);

        // If first value is same
        if (af == bf) {
            return (as < bs) ? -1 : (as > bs) ? 1 : 0;
        } else {
            return af < bf ? 1 : -1;
        }
    });
}