'use client';
import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
// import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import listPlugin from '@fullcalendar/list' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import { EventInput } from '@fullcalendar/core/index.js';

const MyCalendar = ({ apiTimeSlots }: { apiTimeSlots: EventInput[] }) => {


    const dateClick = (info: any) => {
        console.log("date click", info)
    }

    const eventClick = (info: any) => {
        console.log("Event click", info)
    }


    return <div className='w-full'>
        <FullCalendar
            plugins={[listPlugin]}
            initialView="listWeek"
            events={apiTimeSlots}
            duration={6}
            dateClick={dateClick}
            eventClick={eventClick}
            headerToolbar={{
                left: "prev,next",
                center: "",
                right: "title"
            }}
            height={600}
            firstDay={1}
            titleFormat = {{ // will produce something like "Tuesday, September 18, 2018"
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }}
        />
    </div>
}

export default MyCalendar