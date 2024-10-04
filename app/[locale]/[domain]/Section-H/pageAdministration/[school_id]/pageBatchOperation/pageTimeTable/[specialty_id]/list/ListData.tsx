'use client';
import { protocol } from '@/config';
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import { GetTimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter';
import { getData } from '@/functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const ListData = ({ searchParams, params, apiTimeSlots, apiSpecialty, apiCourses }: any) => {

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

            <DesktopView selectedDate={selectedDate}
                data={Sorting(apiTimeSlots).map(
                    (item: GetTimeSlotInter) => ({
                        ...item,
                    }))
                } 
                yearweek={apiTimeSlots.map((a: GetTimeSlotInter) => a.timetableday__timetableweek__year_week)}
                params={params}
                apiSpecialty={apiSpecialty}
                apiCourses={apiCourses}
            />

            <MobileView selectedDate={selectedDate}
                data={Sorting(apiTimeSlots).map(
                    (item: GetTimeSlotInter) => ({
                        ...item,
                    }))
                } 
                yearweek={apiTimeSlots.map((a: GetTimeSlotInter) => a.timetableday__timetableweek__year_week)}
                params={params}
                apiSpecialty={apiSpecialty}
                apiCourses={apiCourses}
            />

        </div>
    )
}

export default ListData


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