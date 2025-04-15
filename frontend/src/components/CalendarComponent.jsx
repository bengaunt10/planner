/* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function CalendarComponent({Tasks, onResize, onEventClick, dropDate, handleDateClick}) {
  return (
    <FullCalendar
    plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
    dateClick={handleDateClick}
    initialView="timeGridWeek"
    themeSystem="standard"
    timeZone="UTC"
    editable={true} 
    droppable={true} 
    weekends={true}
    eventDidMount={(info) => {
      const now = new Date();
      const eventStart = new Date(info.event.start);
      if (eventStart < now) {
        info.el.style.backgroundColor = "#6c757d"; 
      }
    }}
    eventAllow={(dropInfo, draggedEvent) => {
      const eventStart = new Date(draggedEvent.start);
      const now = new Date();
    
      return eventStart >= now;
    }}
    auto={true}
    height={880}
    nowIndicator={true}
    headerToolbar={{
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    }}
    //here I will get it to loop through my events in my database and display all. handleevent change function when i drop it down. does a PUT to backend. reload the state change.
    events={Tasks.map((task) => ({
      id: task.id,
      title: task.name,
      start: task.start_time,
      end: task.end_time,
     
    }))}
    eventResize={onResize}
    eventClick={onEventClick}
    eventDrop={dropDate}
  />
  )
}

export default CalendarComponent