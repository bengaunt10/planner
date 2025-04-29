
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
  const [clickedStartTime, setClickedStartTime] = useState("");

  const Token = localStorage.getItem("access");

  const fetchTasks = async () => {
    const response = await TaskServices.fetchTasks(Token);
    if (response) {
      setTasks(response);
    } else {
      console.error("Tasks can't be fetched");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async () => {
    const response = await TaskServices.deleteTask(taskSelected.id, Token, deleteRepeat);
    if(response){
      setOpenDeleteModal(false);
      setOpenTaskModal(false);
      setTaskSelected(null);
      fetchTasks();
    }else{
      console.error("There was an error when deleting the task!");
    }
  };

  const addTask = async (taskData) => {
    const response = await TaskServices.addTask(taskData, Token);
    if (response) {
      setOpenAddModal(false);
      setClickedStartTime("");
      fetchTasks();
    } else {
      console.error("Error when adding task!")
    }

  };

  const editTask = async (taskData) => {
    const response = await TaskServices.editTask(taskSelected.id, Token, taskData);
    if(response) {
      setOpenEditModal(false)
      setOpenTaskModal(false)
      setTaskSelected(null)
      fetchTasks();
    }
    else {
      console.error("Error when editing the task!")
    }
  };

  const handleDateClick = (arg) => {
    setClickedStartTime(arg.dateStr);
    setOpenAddModal(true);
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
    const eventMovedEnd = info.event.end.toISOString();
    const eventMoved = Tasks.find(

      (task) => String(task.id) === String(eventMovedId)
    );

    const edittedTask = {
      ...eventMoved,
      start_time: eventMovedStart,
    };
    await TaskServices.editTask(eventMovedId, Token, edittedTask);
    const now = new Date().toISOString();
    if (eventMovedEnd < now) {
      info.el.style.backgroundColor = "#6c757d"; 
    } else {
      info.el.style.backgroundColor = "rgb(95, 151, 123)"; 
    }
    fetchTasks();
  };

  const onResize = async (info) => {
    const eventResizedId = info.event.id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    const duration = (newEndTime - newStartTime) / 3600000;
    const eventResized = Tasks.find( (task) => String(task.id) === String(eventResizedId) );
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
        <CalendarComponent Tasks={Tasks} onEventClick={onEventClick} dropDate={dropDate} onResize={onResize} handleDateClick={handleDateClick} setOpenAddModal={setOpenAddModal}/>
      </div>

      {openAddModal && (
        <Modal onClose={() => {setOpenAddModal(false); setClickedStartTime("")}} title="Add Task">
          <TaskOperationForm onSubmit={addTask} start={clickedStartTime} /> 
        </Modal>
      )}

      {openTaskModal && (
        <Modal onClose={() => { setOpenTaskModal(false); setTaskSelected(null); }} title="Task Details">
          <TaskDisplay taskSelected={taskSelected} setTaskSelected={setTaskSelected} setOpenEditModal={setOpenEditModal} setOpenDeleteModal={setOpenDeleteModal} setOpenTaskModal={setOpenTaskModal}/>
        </Modal>
      )}
      {openDeleteModal && taskSelected && (
        <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Task?">
          <DeleteEvent deleteTask={deleteTask} taskSelected={taskSelected} deleteRepeat={deleteRepeat} setDeleteRepeat={setDeleteRepeat} setOpenDeleteModal={setOpenDeleteModal}/>
        </Modal>

    
      )}
      {openEditModal && taskSelected && (
        <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
          <TaskOperationForm onSubmit={editTask} passedData={taskSelected} editForm={true}/>
      </Modal>


      )}
    </>
  );
}

export default Calendar;
