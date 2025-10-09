// Calendar.tsx
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMemo } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Calendar } from '@fullcalendar/core'
//import './index.css'


//import '@fullcalendar/daygrid/index.css'
//import '@fullcalendar/timegrid/index.css'




export default function Dashboard() {
  // sample events — replace with your API data
  const events = useMemo(() => [
    { id: 'a', title: 'Workout', start: '2025-10-09T10:00:00', end: '2025-10-09T11:00:00' },
    { id: 'b', title: 'Study',   start: '2025-10-10T14:30:00', end: '2025-10-10T16:00:00' },
  ], [])

  const handleDateClick = (arg: any) => {
    // only fires in all-day slots; for time slots, use select (see below)
    alert(`date clicked: ${arg.dateStr}`)
  }

  return (
    <div className = "border border-orange-500 bg-transparent rounded-2xl p-8 m-5 shadow-lg font-mono font-semibold">
      <FullCalendar
        
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"                //  the view you want
        headerToolbar={{                          // toggle views & nav
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        buttonText={{ dayGridMonth: 'Month', timeGridWeek: 'Week' }}
        
        
        //default event styling 
        eventColor = "orange"
        eventBackgroundColor = "pink"
        eventTextColor = "black"
        eventBorderColor = "orange"
        eventDisplay = "block"
      


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

        events={events} // or a fetch function / URL
      />

    </div>
  )
}
