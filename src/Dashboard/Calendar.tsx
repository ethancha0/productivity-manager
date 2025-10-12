import {useRef, useState} from "react";

const API = import.meta.env.VITE_API_BASE;

// Calendar.tsx
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMemo } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from '@fullcalendar/core'
import iCalendarPlugin from '@fullcalendar/icalendar'
import '../index.css'

const API = import.meta.env.VITE_API_BASE;

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
  const[draftTime, setDraftTime] = useState("");

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
    //POST server request 
    async function sendPopupData(){
      try{
        const res = await fetch(`${API}/submit_new_event`,{
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          credentials: "include",
          body: JSON.stringify({draftDate, draftDescription, draftTitle, draftTime})
        });

        const data = await res.json(); // read server response
        console.log("saved: ", data)

        //hide popup
        setShowPopup(false);

        //add Event to front end for instant appearance (temp storage)
        cal.addEvent({
        title: draftTitle,
        start: draftDate,
        allDay: !draftTime,
        })
        //clear out drafts 
        setDraftDate("");
        setDraftDescription("");
        setDraftTitle("");
        setDraftTime("");
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
  
        ref={calRef} // ref is way to hold a pointer to something 
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

      
       
        //events = {events}
        events={{url: `${API}/api/test-ics`, format: 'ics'}}
    
      />
  
      <h1></h1>
      
      {showPopup &&(

        <form onSubmit={handlePopupSubmit}  className="border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 
        shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
        rounded-3xl p-8 m-32
        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
        transition">

          <button onClick = {() => (showPopup = false)} className={"flex"}>X</button>
          <input
            type="text"
            placeholder="Title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          ></input>

          <input
            type="text"
            placeholder="Description (optional)"
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
          ></input>

            <input
            className={""}
            type="text"
            placeholder="Date"
            value ={draftDate}
            onChange={(e) => setDraftDate(e.target.value)}
           ></input>


          <input
            type="text"
            placeholder="Time (leave blank if all-day)"
            value={draftTime}
            onChange={(e) => setDraftTime(e.target.value)}
          ></input>

          <button type="submit">
              Submit
           </button>

         </form>
)}



      
      {/* You can trigger it from a button too */}
      <button onClick={() => recount()}>Recount</button>

    </div>
  )
}
