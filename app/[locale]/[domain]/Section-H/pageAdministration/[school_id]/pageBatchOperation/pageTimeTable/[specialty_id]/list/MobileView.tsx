import { Days } from '@/[locale]/[domain]/Section-H/pageAdministration/[school_id]/pageBatchOperation/pageTimeTable/[specialty_id]/CreateTimeTableForm'
import FormModal from '@/componentsTwo/FormModal'
import { GetTimeSlotInter } from '@/Domain/Utils-H/timeControl/timeInter'
import { getStartEndOfWeek } from '@/functions'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'

const MobileView = ({ apiSpecialty, data, yearweek, params }: any) => {

    return (
        <div className='bg-white flex-col gap-10 md:hidden text-black'>
            <div className='bg-black border flex items-center w-full'>
                <div className='flex font-semibold gap-2 h h-full justify-center p-3 text-[16px] text-white tracking-widest w-[88%]'>
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
                [...new Set(yearweek)].map((week: any) => <div key={week} className='bg-blue-950 gap-10 mb-10 p-2 rounded'>
                    {/* <h1 className='text-center w-full'>{week} {getStartEndOfWeek(week, new Date().getFullYear())}</h1> */}
                    <h1 className='font-semibold text-center text-white tracking-widest w-full'>{getStartEndOfWeek(week.slice(2, 4), new Date().getFullYear(), "join")}</h1>
                    {Days.map((day: string) => <div key={day} className='bg-slate-400 my-2 p-1 rounded'>
                        <h1 className='font-medium text-center tracking-widest'>{day}</h1>

                        {data.filter((item: GetTimeSlotInter) => item.timetableday__timetableweek__year_week == week && item.timetableday__day == day).map(
                            (item: GetTimeSlotInter) => <div key={item.id} className={` bg-slate-100 flex gap-1 items-center justify-between my-1 pr-2 pl-1 rounded w-full`}>
                                <span className='p-1 text-sm w-[16%]'>D-{item.start.slice(8, 10)} {item.start.slice(11, 13)}-{parseInt(item.start.slice(11, 13)) + 2}</span>
                                <span className={`${item.status == "CHECKED-IN" ? "bg-yellow-700 text-white": item.status == "CHECKED-OUT" ? "bg-green-700 text-white" : "bg-white"} p-1 rounded font-medium italic w-[84%]`}>{item.title}</span>
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