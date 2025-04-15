/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
//crud operations into components? Cos they being reused across. like post for example
import Navbar from "../components/Navbar";
import "../Styling/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import TaskServices from "../services/TaskServices";
import TaskOperationForm from "../components/TaskOperationForm";

function Home() {
  const [Tasks, setTasks] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); //make a delete modal. option to delete all repeating tasks. send option through request body. if option is yes, delete all with same repeating_id. Gonna want to change the view aswell so that the first task created takes the same repeating_id as the rest of the tasks created.default = id?
  // const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [eventSelect, setEventSelect] = useState(null);

  const Token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "Guest";
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'}));
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-us", {month: 'long', day: 'numeric'}));

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'}));
      setCurrentDate(new Date().toLocaleDateString("en-us", {month: 'long', day: 'numeric'}));
    }, 1000);
    return () => clearInterval(interval);


  }, []);

  const fetchTasks = async () => {
    const response = await TaskServices.fetchTasks(Token);
    if (response) {
      setTasks(response);
    } else {
      console.error("Failed to fetch tasks");
    }
  };

  const deleteTask = async () => {
    await TaskServices.deleteTask(taskToDelete.id, Token, deleteRepeat);
    setOpenDeleteModal(false);
   
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    await TaskServices.addTask(taskData, Token);
    fetchTasks();
    setOpenAddModal(false);
  };

  const editTask = async (taskData) => {
    
    await TaskServices.editTask(eventSelect.id, Token, taskData);
    fetchTasks();
    setOpenEditModal(false);
    setEventSelect(null);
  };


  const getNextTask = () => {
    if (!Tasks) {
      return null;
    }
    const currentTime = new Date();
    const nextTasks = Tasks.filter((task) => {
      const taskTime = new Date(task.start_time);
      return taskTime > currentTime;
    });
    if (nextTasks.length === 0) {
      return null;
    }
    nextTasks.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });
    return nextTasks[0];
  }


  const nextTask = getNextTask();

  const TaskList = nextTask ? (
    <li className="nextTask"key={nextTask.id}>
      <button
        className="btn btn-primary HomeBoxButton"
        onClick={() => {
          setOpenDeleteModal(true);
          setTaskToDelete(nextTask);
        }}
      >
        Remove Task
      </button>
      {/* <p>{nextTask.id}</p> */}
      <h2 className="HomeBoxTask">{nextTask.name}</h2>
      <p className="HomeBoxDescriptionn">{nextTask.description}</p>
      {/* <p>{nextTask.duration}</p>
      <p>{nextTask.created}</p> */}
      <p className="HomeBoxTime">{new Date(nextTask.start_time).toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'})}- {new Date(nextTask.end_time).toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'})}
        <br />
        {new Date(nextTask.start_time).toLocaleDateString("en-us", {month: 'long', day: 'numeric'})}
      </p> 
      <p></p>

      <button
        className="btn btn-info HomeBoxEdit"
        onClick={() => {
          setOpenEditModal(true);
          setEventSelect(nextTask);
        }}
      >
        Edit Task<FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
      </button>
    </li>
  ): (
    <h2>No tasks. Add a new task below</h2>
  );


  return (
    <div className="homePage">
      <Navbar />

      <div className="HomeBoxContainer">
        <div className="sideBar">
        <h2 className="dashDate">{currentDate}</h2>
          <h2 className="dashTime">{currentTime}</h2>
        </div>
        <div className="HomeBox">
          <h2 className="HomeBoxTitle">NextTask</h2>
          <ul>{TaskList}</ul>  
        </div>
      </div>
        <h1 className="homeTitle">{username}'s<br /> Dashboard</h1>
        <div className="buttonHolders">
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
            Add task
          </button>          
          <Link className="btn btn-primary homeButton" to="/study"> Focus </Link>
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
            button
          </button>      
        </div>
        <p className="homeQuote">
          “We generate fears while we do nothing. We overcome these fears by taking action.”
        </p>

        {openAddModal && (
        <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
          {/* My adding new task form - Children to be passed into component   */}
          <TaskOperationForm onSubmit={addTask} />
        </Modal>
      )}

        {openDeleteModal && taskToDelete && (
          <Modal onClose={() => setOpenDeleteModal(false)}>
            <h2>Are you sure you want to delete this task?</h2>
            {taskToDelete.repeat !== "none" && (
              <div className="form-group">
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
              onClick={() => setOpenDeleteModal(false)}
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
    </div>
  );
}

export default Home;
