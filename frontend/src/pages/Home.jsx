/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../Styling/home.css"
import { Link } from "react-router-dom";
import TaskServices from "../services/TaskServices";
import TaskOperationForm from "../components/TaskOperationForm";
import DeleteEvent from "../components/DeleteEvent";
import NextTask from "../components/NextTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus,faStopwatch, faHandHoldingHeart, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import GratitudeForm from "../components/GratitudeForm";
import GratitudeServices from "../services/GratitudeServices";
import HelpGuide from "../components/HelpGuide";

function Home() {
  const [Tasks, setTasks] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [openAddGratitude, setOpenAddGratitude] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState(null);
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
    
    await TaskServices.editTask(taskSelected.id, Token, taskData);
    fetchTasks();
    setOpenEditModal(false);
    setTaskSelected(null);
  };

  const addGratitude = async (gratitudeData) => {
    try {
      await GratitudeServices.add_gratitudes(gratitudeData, Token);
    }catch (error){
      console.error("Error adding task:", error);
    }
    setOpenAddGratitude(false);
  }

  return (
    <div className="homePage">
      <Navbar />
       <button className="HelpButton btn" onClick={() => {setOpenHelpModal(true);}}><FontAwesomeIcon icon={faCircleQuestion} /></button>   
      <h1 className="homeTitle">{username}'s Dashboard</h1>
      <div className="HomeBoxContainer">
        
        <div className="sideBar">
        <h2 className="dashDate">{currentDate}</h2>
          <h2 className="dashTime">{currentTime}</h2>
        </div>
        <div className="HomeBox">
          <h2 className="HomeBoxTitle">Next Task:</h2>
          <NextTask Tasks={Tasks} setOpenDeleteModal={setOpenDeleteModal} setTaskToDelete={setTaskToDelete} setOpenEditModal={setOpenEditModal} setTaskSelected={setTaskSelected}/>
        </div>
      </div>

        <div className="buttonHolders">
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
          <FontAwesomeIcon icon={faSquarePlus} />
          
          </button>
          <Link className="btn btn-primary homeButton" to="/study"> <FontAwesomeIcon icon={faStopwatch} /></Link> 

          <button className="btn btn-primary homeButton" onClick={() => setOpenAddGratitude(true)}>
          <FontAwesomeIcon icon={faHandHoldingHeart} />
          </button>
        </div>
        <p className="homeQuote">
          “Take each day as it comes, keep balanced and stay calm. You've got this!”
        </p>

        {openAddModal && (
        <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
          <TaskOperationForm onSubmit={addTask}  />
        </Modal>
        )}

        {openDeleteModal && taskToDelete && (
          <Modal onClose={() => setOpenDeleteModal(false)}>
            <h3>You are about to delete this task! Are you sure you want to do this?</h3>
            <DeleteEvent deleteTask={deleteTask} taskSelected={taskToDelete} deleteRepeat={deleteRepeat} setDeleteRepeat={setDeleteRepeat} setOpenDeleteModal={setOpenDeleteModal}/>
          </Modal>
        )}
        {openEditModal && taskSelected && (
          <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
            <TaskOperationForm onSubmit={editTask} passedData={taskSelected} editForm={true}/>
          </Modal>
      )}
        {openAddGratitude && (
          <Modal onClose={() => setOpenAddGratitude(false)} title="Add Entry">
            <GratitudeForm onSubmit={addGratitude} />
          </Modal>
      )}
      {openHelpModal && (
        <HelpGuide onClose={() => setOpenHelpModal(false)} > </HelpGuide>
      )}
    </div>
  );
}

export default Home;
