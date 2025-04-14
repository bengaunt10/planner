/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
//crud operations into components? Cos they being reused across. like post for example
import Navbar from "../components/Navbar";
import "../Styling/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const [scheduleForMe, setScheduleForMe] = useState(false);
  const [dueDate, setDueDate] = useState("");
  // const [newFixed, setNewFixed] = useState(false);
  const [newRepeat, setNewRepeat] = useState("none");
  const [eventSelect, setEventSelect] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const Token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "Guest";
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'}));
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-us", {month: 'long', day: 'numeric'}));

  //copiloted.
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'}));
      setCurrentDate(new Date().toLocaleDateString("en-us", {month: 'long', day: 'numeric'}));
    }, 1000);
    return () => clearInterval(interval);


  }, []);

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
    if (!scheduleForMe && newStartTime < currentTime) {
      alert("Start time cannot be before current time");
      return;
    }
    // if(newEndTime < newStartTime){
    //   alert("End time cannot be before start time")
    //   return
    // }
    e.preventDefault();
    setOpenAddModal(false);
    const newTask = {
      name: newName,
      description: newDescription,
      duration: newDuration,
      start_time: scheduleForMe ? null : newStartTime,
      // end_time: newEndTime,
      // fixed: newFixed,
      repeat: newRepeat || "none",
      schedule: scheduleForMe,
      due_date: !scheduleForMe ? null : dueDate
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
        // setNewEndTime("")
        setNewRepeat("none");
        // setNewFixed(false);
        console.log("task added successfully");
        setScheduleForMe(false);
        setDueDate("");
        fetchTasks();
        setOpenAddModal(false);
      } else {
        const data = await response.json();
        if (data.OVERLAP) {
          alert(data.OVERLAP); // Show the overlap alert
        }
      }
    } catch (error) {
      console.error("Error posting task:", error);
    }
  };

  const editTask = async (e, task = null) => {
    if (e) {
      e.preventDefault(); // Only call preventDefault if e exists
    }
    const taskToUpdate = task || eventSelect;
    const currentTime = new Date().toISOString().substring(0, 16);
    if (taskToUpdate.start_time < currentTime) {
      alert("Start time cannot be before current time");
      return;
    }

    setOpenEditModal(false);
    const editedTask = {
      name: taskToUpdate.name,
      description: taskToUpdate.description,
      duration: taskToUpdate.duration,
      start_time: taskToUpdate.start_time,
      // fixed: taskToUpdate.fixed,
      repeat: taskToUpdate.repeat,
    };
    try {
      const response = await fetch(`${baseUrl}/edit/${taskToUpdate.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(editedTask),
      });
      if (response.ok) {
        fetchTasks();

        setOpenEditModal(false);
      } else {
        fetchTasks();
        const data = await response.json();
        if (data.OVERLAP) {
          alert(data.OVERLAP); // Show the overlap alert
        }
        fetchTasks();
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
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
  //copilot helped here
  // const individualTasks = Tasks.filter(task => task.repeat !== "duplicate"); This sets so only one appears - but that is only the original. once original deleted u dont see only ONE of the duplicates
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
          <form onSubmit={addTask}>
            <div className="form-group">
              <label> Task Name: </label>
              <input className="form-control"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label> Description: </label>
              <textarea className="form-control"
                type="text"
                maxLength={500}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label> duration:</label>
              <input className="form-control"
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                min="0"
                required
              />
            </div>            
            <div className="form-group">
              <label className="form-check-label">Schedule for me?</label>
              <input className="form-check-input"
                type="checkbox"
                checked={scheduleForMe}
                onChange={(e) => setScheduleForMe(e.target.checked)}
              />
            </div>
            <br />
            {scheduleForMe && (
              <div className="form-group">
                <label>Date Due</label>
                <input className="form-control"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}
            {!scheduleForMe && (
              <div className="form-group">
                <label> Start Time:</label>
                <input className="form-control"
                  type="datetime-local"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  required
                />
              </div>
            )}
            {/* <div className="form-group">
              <label>Fixed?</label>
              <input className="form-control"
                type="checkbox"
                checked={newFixed}
                onChange={(e) => setNewFixed(e.target.checked)}
              />
            </div> */}
            <div className="form-group">
              <label>Repeat: </label>
              <select className="form-control"
                value={newRepeat}
                onChange={(e) => setNewRepeat(e.target.value)}
              >
                <option value="none">No</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>


            <button type="submit" className="btn btn-success">Add Task</button>
          </form>
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
          <div>
            <form onSubmit={editTask}>
              <div className="form-group">
                <label> Task Name: </label>
                <input className="form-control"
                  type="text"
                  value={eventSelect.name}
                  onChange={(e) =>
                    setEventSelect({ ...eventSelect, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label> Description: </label>
                <input className="form-control"
                  type="text"
                  value={eventSelect.description}
                  onChange={(e) =>
                    setEventSelect({
                      ...eventSelect,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label> duration:</label>
                <input className="form-control"
                  type="number"
                  value={eventSelect.duration}
                  onChange={(e) =>
                    setEventSelect({ ...eventSelect, duration: e.target.value })
                  }
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label> Start Time:</label>
                <input className="form-control"
                  type="datetime-local"
                  value={eventSelect.start_time.toString().substring(0, 16)}
                  onChange={(e) =>
                    setEventSelect({ ...eventSelect, start_time: e.target.value })
                  }
                  required
                />
              </div>
              {/* <div className="form-group"> */}
                {/* <label>Fixed?</label>
                <input
                  type="checkbox"
                  checked={eventSelect.fixed}
                  onChange={(e) =>
                    setEventSelect({ ...eventSelect, fixed: e.target.checked })
                  }
                />
              </div> */}

              <button className="btn btn-success" type="submit">
                Update
              </button>
            </form>
          </div>

        </Modal>
      )}
    </div>
  );
}

export default Home;
