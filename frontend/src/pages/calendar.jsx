import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../Styling/calendar.css"
import TaskServices from "../services/TaskServices";
import TaskOperationForm from "../components/TaskOperationForm";
function Calendar() {
  const [Tasks, setTasks] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); //make a delete modal. option to delete all repeating tasks. send option through request body. if option is yes, delete all with same repeating_id. Gonna want to change the view aswell so that the first task created takes the same repeating_id as the rest of the tasks created.default = id?
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [eventSelect, setEventSelect] = useState(null);


  const Token = localStorage.getItem("access");

  const fetchTasks = async () => {
    const response = await TaskServices.fetchTasks(Token);
    if (response) {
      setTasks(response);
    } else {
      console.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async () => {
    await TaskServices.deleteTask(eventSelect.id, Token, deleteRepeat);
    setOpenDeleteModal(false);
    setOpenTaskModal(false);
    setEventSelect(null);
    fetchTasks();
  };

  const addTask = async (taskData) => {
    await TaskServices.addTask(taskData, Token);
    fetchTasks();
    setOpenAddModal(false);
  };

  const editTask = async (taskData) => {
    
    await TaskServices.editTask(eventSelect.id, Token, taskData);
    fetchTasks();
    setOpenEditModal(false);
    setOpenTaskModal(false);
    setEventSelect(null);
  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const onEventClick = (info) => {
    setEventSelect(
      Tasks.find((task) => String(task.id) === String(info.event.id))
    );

    setOpenTaskModal(true);
  };

  const dropDate = async (info) => {
    const eventMovedId = info.event.id;
    const eventMovedStart = info.event.start.toISOString();
    const eventMoved = Tasks.find(
      (task) => String(task.id) === String(eventMovedId)
    );
    const currentTime = new Date().toISOString().substring(0, 16);

    if (eventMovedStart < currentTime) {
      alert("Start time cannot be before current time");
      info.revert();
      return;
    }
    const edittedTask = {
      ...eventMoved,
      start_time: eventMovedStart,
    };
    await TaskServices.editTask(eventMovedId, Token, edittedTask);
    fetchTasks();
  };

  const onResize = async (info) => {
    const eventResizedId = info.event.id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    const duration = (newEndTime - newStartTime) / 3600000;
    const eventResized = Tasks.find(
      (task) => String(task.id) === String(eventResizedId)
    );
    const resizedTask = {
      ...eventResized,
      duration: duration,

    };
    await TaskServices.editTask(eventResizedId, Token, resizedTask);
    fetchTasks();
  };

  return (
    <>      
      <div className="cal">
        <Navbar />
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
        <button className="btn btn-primary addTaskButtonCalendar" onClick={() => setOpenAddModal(true)}>
          Add task
        </button>

      </div>



    {openAddModal && (
        <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
        
          <h2> Add a new task</h2>
          <TaskOperationForm onSubmit={addTask} /> 
        </Modal>
      )}

      {openTaskModal && (
        <Modal
          onClose={() => {
            setOpenTaskModal(false);
            setEventSelect(null);
            }}
            title="Task Details"
          >
            <h2>Task</h2>
            <div className="form-group">
            <label>Task Name: {eventSelect.name}</label>
            </div>
            <div className="form-group">
            <label>Description: {eventSelect.description}</label>
            </div>
            <div className="form-group">
            <label>Duration: {eventSelect.duration}</label>
            </div>
            <div className="form-group">
            <label>Start Time: {eventSelect.start_time}</label>
            </div>
            <div className="form-group">
            <label>End Time: {eventSelect.end_time}</label>
            </div>
            <div className="taskDisplayButtons">
            <button
            className="btn btn-warning position-absolute start-0 "
            onClick={() => {
              setOpenEditModal(true);
            }}
          >
            {" "}
            Edit
          </button>
          <button
            className="btn btn-primary position-absolute end-50"
            onClick={() => {
              setOpenTaskModal(false);
              setEventSelect(null);
            }}
          >
            {" "}
            Close
          </button>
          <button
            className="btn btn-danger position-absolute end-0"
            onClick={() => {
              setOpenDeleteModal(true);
            }}
          >
            {" "}
            Delete
          </button>
          </div>
        </Modal>
      )}
      {openDeleteModal && eventSelect && (
        <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Task?">
          {eventSelect.repeat !== "none" && (
            <div>
              <label>
                Do you want to delete all tasks with the same repeating_id?
              </label>
              <input
                type="checkbox"
                value={deleteRepeat}
                onChange={(e) => setDeleteRepeat(e.target.checked)}
              />
            </div>
          )}
          <button className="btn btn-danger" onClick={() => deleteTask()}>
            {" "}
            Yes
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          >
            {" "}
            No
          </button>
        </Modal>

    
      )}
      {openEditModal && eventSelect && (
        <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
          <TaskOperationForm onSubmit={editTask} passedData={eventSelect} isEdit={true}/>
      </Modal>


      )}
    </>
  );
}

export default Calendar;
