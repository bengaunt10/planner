import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick


function calendar() {
  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }
  return (
    <>
    
    <FullCalendar 
      plugins={[ dayGridPlugin,  interactionPlugin ]}
      dateClick={handleDateClick}
      initialView="dayGridMonth"
      editable={true} // Enables drag-and-drop functionality
      droppable={true} // Enables the ability to drag events
      weekends={false}
      //here I will get it to loop through my events in my database and display all. handleevent change function when i drop it down. does a PUT to backend. reload the state change.
      events={[
        { title: 'event 1', date: '2025-02-06' },
        { title: 'event 2', date: '2025-02-07' }
      ]}
    />
    
    </>
  )
}

export default calendar