import { Days } from '@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageBatchOperation/pageTimeTable/[specialty_id]/CreateTimeTableForm'
import FormModal from '@/componentsTwo/FormModal'
import { GetTimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter'
import { getStartEndOfWeek } from '@/functions'
import React from 'react'
import { FaEdit } from 'react-icons/fa'

const DesktopView = ({ selectedDate, data, yearweek, params }: any) => {

    return (
        <div className='bg-white flex-col gap-10 hidden md:flex text-black'>
            {
                [...new Set(yearweek)].map((week: any) => <div key={week} className='bg-blue-800 gap-10 mb-10 p-2 rounded'>
                    {/* <h1 className='text-center w-full'>{week} {getStartEndOfWeek(week, new Date().getFullYear())}</h1> */}
                    <h1 className='font-semibold text-center text-white tracking-widest w-full'>{getStartEndOfWeek(week.slice(2, 4), new Date().getFullYear(), "join")}</h1>
                    {Days.map((day: string) => <div key={day} className='bg-blue-100 flex flex-row gap-2 items-center my-1 p-1 rounded w-full'>
                        <h1 className='font-medium text-center tracking-widest w-[25%]'>{day}</h1>

                        <div className='bg-white p-1 w-[75%]'>
                        {data.filter((item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day).map(
                            (item: GetTimeSlotInter) => <div key={item.id} className='border flex items-center justify-between p-1 rounded w-full'>
                                <span className='text-sm w-[15%]'>D-{item.start.slice(8, 10)} {item.start.slice(11, 16)}</span>
                                <span className={`${item.status == "CHECKED-IN" ? "bg-blue-300": item.status == "CHECKED-OUT" ? "bg-green-300" : ""} px-1 rounded font-medium italic w-[75%]`}>{item.title}</span>
                                <span className='flex font-medium italic justify-center w-[10%]'><FormModal table='timetable_clock_in_form' type='update' params={params} data={item} icon={<FaEdit />} /></span>
                            </div>
                        )}
                        </div>
                    </div>)
                    }
                </div>)
            }
        </div>
    )
}

export default DesktopView