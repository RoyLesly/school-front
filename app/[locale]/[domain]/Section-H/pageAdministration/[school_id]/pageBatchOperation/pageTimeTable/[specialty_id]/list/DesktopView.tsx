import { Days } from '@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageBatchOperation/pageTimeTable/[specialty_id]/CreateTimeTableForm'
import FormModal from '@/componentsTwo/FormModal'
import { protocol } from '@/config'
import { GetCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetTimeSlotInter, TimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter'
import { getData, getStartEndOfWeek } from '@/functions'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'

const DesktopView = ({ apiSpecialty, apiCourses, data, yearweek, params }: any) => {

    return (
        <div className='bg-white hidden md:flex md:flex-col text-black'>

            <div className='bg-black border flex items-center w-full'>
                <div className='flex font-semibold gap-4 h h-full justify-center p-3 text-[18px] text-white tracking-widest w-[88%]'>
                    <span>{apiSpecialty.main_specialty__specialty_name}</span>
                    <span>{apiSpecialty.academic_year}</span>
                    <span>{apiSpecialty.level__level}</span>
                </div>
                <div className='w-[12%]'>
                    <span className='flex'>
                        <FormModal table="timetable_select_month" type="update" params={params} data={apiSpecialty} icon={<FaPlus />} />
                    </span>
                </div>
            </div>
            {
                [...new Set(yearweek)].map((week: any) => <div key={week} className='bg-blue-800 gap-10 mb-10 p-2 rounded'>
                    <div className='flex font-semibold gap-10 justif text-bg-center text-lg text-white tracking-widest w-full'>
                        {getStartEndOfWeek(week.slice(2, 4), new Date().getFullYear(), "join")}
                    </div>
                    {Days.map((day: string) => <div key={day} className='bg-blue-100 flex flex-row gap-2 items-center my-2 p-1 rounded'>
                        <div className='flex flex-col font-bold text-[16px] text-center tracking-widest w-[15%]'>
                            <span>{day}</span>
                            <div className='flex items-center justify-center'>
                                <FormModal
                                    table="timetable_edit_timeslot_form"
                                    type="update" params={params} data={data.filter((item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day)}
                                    icon={<FaEdit size={20}  />}
                                    extra_data={{ 
                                        day: day, week: getStartEndOfWeek(week.slice(2, 4), 
                                        new Date().getFullYear(), "join"), 
                                        apiCourses: apiCourses,
                                        slots: data.filter(
                                            (item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day).map(
                                                (slot: TimeSlotInter) => { return { ...slot, time: `${new Date(slot.start).getHours()}H-${new Date(slot.end).getHours()}H` }}) 
                                    }}
                                />
                            </div>
                        </div>
                        <div className='font-medium text-[14px] text-center tracking-widest w-[85%]'>
                            {data.filter((item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day).map(
                                (item: GetTimeSlotInter) => <div key={item.id} className='bg-slate-100 border col-span-3 flex my-1 px-2 py-1 rounded w-full'>
                                    <span className='p-1 text-[14px] w-[16%]'>Day-{item.start.slice(8, 10)} {item.start.slice(11, 13)}H-{parseInt(item.start.slice(11, 13)) + 2}H</span>
                                    <span className={`${item.status == "CHECKED-IN" ? "bg-yellow-700 text-white" : item.status == "CHECKED-OUT" ? "bg-green-700 text-white" : "bg-white"} px-1 text-[15px] p-1 rounded font-medium italic w-[84%]`}>{item.title}</span>
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