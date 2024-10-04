'use client'
import React, { useState } from 'react';
import { getStartEndOfWeek, getWeekRange } from '@/functions';
import { TimeSlotUrl, TimeTableDayUrl, TimeTableWeekUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { protocol } from '@/config';
import { SchemaCreateEditTimeSlot, SchemaCreateEditTimeTableDay, SchemaCreateEditTimeTableWeek } from '@/Domain/schemas/schemas';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MyButtonModal from '@/section-h/common/MyButtons/MyButtonModal';
import SelectField from '@/componentsTwo/SelectField';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useRouter } from 'next/navigation';


const SchemaCreate = z.object({
    MONDAY_0810: z.coerce.number().optional(), MONDAY_1012: z.coerce.number().optional(), MONDAY_1315: z.coerce.number().optional(), MONDAY_1517: z.coerce.number().optional(), MONDAY_1719: z.coerce.number().optional(), MONDAY_1921: z.coerce.number().optional(),
    TUESDAY_0810: z.coerce.number().optional(), TUESDAY_1012: z.coerce.number().optional(), TUESDAY_1315: z.coerce.number().optional(), TUESDAY_1517: z.coerce.number().optional(), TUESDAY_1719: z.coerce.number().optional(), TUESDAY_1921: z.coerce.number().optional(),
    WEDNESDAY_0810: z.coerce.number().optional(), WEDNESDAY_1012: z.coerce.number().optional(), WEDNESDAY_1315: z.coerce.number().optional(), WEDNESDAY_1517: z.coerce.number().optional(), WEDNESDAY_1719: z.coerce.number().optional(), WEDNESDAY_1921: z.coerce.number().optional(),
    THURSDAY_0810: z.coerce.number().optional(), THURSDAY_1012: z.coerce.number().optional(), THURSDAY_1315: z.coerce.number().optional(), THURSDAY_1517: z.coerce.number().optional(), THURSDAY_1719: z.coerce.number().optional(), THURSDAY_1921: z.coerce.number().optional(),
    FRIDAY_0810: z.coerce.number().optional(), FRIDAY_1012: z.coerce.number().optional(), FRIDAY_1315: z.coerce.number().optional(), FRIDAY_1517: z.coerce.number().optional(), FRIDAY_1719: z.coerce.number().optional(), FRIDAY_1921: z.coerce.number().optional(),
    SATURDAY_0810: z.coerce.number().optional(), SATURDAY_1012: z.coerce.number().optional(), SATURDAY_1315: z.coerce.number().optional(), SATURDAY_1517: z.coerce.number().optional(), SATURDAY_1719: z.coerce.number().optional(), SATURDAY_1921: z.coerce.number().optional(),
    SUNDAY_0810: z.coerce.number().optional(), SUNDAY_1012: z.coerce.number().optional(), SUNDAY_1315: z.coerce.number().optional(), SUNDAY_1517: z.coerce.number().optional(), SUNDAY_1719: z.coerce.number().optional(), SUNDAY_1921: z.coerce.number().optional(),
})

type Inputs = z.infer<typeof SchemaCreate>;

