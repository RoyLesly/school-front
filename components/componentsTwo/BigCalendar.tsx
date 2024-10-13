"use client";

import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { format, parse, startOfWeek, getDay, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';


const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (
    date: number | Date,
    options?:
      | {
        locale?: Locale | undefined;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
      }
      | undefined
  ) => startOfWeek(date, { ...options, weekStartsOn: 1 }),
  getDay,
  locales
});


const BigCalendar = ({ data, selectedDate }: { selectedDate: any, data: any }) => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
      // <div className="hidden md:flex">
      <div className="hidden">
        <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        defaultDate={selectedDate}
        endAccessor="end"
        views={["week", "day"]}
        view={view}
        style={{ height: "100%", width: "100%", color: "black" }}
        onView={handleOnChangeView}
        onSelectEvent={(e) => { console.log(e, 70) }}
        onSelectSlot={(e) => { console.log(e, 71) }}
        onDoubleClickEvent={(e) => { console.log(e, 72) }}
        min={new Date(2024, 7, 0, 8, 0,)}
        max={new Date(2024, 7, 0, 21, 0,)}
      />
      </div>
  );
};

export default BigCalendar;




// "use client";

// import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState } from "react";
// import { calendarEvents } from "./lib/data";

// // const localizer = momentLocalizer(moment);
// const localizer = momentLocalizer(moment("2024-10-20"));

// const BigCalendar = () => {
//   const [view, setView] = useState<View>(Views.WEEK);

//   const handleOnChangeView = (selectedView: View) => {
//     setView(selectedView);
//   };

//   // console.log(localizer, 18)
//   // console.log(moment, 19)
//   console.log(moment().toDate(), 20)
//   console.log(moment().toString(), 21)
//   console.log(moment("2023-04-20").toString(), 22)
//   console.log(moment("2024-10-20").toString(), 23)
//   // console.log(new Date().toISOString(), 21)
//   // console.log(new Date(new Date("2024-09-01T08:00")), 22)

//   return (
//     <Calendar
//       localizer={localizer}
//       events={calendarEvents}
//       startAccessor="start"
//       endAccessor="end"
//       views={["week", "day"]}
//       view={view}
//       style={{ height: "100%", width: "100%", color: "black" }}
//       onView={handleOnChangeView}
//       onSelectEvent={(e)=>{console.log(e, 70)}}
//       onSelectSlot={(e)=>{console.log(e, 71)}}
//       onDoubleClickEvent={(e)=>{console.log(e, 72)}}
//       min={new Date(2024, 7, 0, 8, 0, )}
//       max={new Date(2024, 7, 0, 18, 0, 0)}
//     />
//   );
// };

// export default BigCalendar;
