
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../Styling/calendar.css"
import TaskServices from "../services/TaskServices";
import TaskOperationForm from "../components/TaskOperationForm";
import CalendarComponent from "../components/CalendarComponent";
import TaskDisplay from "../components/TaskDisplay";
import DeleteEvent from "../components/DeleteEvent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

function Calendar() {
  const [Tasks, setTasks] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [TaskSelected, setTaskSelected] = useState(null);


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
    try {
      await TaskServices.deleteTask(TaskSelected.id, Token, deleteRepeat);
      setOpenDeleteModal(false);
    }catch(error){
      console.error("Error deleting task:", error);
    }
    setOpenTaskModal(false);
    setTaskSelected(null);
    fetchTasks();
  };

  const addTask = async (taskData) => {
    try {
    await TaskServices.addTask(taskData, Token);
    await fetchTasks();
    }catch (error){
      console.error("Error adding task:", error);
    }
    setOpenAddModal(false);
  };

  const editTask = async (taskData) => {
    
    await TaskServices.editTask(TaskSelected.id, Token, taskData);
    fetchTasks();
    setOpenEditModal(false)
    setOpenTaskModal(false)
    setTaskSelected(null)
  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const onEventClick = (info) => {
    setTaskSelected(
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
        <FontAwesomeIcon icon={faSquarePlus} /> Add task 
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
            setTaskSelected(null);
            }}
            title="Task Details"
          >
          <TaskDisplay taskSelected={TaskSelected} setTaskSelected={setTaskSelected} setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} setOpenTaskModal={setOpenTaskModal}/>
        </Modal>
      )}
      {openDeleteModal && TaskSelected && (
        <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Task?">
          <DeleteEvent deleteTask={deleteTask} taskSelected={TaskSelected} deleteRepeat={deleteRepeat} setDeleteRepeat={setDeleteRepeat} setOpenDeleteModal={setOpenDeleteModal}/>
        </Modal>

    
      )}
      {openEditModal && TaskSelected && (
        <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
          <TaskOperationForm onSubmit={editTask} passedData={TaskSelected} isEdit={true}/>
      </Modal>


      )}
    </>
  );
}

export default Calendar;
