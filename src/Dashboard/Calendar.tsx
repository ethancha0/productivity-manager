import {useRef, useState} from "react";



// Calendar.tsx
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMemo } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from '@fullcalendar/core'
import iCalendarPlugin from '@fullcalendar/icalendar'
import '../index.css'

import {API} from '../api'

//fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';

//import '@fullcalendar/daygrid/index.css'
//import '@fullcalendar/timegrid/index.css'

/*
  Future To dos
  - use google cal plugin to preserve colors 
  

*/

export default function Calandar() {

  const[showPopup, setShowPopup] = useState(false); // shows popup 

  const calRef = useRef<FullCalendar | null>(null) // ref that points to FullCalendar component instance
  const[cal, setCal] = useState<CalendarApi | null>(null); // the CalendarAPI returned from ref, (like an obj of calRef)

  const[draftDate, setDraftDate] = useState(""); // draft for event submit for popup
  const[draftDescription, setDraftDescription] = useState(""); // for popup
  const[draftTitle, setDraftTitle] = useState("");
  const[draftStartTime, setDraftStartTime] = useState(null);
  const[draftEndTime, setDraftEndTime] = useState(null);
  const[draftAllDay, setDraftAllDay] = useState(true);

  const handleDateClick = (arg: any) => {
    // only fires in all-day slots; for time slots, use select (see below)
   // alert(`date clicked: ${arg.dateStr}`)
    
    setShowPopup(true)
    const api = calRef.current.getApi(); // grabs Calendar API obj from ref 
    setCal(api);
    if(!api) return
    
    //ask user for info through popup 
    setDraftDate(arg.dateStr)
    

  }

  //FUNCTION: Send new event data to server
  function handlePopupSubmit(e){
    e.preventDefault() // prevent page refresh


    
    const pad2 = (s) => s.padStart(2, "0");

    // format start/end time
    const startISO = draftStartTime
      ? `${draftDate}T${pad2(draftStartTime)}:00` 
      : draftDate // start at date if not given time
    

     const endISO = draftEndTime
      ? `${draftDate}T${pad2(draftEndTime)}:00` 
      : null
      

    console.log("Sending",draftTitle, draftDescription, draftAllDay, startISO, endISO)

    //POST server request 
    async function sendPopupData(){
      try{
        const res = await fetch(`${API}/submit_new_event`,{
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          credentials: "include",
          body: JSON.stringify({draftTitle, draftDescription, draftAllDay, startISO, endISO})
        });

        const data = await res.json(); // read server response
        console.log("saved: ", data)

        //hide popup
        setShowPopup(false);

        //refresh calendar to show new event
        if (cal) {
          cal.refetchEvents();
        }

        //clear out drafts 
        setDraftDate("");
        setDraftDescription("");
        setDraftTitle("");
        setDraftStartTime("");
        setDraftEndTime("");
      }
      catch(err){
        console.log("error adding new event ", err)
      }
    }

    sendPopupData()

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
    rounded-3xl p-4 m-8
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
  
        ref={calRef} // ref is way to hold a pointer to something 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}
        datesSet={() => recount()} // calls after view/date changes
        editable={true}
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
        
       

      

        // interactions
        dateClick={handleDateClick}
       // dateClick={(arg) => addQuickEvent(arg.dateStr)}
        selectable={true}
        selectMirror={true}
        select={(sel) => {
          // fires when dragging across a time range
          console.log('selected', sel.startStr, '→', sel.endStr)
          // e.g., open a modal to create an event
        }}


        eventSources={[
        {
          events: async (info, successCallback, failureCallback) => {
            try {
              
              const res = await fetch(
                `${API}/api/events?start=${encodeURIComponent(info.startStr)}&end=${encodeURIComponent(info.endStr)}`,
                { method: "GET", credentials: "include" } // send session cookie
              );
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json(); // should be an array of { id, title, start, end, allDay }
              successCallback(data);
            } catch (err) {
              console.error("events fetch failed", err);
              failureCallback(err);
            }
          },
        },
        {
          url: `${API}/api/test-ics`,
          format: "ics",
          // extraFetchOptions: { credentials: "include" }, // only if your ICS endpoint requires cookies
        },
      ]}


    
      />
  
      <h1></h1>
      
      {showPopup &&(

        <form onSubmit={handlePopupSubmit}  className="border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 
        shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
        rounded-3xl p-8 m-32
        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
        transition">

          <button onClick = {() => (setShowPopup(false))} className={"flex"}>X</button>
          <input
            className="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          ></input>

          <input
            className="rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Description (optional)"
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
          ></input>

            <input
            className={"rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"}
            type="text"
            placeholder="Date"
            value ={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
           ></input>


          <input
            className={"rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"}
            type="text"
            placeholder="Start Time (blank if all-day)"
            value={draftStartTime}
            onChange={(e) => setDraftStartTime(e.target.value)}
          ></input>

         <input
            className={"rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"}
            type="text"
            placeholder="End Time (blank if all-day)"
            value={draftEndTime}
            onChange={(e) => setDraftEndTime(e.target.value)}
          ></input>


          <button type="submit">
              Submit
           </button>

         </form>
)}

      {/* You can trigger it from a button too */}
      {/* <button onClick={() => recount()}>Recount</button>*/}

    </div>
  )
}
