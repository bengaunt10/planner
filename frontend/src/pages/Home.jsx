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
          <NextTask Tasks={Tasks} setOpenDeleteModal={setOpenDeleteModal} setTaskToDelete={setTaskToDelete} setOpenEditModal={setOpenEditModal} setEventSelect={setEventSelect}/>
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
            <DeleteEvent deleteTask={deleteTask} eventSelect={taskToDelete} deleteRepeat={deleteRepeat} setDeleteRepeat={setDeleteRepeat} setOpenDeleteModal={setOpenDeleteModal}/>
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
