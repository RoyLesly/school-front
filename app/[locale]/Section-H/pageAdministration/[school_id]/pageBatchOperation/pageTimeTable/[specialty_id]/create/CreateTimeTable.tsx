import React from 'react';
import SearchSelect from '../edit/[dayprogram_id]/SearchSelect';
import { getMondays, getStartEndOfWeek, getWeekOfYear } from '@/functions';
import { redirect } from 'next/navigation';
import { DayProgramUrl, TimeTableUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { SchemaCreateEditDayProgram, SchemaCreateEditTimeTable } from '@/Domain/schemas/schemas';
import { protocol } from '@/config';


const CreateTimeTable = async ({ params, searchParams, courses }: any) => {

    const Mondays: string[] = await getMondays(parseInt(searchParams.month), parseInt(searchParams.year))

    const weekRange: { weekNo: number, week: string[]}[] = await Mondays.map((day: string) => { 
        return {weekNo: searchParams.year + getWeekOfYear(new Date(day)), week: getStartEndOfWeek(getWeekOfYear(new Date(day), searchParams.year), searchParams.year)}
    })

    const Days: { id: number, day: string }[] = [
        { id: 1, day: "MONDAY" },
        { id: 2, day: "TUESDAY" },
        { id: 3, day: "WEDNESDAY" },
        { id: 4, day: "THURSDAY" },
        { id: 5, day: "FRIDAY" },
        { id: 6, day: "SATURDAY" },
        { id: 7, day: "SUNDAY" },
    ]

    const SubmitCreate = async (d: FormData) => {
        "use server"

        var year_week = d.get("year_week");
        var specialty_id = params.specialty_id;

        var arr = [ 
            d.get("MONDAY_period_0812_id"), d.get("MONDAY_period_1317_id"), d.get("MONDAY_period_1721_id"),
            d.get("TUESDAY_period_0812_id"), d.get("TUESDAY_period_1317_id"), d.get("TUESDAY_period_1721_id"),
            d.get("WEDNESDAY_period_0812_id"), d.get("WEDNESDAY_period_1317_id"), d.get("WEDNESDAY_period_1721_id"),
            d.get("THURSDAY_period_0812_id"), d.get("THURSDAY_period_1317_id"), d.get("THURSDAY_period_1721_id"), 
            d.get("FRIDAY_period_0812_id"), d.get("FRIDAY_period_1317_id"), d.get("FRIDAY_period_1721_id"), 
            d.get("SATURDAY_period_0812_id"), d.get("SATURDAY_period_1317_id"), d.get("SATURDAY_period_1721_id"), 
            d.get("SUNDAY_period_0812_id"), d.get("SUNDAY_period_1317_id"), d.get("SUNDAY_period_1721_id")
        ]

        var data_for_time_table = { year_week, specialty_id, publish: true }

        const response = await ActionCreate(data_for_time_table, SchemaCreateEditTimeTable, protocol + TimeTableUrl)
        if (response.id){
            for (let index = 0; index < Days.length; index++) {
                const item = Days[index];
                var t = index
                
                if (index == 0) { t = 0}
                if (index == 1) { t = 3}
                if (index == 2) { t = 6}
                if (index == 3) { t = 9}
                if (index == 4) { t = 12}
                if (index == 5) { t = 15}
                if (index == 6) { t = 18}

                var data_for_day_program: any = { 
                    timetable_id: response.id, 
                    day: item.day,
                }

                const CheckEmpty = (a: any, b: any, c: any) => {
                    if (a != ""){ data_for_day_program = {...data_for_day_program, period_0812_id: a}}
                    if (b != ""){ data_for_day_program = {...data_for_day_program, period_1317_id: b}}
                    if (c != ""){ data_for_day_program = {...data_for_day_program, period_1721_id: c}}
                    return data_for_day_program
                }

                data_for_day_program = CheckEmpty(arr[t], arr[t + 1], arr[t + 2])

                var res = await ActionCreate(data_for_day_program, SchemaCreateEditDayProgram, protocol + DayProgramUrl)                
                if (res && res.id && index == Days.length - 1){
                    console.log(101, res);
                    redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/selectdate?created="SUCCESSFULLY`);
                }
            }
        }
    }

    return <form action={SubmitCreate} className='dark:text-white flex flex-col gap-4 text-black'>

        <div className='flex flex-row gap-4 justify-between'>
            <div className='py-2'>
                <select 
                    className='px-6 py-2 text-xl'
                    name="year_week"
                >
                    <option value={''}>--------------</option>
                    {weekRange && weekRange.map((item: {weekNo: number, week: string[]}) => <option key={item.weekNo} value={item.weekNo}>{item.week[0].slice(0, 16)} - {item.week[1].slice(0, 16)}</option>)}
                </select>
            </div>
            <div>Selet a Date For the Time Table</div>
        </div>

        <div className="bg-bluedash dark:border-strokedark grid-cols-4 hidden md:grid md:grid-cols-10 py-2 text-lg text-white tracking-wider">
            <div className="items-center justify-center md:flex">
                <span className="font-medium">DAY</span>
            </div>
            <div className="col-span-3 items-center justify-center md:flex">
                <span className="font-medium">08 - 12</span>
            </div>
            <div className="col-span-3 items-center justify-center md:flex">
                <span className="font-medium">13 - 17</span>
            </div>
            <div className="col-span-3 items-center justify-center md:flex">
                <span className="font-medium">17 - 21</span>
            </div>
        </div>

        {courses && Days.map((actual: { id: number, day: string }) => (
            <div key={actual.id} className="dark:border-strokedark grid-cols-4 md:gap-4 md:grid md:grid-cols-10 odd:bg-blue-200 py-2 text-lg tracking-wider">
                <div className="items-center justify-center md:flex">
                    <span className="font-medium">{actual.day}</span>
                </div>
                <div className="col-span-3 items-center justify-center md:flex">
                    <SearchSelect
                        name={`${actual.day}_period_0812_id`}
                        className="flex items-center justify-center w-full"
                        data={courses}
                    />
                </div>
                <div className="col-span-3 items-center justify-center md:flex">
                    <SearchSelect
                        name={`${actual.day}_period_1317_id`}
                        className="flex items-center justify-center w-full"
                        data={courses}
                    />
                </div>
                <div className="col-span-3 items-center justify-center md:flex">
                    <SearchSelect
                        name={`${actual.day}_period_1721_id`}
                        className="flex items-center justify-center w-full"
                        data={courses}
                    />
                </div>
            </div>
        ))}

        <div className='flex items-center justify-center mt-10'>
            <button type='submit' className='bg-bluedash font-medium px-6 py-2 rounded text-white text-xl'>Submit</button>
        </div>

    </form>

}

export default CreateTimeTable