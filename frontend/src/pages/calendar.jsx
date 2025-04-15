
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../Styling/calendar.css"
import TaskServices from "../services/TaskServices";
import TaskOperationForm from "../components/TaskOperationForm";
import CalendarComponent from "../components/CalendarComponent";
import TaskDisplay from "../components/TaskDisplay";
import DeleteEvent from "../components/DeleteEvent";

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
        <CalendarComponent Tasks={Tasks} onEventClick={onEventClick} dropDate={dropDate} onResize={onResize} handleDateClick={handleDateClick}/>
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
          <TaskDisplay setEventSelect={setEventSelect} setOpenEditModal={setOpenEditModal} eventSelect={eventSelect} setOpenDeleteModal={setOpenDeleteModal} setOpenTaskModal={setOpenTaskModal}/>
        </Modal>
      )}
      {openDeleteModal && eventSelect && (
        <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Task?">
          <DeleteEvent deleteTask={deleteTask} eventSelect={eventSelect} deleteRepeat={deleteRepeat} setDeleteRepeat={setDeleteRepeat} setOpenDeleteModal={setOpenDeleteModal}/>
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
