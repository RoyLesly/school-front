import { Days } from '@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageBatchOperation/pageTimeTable/[specialty_id]/CreateTimeTableForm'
import FormModal from '@/componentsTwo/FormModal'
import { GetTimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter'
import { getStartEndOfWeek } from '@/functions'
import React from 'react'
import { FaEdit } from 'react-icons/fa'

const MobileView = ({ apiSpecialty, data, yearweek, params }: any) => {

    return (
        <div className='bg-white flex-col gap-10 md:hidden text-black'>
            <div className='bg-black border flex font-semibold gap-4 h h-full items-center justify-center p-3 text-[18px] text-white tracking-widest w-full'>
                <span>{apiSpecialty.main_specialty__specialty_name}</span>
                <span>{apiSpecialty.academic_year}</span>
                <span>{apiSpecialty.level__level}</span>
            </div>
            {
                [...new Set(yearweek)].map((week: any) => <div key={week} className='bg-blue-800 gap-10 mb-10 p-2 rounded'>
                    {/* <h1 className='text-center w-full'>{week} {getStartEndOfWeek(week, new Date().getFullYear())}</h1> */}
                    <h1 className='font-semibold text-center text-white tracking-widest w-full'>{getStartEndOfWeek(week.slice(2, 4), new Date().getFullYear(), "join")}</h1>
                    {Days.map((day: string) => <div key={day} className='bg-blue-100 my-2 p-1 rounded'>
                        <h1 className='font-medium text-center tracking-widest'>{day}</h1>

                        {data.filter((item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day).map(
                            (item: GetTimeSlotInter) => <div key={item.id} className='bg-white flex items-center justify-between my-1 p-1 rounded w-full'>
                                <span className='text-sm w-[17%]'>D-{item.start.slice(8, 10)} {item.start.slice(11, 16)}</span>
                                <span className={`${item.status == "CHECKED-IN" ? "bg-teal-200": item.status == "CHECKED-OUT" ? "bg-green-300" : ""} px-1 rounded font-medium italic w-[83%]`}>{item.title}</span>
                            </div>
                        )}
                    </div>)
                    }
                </div>)
            }
        </div>
    )
}

export default MobileView