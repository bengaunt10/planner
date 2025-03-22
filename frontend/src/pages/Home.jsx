/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
//crud operations into components? Cos they being reused across. like post for example
import Navbar from "../components/Navbar";
import "../Styling/home.css"
function Home() {
  const [Tasks, setTasks] = useState([]);
  // const[OpenModal, SetOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState(0);
  const [newStartTime, setNewStartTime] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); //make a delete modal. option to delete all repeating tasks. send option through request body. if option is yes, delete all with same repeating_id. Gonna want to change the view aswell so that the first task created takes the same repeating_id as the rest of the tasks created.default = id?
  // const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [newFixed, setNewFixed] = useState(false);
  const [newRepeat, setNewRepeat] = useState("none");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const Token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "Guest";

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${baseUrl}/retrieve`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        method: "GET",
      });
      if (response.ok) {
        let data = await response.json();
        setTasks(data);
      } else {
        console.error("failed to fetch data", response.status);
      }
    } catch (error) {
      console.error("error fetching tasks", error);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await fetch(`${baseUrl}/delete/${taskToDelete.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ deleteRepeat }),
      });
      if (response.ok) {
        console.log("task deleted");
        setOpenDeleteModal(false);
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    const currentTime = new Date().toISOString().substring(0, 16);
    if (newStartTime < currentTime) {
      alert("Start time cannot be before current time");
      return;
    }
    e.preventDefault();
    setOpenAddModal(false);
    const newTask = {
      name: newName,
      description: newDescription,
      duration: newDuration,
      start_time: newStartTime,
      fixed: newFixed,
      repeat: newRepeat,
    };
    try {
      const response = await fetch(`${baseUrl}/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setNewDescription("");
        setNewName("");
        setNewDuration(0);
        setNewStartTime("");
        setNewRepeat("");
        setNewFixed(false);
        console.log("task added successfully");
        fetchTasks();
        setOpenAddModal(false);
      } else {
        console.error("Error: failed to add new task");
      }
    } catch (error) {
      console.error("Error posting task:", error);
    }
  };

  // const individualTasks = Tasks.filter(task => task.repeat !== "duplicate"); This sets so only one appears - but that is only the original. once original deleted u dont see only ONE of the duplicates

  const TaskList = Tasks.map((task) => (
    <li key={task.id}>
      <p>{task.id}</p>
      <p>{task.name}</p>
      <p>{task.description}</p>
      <p>{task.duration}</p>
      <p>{task.created}</p>
      <p>{new Date(task.start_time).toLocaleString("en-us")}</p> 
      <p>{new Date(task.end_time).toLocaleString("en-us")}</p>
      <button
        className="btn btn-danger"
        onClick={() => {
          setOpenDeleteModal(true);
          setTaskToDelete(task);
        }}
      >
        {" "}
        X
      </button>
    </li>
  ));

  return (
    <div className="homePage">
      <Navbar />
      

      {/* <div className="HomeBoxTop">
        <h4>Tasks</h4>
        
      </div> */}
      <div className="HomeBox">
        <h2>Task</h2>
        <ul>{TaskList}</ul>
        </div>
        <h1 className="homeTitle">{username}'s<br /> Dashboard</h1>
        <div className="buttonHolders">
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
            Add task
          </button>          
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
            Focus
          </button>      
          <button className="btn btn-primary homeButton" onClick={() => setOpenAddModal(true)}>
            Button
          </button>      
        </div>
        <p className="homeQuote">
          {/* motiavtional quote api to randomly shuffle a new quote every time the page is refreshed */}
          “We generate fears while we do nothing. We overcome these fears by taking action.”
        </p>

        {/* <button type="button" className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Launch demo modal
          </button> */}

        {openAddModal && (
          <Modal onClose={() => setOpenAddModal(false)}>
            {/* My adding new task form - Children to be passed into component   */}
            <h2> Add a new task</h2>
            <form onSubmit={addTask}>
              <label> Task Name: </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <label> Description: </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              />
              <label> duration:</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                min="0"
                required
              />
              <label> Start Time:</label>
              <input
                type="datetime-local"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                required
              />
              <label>Fixed?</label>
              <input
                type="checkbox"
                checked={newFixed}
                onChange={(e) => setNewFixed(e.target.checked)}
              />
              <label>Repeat: </label>
              <select
                value={newRepeat}
                onChange={(e) => setNewRepeat(e.target.value)}
              >
                <option value="none">No</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>

              <button type="submit">POST</button>
            </form>
          </Modal>
        )}

        {openDeleteModal && taskToDelete && (
          <Modal onClose={() => setOpenDeleteModal(false)}>
            <h2>Are you sure you want to delete this task?</h2>
            {taskToDelete.repeat !== "none" && (
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
              onClick={() => setOpenDeleteModal(false)}
            >
              {" "}
              No
            </button>
          </Modal>
        )}
      
    </div>
  );
}

export default Home;
