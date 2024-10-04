import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import SessionExpired from '@/section-h/common/SessionExpired'
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig'
import ListData from './ListData'
import MyCalendar from './MyCalendar'
import { GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter'
import { GetUserProfileInter } from '@/Domain/Utils-H/userControl/userInter'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { userprofile_id: string, specialty_id: string, domain: string };
  searchParams: { month: string, year: string };
}) => {

  const apiUserprofile: GetUserProfileInter[] | any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, {
    nopage: true, id: params.userprofile_id, fieldList: [
      "id", "session"
    ]
  });

  const apiTimeSlots: any = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, {
    nopage: true, timetableday__timetableweek__publish: true, course__specialty__id: params.specialty_id, session: apiUserprofile ? apiUserprofile[0].session : "Evening",
    fieldList: [
      "id", "title", "start", "end", "status", "start_time", "end_time", "timetableday__day", "timetableday__date", "timetableday__timetableweek__year_week", "timetableday__timetableweek__publish",
    ]
  });

  return (
    <div className='h-full mb-20 mt-16 mx-1 p-1 rounded text-black'>
      {searchParams && <NotificationError errorMessage={searchParams} />}

      {apiTimeSlots['unauthorized'] && <SessionExpired />}

      {apiTimeSlots && apiTimeSlots.length ? <MyCalendar apiTimeSlots={apiTimeSlots} /> : null}
      {/* {apiTimeSlots && apiTimeSlots.length ? <ListData params={params} searchParams={searchParams} apiTimeSlots={apiTimeSlots} apiSpecialty={apiSpecialty[0]} /> 
        : 
        <div className='flex font-medium items-center justify-center pt-20 text-[20px] w-full'>No Time Table Yet</div>} */}

    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "TimeTable-Class",
  description: "This is Time Table Class  Page",
};



