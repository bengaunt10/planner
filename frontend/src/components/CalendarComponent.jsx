/* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../Styling/calendar.css";
function CalendarComponent({Tasks, onResize, onEventClick, dropDate, handleDateClick, setOpenAddModal}) {


  return (
    <FullCalendar
    plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
    dateClick={handleDateClick}
    initialView="timeGridDay"

    themeSystem="standard"
    timeZone="local"
    editable={true} 
    droppable={true} 
    weekends={true}
    allDaySlot={false}
    slotDuration={"00:30:00"} 
    scrollTime={"06:00:00"}
    customButtons={{
      addTask: {
      text: "+ Add Task",
      click: () => {setOpenAddModal(true);},
      },
    }}
    eventDidMount={(info) => {
      const now = new Date();
      const eventStart = new Date(info.event.start);
      if (eventStart < now) {
        info.el.style.backgroundColor = "#6c757d"; 
      }
    }}
    // eventAllow={(dropInfo, draggedEvent) => {
    //   const eventStart = new Date(draggedEvent.start);
    //   const now = new Date();
    
    //   return eventStart >= now;
    // }}
    
    height={window.innerHeight * 0.88}
    nowIndicator={true}
    headerToolbar={{
      left: "prev,next today addTask",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    }}
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