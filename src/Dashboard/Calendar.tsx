import {useRef, useState} from "react";
import Popup from "./EventPopup.tsx"

// Calendar.tsx
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMemo } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from '@fullcalendar/core'
import iCalendarPlugin from '@fullcalendar/icalendar'
import '../index.css'


//fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';

//import '@fullcalendar/daygrid/index.css'
//import '@fullcalendar/timegrid/index.css'

/*
  Future To dos
  - use google cal plugin to preserve colors 
  

*/

export default function Dashboard() {

  const[showPopup, setShowPopup] = useState(true);
  const calRef = useRef<FullCalendar | null>(null)

  // sample events — replace with your API data
  const events = useMemo(() => [
    { id: 'a', title: 'Workout', start: '2025-10-09T10:00:00', end: '2025-10-09T11:00:00' },
    { id: 'b', title: 'Study',   start: '2025-10-10T14:30:00', end: '2025-10-10T16:00:00' },
  ], [])

  const handleDateClick = (arg: any) => {
    // only fires in all-day slots; for time slots, use select (see below)
    alert(`date clicked: ${arg.dateStr}`)
    
    setShowPopup(true)
  }

  function recount(view?: any){
    const api = calRef.current?.getApi()
    if(!api) return
    const events = api.getEvents()
    console.log("THE EVENTS:")
    console.log(events.length)
  }

  return (
    <div className="border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
    rounded-3xl p-8 m-32
    hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
    transition
    fc
  [&_.fc-timegrid-event]:!bg-sky-500/20
  [&_.fc-timegrid-event]:!border-sky-400/50
  [&_.fc-timegrid-event_.fc-event-main]:!text-slate-100
  [&_.fc-daygrid-event]:!bg-sky-500/20
  [&_.fc-daygrid-event]:!border-sky-400/50
  [&_.fc-timegrid-event_.fc-event-main]:!text-white
  [&_.fc-daygrid-event]:!text-white
  [&_.fc-daygrid-day-number]:!text-slate-200
  [&_.fc-day-today]:[--fc-today-bg-color:rgba(255,255,255,0.04)]">

      <FullCalendar 
  
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}
        datesSet={() => recount()} // calls after view/date changes
        editable="true"
        initialView="dayGridMonth"               //  the view you want
        headerToolbar={{                          // toggle views & nav
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        buttonText={{ dayGridMonth: 'Month', timeGridWeek: 'Week' }}
        
      


        
        //default event styling 
        eventColor = "#283848"
       eventBackgroundColor = "#283848"
        //eventTextColor = "black"
       // eventBorderColor = "orange"
       // eventDisplay = "block"
      


        // common timeGrid options
        slotMinTime="06:00:00"
        slotMaxTime="25:00:00"
        allDaySlot={false}
        nowIndicator={true}
        height="auto"
        
       

      

        // interaction
        dateClick={handleDateClick}
        selectable={true}
        selectMirror={true}
        select={(sel) => {
          // fires when dragging across a time range
          console.log('selected', sel.startStr, '→', sel.endStr)
          // e.g., open a modal to create an event
        }}

      
       
        //events = {events}
        events={{url: 'http://127.0.0.1:5000/api/test-ics', format: 'ics'}}
    
      />
   
      <Popup/>

      <h1></h1>

      {/* Send ics link to backend */}
      
      {/* You can trigger it from a button too */}
      <button onClick={() => recount()}>Recount</button>

    </div>
  )
}
