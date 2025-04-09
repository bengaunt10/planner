import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../Styling/calendar.css"

function Calendar() {
  const [Tasks, setTasks] = useState([]);
  // const[OpenModal, SetOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState(0);
  const [newStartTime, setNewStartTime] = useState("");
  // const [newEndTime, setNewEndTime] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); //make a delete modal. option to delete all repeating tasks. send option through request body. if option is yes, delete all with same repeating_id. Gonna want to change the view aswell so that the first task created takes the same repeating_id as the rest of the tasks created.default = id?
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [eventSelect, setEventSelect] = useState(null);
  const [scheduleForMe, setScheduleForMe] = useState(false);
  const [dueDate, setDueDate] = useState("");

  // const [newFixed, setNewFixed] = useState(false);
  const [newRepeat, setNewRepeat] = useState("none");

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const Token = localStorage.getItem("access");

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
      const response = await fetch(`${baseUrl}/delete/${eventSelect.id}/`, {
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
        setOpenTaskModal(false);
        setEventSelect(null);
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
    e.preventDefault();
    setOpenAddModal(false);
    const newTask = {
      name: newName,
      description: newDescription,
      duration: newDuration,
      start_time: scheduleForMe ? null : newStartTime,
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
        setNewRepeat("none");
        setScheduleForMe(false);
        setDueDate("");
        fetchTasks();
        setOpenAddModal(false);
      } else {
        const data = await response.json();
        if (data.OVERLAP) {
          alert(data.OVERLAP); 
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
    // if(taskToUpdate.end_time < taskToUpdate.start_time){
    //   alert("End time cannot be before start time")
    //   return;
    // }

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
          alert(data.OVERLAP);
        }
        fetchTasks();
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  //camoooooon

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
    await editTask(null, edittedTask);
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
    await editTask(null, resizedTask);
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
            date: task.start_time,
            end: task.end_time,
            // end: task.end_time --> make this end: tasl.start_time + task.duration
          }))}
          eventResize={onResize}
          eventClick={onEventClick}
          eventDrop={dropDate}
        />
        <button className="btn btn-primary addTaskButtonCalendar" onClick={() => setOpenAddModal(true)}>
          Add task
        </button>

      </div>


      {/* <button type="button" className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Launch demo modal
          </button> */}

{openAddModal && (
        <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
          {/* My adding new task form - Children to be passed into component   */}
          <h2> Add a new task</h2>
          <form onSubmit={addTask}>
            <label> Task Name: </label>
            <input className="form-control"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <label> Description: </label>
            <input className="form-control"
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
            />
            <label> duration:</label>
            <input className="form-control"
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              min="0"
              required
            />            
            <label className="form-check-label">Schedule for me?</label>
            <input className="form-check-input"
              type="checkbox"
              checked={scheduleForMe}
              onChange={(e) => setScheduleForMe(e.target.checked)}
            />
            <br />
            {scheduleForMe && (
              <>
                <label>Date Due</label>
                <input className="form-control"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </>
            )}
            {!scheduleForMe && (
              <>
                <label> Start Time:</label>
                <input className="form-control"
                  type="datetime-local"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  required
                />
              </>
            )}
            {/* <label>Fixed?</label>
            <input className="form-control"
              type="checkbox"
              checked={newFixed}
              onChange={(e) => setNewFixed(e.target.checked)}
            /> */}
            <label>Repeat: </label>
            <select className="form-control"
              value={newRepeat}
              onChange={(e) => setNewRepeat(e.target.value)}
            >
              <option value="none">No</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>



            <button type="submit" className="btn btn-primary">POST</button>
          </form>
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

        //add edit modal here
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

        //add edit modal here
      )}
    </>
  );
}

export default Calendar;