export const Days: string[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",]

const CreateTimeTableForm = ({ params, searchParams, courses }: any) => {

    const router = useRouter();
    const [clicked, setClicked] = useState<boolean>(false);
    const [processingLevel, setProcessingLevel] = useState<number>(0);

    const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
        resolver: zodResolver(SchemaCreate),
    });

    const WeekDayDates: string[] = getWeekRange(searchParams.weekNo.slice(2,), new Date().getFullYear())
    const onSubmit = handleSubmit((d) => {
        setClicked(true)
        var year_week = searchParams.weekNo;
        var specialty_id = params.specialty_id;

        var arr = [
            d.MONDAY_0810, d.MONDAY_1012, d.MONDAY_1315, d.MONDAY_1517, d.MONDAY_1719, d.MONDAY_1921,
            d.TUESDAY_0810, d.TUESDAY_1012, d.TUESDAY_1315, d.TUESDAY_1517, d.TUESDAY_1719, d.TUESDAY_1921,
            d.WEDNESDAY_0810, d.WEDNESDAY_1012, d.WEDNESDAY_1315, d.WEDNESDAY_1517, d.WEDNESDAY_1719, d.WEDNESDAY_1921,
            d.THURSDAY_0810, d.THURSDAY_1012, d.THURSDAY_1315, d.THURSDAY_1517, d.THURSDAY_1719, d.THURSDAY_1921,
            d.FRIDAY_0810, d.FRIDAY_1012, d.FRIDAY_1315, d.FRIDAY_1517, d.FRIDAY_1719, d.FRIDAY_1921,
            d.SATURDAY_0810, d.SATURDAY_1012, d.SATURDAY_1315, d.SATURDAY_1517, d.SATURDAY_1719, d.SATURDAY_1921,
            d.SUNDAY_0810, d.SUNDAY_1012, d.SUNDAY_1315, d.SUNDAY_1517, d.SUNDAY_1719, d.SUNDAY_1921,
        ]

        var data_for_timetable_week = { year_week, specialty_id, publish: true }

        if (arr.filter((item: any) => item ? item : null).length) {
            const call = async () => {
                const response = await ActionCreate(data_for_timetable_week, SchemaCreateEditTimeTableWeek, protocol + "api" + params.domain + TimeTableWeekUrl, `/${params.domain}/Section-H/pageAdministration/${params.school}/pageBatchOperation/pageTimeTable`)
                if (response.id) {
                    var saveCountDay = 0
                    var saveCountSlot = 0
                    for (let index = 0; index < Days.length; index++) {
                        const day_name = Days[index];       // e.g MONDAY
                        var data_for_timetable_day: any = null
                        const CheckEmpty = (a: any, b: any, c: any, d: any, e: any, f: any) => {
                            if (a || b || c || d || e || f) {
                                data_for_timetable_day = {
                                    timetableweek_id: response.id,
                                    date: WeekDayDates[index],
                                    day: day_name,
                                }
                                return data_for_timetable_day
                            }
                        }

                        var t = index
                        if (index == 0) { t = 0 }
                        if (index == 1) { t = 6 }
                        if (index == 2) { t = 12 }
                        if (index == 3) { t = 18 }
                        if (index == 4) { t = 24 }
                        if (index == 5) { t = 30 }
                        if (index == 6) { t = 36 }

                        data_for_timetable_day = CheckEmpty(arr[t], arr[t + 1], arr[t + 2], arr[t + 3], arr[t + 4], arr[t + 5])

                        if (data_for_timetable_day) {
                            var responseDay = await ActionCreate(data_for_timetable_day, SchemaCreateEditTimeTableDay, protocol + "api" + params.domain + TimeTableDayUrl)
                            ++saveCountDay
                            if (responseDay && responseDay.id) {
                                var hours = [8, 10, 13, 15, 17, 19]
                                var course_ids = [arr[t], arr[t + 1], arr[t + 2], arr[t + 3], arr[t + 4], arr[t + 5]]

                                for (let indexTwo = 0; indexTwo < course_ids.length; indexTwo++) {
                                    const id = course_ids[indexTwo];
                                    if (id && parseInt(id.toString()) > 0) {
                                        var data_for_timeslot = {
                                            course_id: parseInt(id.toString()),
                                            timetableday_id: responseDay.id,
                                            start: new Date(new Date(WeekDayDates[index]).setHours(hours[indexTwo] + 1, 0, 0)).toISOString().slice(0, 19),
                                            end: new Date(new Date(WeekDayDates[index]).setHours(hours[indexTwo] + 3, 0, 0)).toISOString().slice(0, 19),
                                            status: "PENDING",
                                            action: "PENDING",
                                            session: searchParams.session
                                        }
                                        var responseSlot = await ActionCreate(data_for_timeslot, SchemaCreateEditTimeSlot, protocol + "api" + params.domain + TimeSlotUrl)
                                        if (responseSlot && responseSlot.id) {
                                            setProcessingLevel(saveCountSlot * 5)
                                            ++saveCountSlot
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (saveCountDay && saveCountSlot) {
                        setProcessingLevel(100)
                        router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable?success=Operation Successful`)
                    }
                } else {
                    setProcessingLevel(99)
                    router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}?weekNo=${searchParams.weekNo}&session=${searchParams.session}&error="Error !!!`);
                }
                setClicked(false)
            }
            call()
        } else {
            setClicked(false)
            // setProcessingLevel(0)
        }

    })


    return <form onSubmit={onSubmit} className='flex flex-col gap-2 text-black'>

        <div className='flex flex-row gap-4 items-center justify-center'>
            <div className='flex flex-col italic md:flex-row md:text-lg text-[14px]'>
                <span>{getStartEndOfWeek(searchParams.weekNo.slice(2,), new Date().getFullYear())[0]}</span>
                <span className='font-bold hidden md:block'>-</span>
                <span>{getStartEndOfWeek(searchParams.weekNo.slice(2,), new Date().getFullYear())[1]}</span>
            </div>
            <span className='font-semibold text-lg tracking-widest'>{searchParams.session}</span>
        </div>

        <div className='bg-slate-600 flex flex-col p-2'>
            {searchParams.session == "Morning" ?
                <div className="bg-blue-800 dark:border-strokedark grid-cols-9 hidden md:grid py-1 rounded text-white tracking-wider">
                    <div className="col-span-1 items-center justify-center md:flex">
                        <span className="font-medium">DAY</span>
                    </div>
                    <div className="col-span-2 items-center justify-center md:flex">
                        <span className="font-medium">08 - 10</span>
                    </div>
                    <div className="col-span-2 items-center justify-center md:flex">
                        <span className="font-medium">10 - 12</span>
                    </div>
                    <div className="col-span-2 items-center justify-center md:flex">
                        <span className="font-medium">13 - 15</span>
                    </div>
                    <div className="col-span-2 items-center justify-center md:flex">
                        <span className="font-medium">15 - 17</span>
                    </div>
                </div>
                :
                <></>
            }

            {searchParams.session == "Evening" ?
                <div className="bg-blue-800 dark:border-strokedark grid-cols-10 hidden md:grid py-1 rounded text-white tracking-wider">
                    <div className="col-span-2 items-center justify-center md:flex">
                        <span className="font-medium">DAY</span>
                    </div>
                    <div className="col-span-4 items-center justify-center md:flex">
                        <span className="font-medium">17 - 19</span>
                    </div>
                    <div className="col-span-4 items-center justify-center md:flex">
                        <span className="font-medium">19 - 21</span>
                    </div>
                </div>
                :
                <></>
            }

            {courses && Days.map((actual: string) => (
                <>
                    {searchParams.session == "Morning" ?
                        <div key={actual} className="bg-slate-400 dark:border-strokedark even:bg-slate-100 gap-1 grid-cols-9 md:grid py-1 text-[12px] tracking-wider">
                            <div className="col-span-1 flex items-center justify-center md:justify-start pl-2 text-[18px]">
                                <span className="font-medium italic text-[14px]">{actual}</span>
                            </div>
                            <div className="col-span-2 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>8-10</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_0810`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                            <div className="col-span-2 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>10-12</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_1012`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                            <div className="col-span-2 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>13-15</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_1315`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                            <div className="col-span-2 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>15-17</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_1517`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                        </div>
                        :
                        <></>
                    }

                    {searchParams.session == "Evening" ?
                        <div key={actual} className="dark:border-strokedark gap-1 grid-cols-10 md:grid odd:bg-slate-100 py-1 text-[12px] tracking-wider">
                            <div className="col-span-2 flex items-center justify-center md:justify-start pl-2 text-[18px]">
                                <span className="font-medium italic text-[14px]">{actual}</span>
                            </div>
                            <div className="col-span-4 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>17-19</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_1719`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                            <div className="col-span-4 flex flex-row items-center justify-between">
                                <span className='font-semibold md:hidden text-[13px] text-center w-1/5'>19-21</span>
                                <SelectField
                                    label=""
                                    name={`${actual}_1921`}
                                    register={register}
                                    display={{ name: "main_course__course_name", value: "id" }}
                                    data={courses}
                                />
                            </div>
                        </div>
                        :
                        <></>
                    }
                </>

            ))}
        </div>

        <div className="flex gap-4 items-center justify-center">
            <MyButtonModal type={"create"} clicked={clicked} />
            {processingLevel ? <div className="flex h-16 items-center justify-center w-16">{true ? <CircularProgressbar value={processingLevel} text={`${processingLevel}%`} /> : null}</div> : null}

        </div>
    </form>

}

export default CreateTimeTableForm