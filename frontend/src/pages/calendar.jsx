import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { useState, useEffect } from 'react'
import Modal from '../components/Modal';


function Calendar() {
  const[Tasks, setTasks] = useState([]);
  // const[OpenModal, SetOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState(0);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); //make a delete modal. option to delete all repeating tasks. send option through request body. if option is yes, delete all with same repeating_id. Gonna want to change the view aswell so that the first task created takes the same repeating_id as the rest of the tasks created.default = id? 
   const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteRepeat, setDeleteRepeat] = useState(false);
  const [eventSelect, setEventSelect] = useState(null);


  const [newFixed, setNewFixed] = useState(false);
  const [newRepeat, setNewRepeat] = useState("none");


  const baseUrl="http://127.0.0.1:8000/api";


  const fetchTasks = async () =>{
    try {
      const response = await fetch(`${baseUrl}/drftest`, {
        method: "GET",
      });
      if(response.ok){
        let data = await response.json();
        setTasks(data)
      }else{
        console.error("failed to fetch data", response.status)
       }
     }catch(error){
       console.error("error fetching tasks", error)
     }
  }



  const deleteTask = async() => {
    try{
      const response = await fetch(`${baseUrl}/drftest/delete/${eventSelect.id}/`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({deleteRepeat})
      })
      if (response.ok){
        console.log("task deleted")
        setOpenDeleteModal(false)
        setOpenTaskModal(false)
        setEventSelect(null)
        fetchTasks()
      }else{
        console.error("Failed to delete task")
      }
    }catch(error){
      console.error("error: ", error)
    }
    }

    useEffect(() => {
      fetchTasks();
     }, []);   


  const addTask = async (e) => {
    const currentTime = new Date().toISOString().substring(0, 16)
    if(newStartTime < currentTime){
      alert("Start time cannot be before current time")
      return
    }
    if(newEndTime < newStartTime){
      alert("End time cannot be before start time")
      return
    }
    e.preventDefault();
    setOpenAddModal(false)
    const newTask = {
      name: newName,
      description: newDescription,
      duration: newDuration,
      start_time: newStartTime,
      end_time: newEndTime,
      fixed: newFixed,
      repeat: newRepeat

    }
    try {
      const response = await fetch(`${baseUrl}/drftest/add/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
      });
      if(response.ok){
        setNewDescription("")
        setNewName("")
        setNewDuration(0)
        setNewStartTime("")
        setNewEndTime("")
        setNewRepeat("")
        setNewFixed(false)
        console.log('task added successfully');
        fetchTasks();
        setOpenAddModal(false);
        
      }else{
        console.error('Error: failed to add new task');
      }
    }catch (error) {
      console.error("Error posting task:", error);
    }
  }

  const editTask = async (e) =>{
    const currentTime = new Date().toISOString().substring(0, 16)
    if(eventSelect.start_time < currentTime){
      alert("Start time cannot be before current time")
      return
    }
    if(eventSelect.end_time < eventSelect.start_time){
      alert("End time cannot be before start time")
      return
    }
    e.preventDefault();
    setOpenEditModal(false)
    const editedTask = {
      name: eventSelect.name,
      description: eventSelect.description,
      duration: eventSelect.duration,
      start_time: eventSelect.start_time,
      end_time: eventSelect.end_time,
      fixed: eventSelect.fixed,
      repeat: eventSelect.repeat,
    }
    try {
      const response = await fetch(`${baseUrl}/drftest/edit/${eventSelect.id}/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask)
      });
      if(response.ok){
        fetchTasks();
        setOpenEditModal(false);
        
      }else{
        console.error('Error: failed to edit task');
      }
    }catch (error) {
      console.error("Error editing task:", error);
    }
  }




  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }

  const onEventClick = (info) => {

    setEventSelect(Tasks.find(task => String(task.id) === String(info.event.id)))

    setOpenTaskModal(true)
  }

  return (
    <>

    <FullCalendar 
      plugins={[ timeGridPlugin,  interactionPlugin, dayGridPlugin ]}
      dateClick={handleDateClick}
      initialView="timeGridWeek"
      editable={true} // Enables drag-and-drop functionality
      droppable={true} // Enables the ability to drag events
      weekends={true}
      headerToolbar = {{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth, timeGridWeek,timeGridDay'
      }}
      //here I will get it to loop through my events in my database and display all. handleevent change function when i drop it down. does a PUT to backend. reload the state change.
      events={Tasks.map(task => ({
        id: task.id, title: task.name, date: task.start_time, end: task.end_time
      }))
      }
      eventClick={onEventClick}
    />



          <button className="btn btn-primary" onClick={() => setOpenAddModal(true)}>
            Add task
          </button>
          {/* <button type="button" className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Launch demo modal
          </button> */}

          {openAddModal && (
            <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
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
                <label> End Time:</label> 
                <input
                type="datetime-local"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
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
                  value = {newRepeat}
                  onChange={(e) => setNewRepeat(e.target.value)}

                >
                  <option value = "none">No</option>
                  <option value = "daily">Daily</option>
                  <option value = "weekly">Weekly</option>
                </select>

                <button type="submit">POST</button>              
              </form> 
            </Modal>
          )}
 
      {openTaskModal && (
            <Modal onClose={() => {setOpenTaskModal(false); setEventSelect(null)}} title = "Task Details">
              <h2>Task</h2>
                <div>
                  <label>Task Name: {eventSelect.name}</label>

                  <label>Description: {eventSelect.description}</label>

                  <label>Duration: {eventSelect.duration}</label>

                  <label>Start Time: {eventSelect.start_time}</label>

                  <label>End Time: {eventSelect.end_time}</label>
                </div>

              <button className="btn btn-danger position-absolute start-0 " onClick={() => {setOpenEditModal(true)}}> Edit</button>
              <button className="btn btn-primary position-absolute end-50" onClick={() => {setOpenTaskModal(false); setEventSelect(null)}}> Close</button>
              <button className="btn btn-danger position-absolute end-0" onClick={() => {setOpenDeleteModal(true)}}> Delete</button>
            </Modal>
          )}
          {openDeleteModal && eventSelect && (
            <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Task?">
              {eventSelect.repeat !== "none" && (
                <div>
                  <label>Do you want to delete all tasks with the same repeating_id?</label>
                  <input
                    type="checkbox"
                    value={deleteRepeat}
                    onChange={(e) => setDeleteRepeat(e.target.checked)}
                  />
                </div>
              )}
              <button className="btn btn-danger" onClick={() => deleteTask()}> Yes</button>
              <button className="btn btn-primary" onClick={() => {setOpenDeleteModal(false)}}> No</button>
            </Modal>

            //add edit modal here
          )}
          {openEditModal && eventSelect && (
            <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
                <div>
                <form onSubmit={editTask}>
                <label> Task Name: </label>
                <input
                  type="text"
                  value={eventSelect.name}
                  onChange={(e) => setEventSelect({...eventSelect, name: e.target.value})}
                  required
                />
                <label> Description: </label>
                <input
                  type="text"
                  value={eventSelect.description}
                  onChange={(e) => setEventSelect({...eventSelect, description: e.target.value})}
                  required
                />
                <label> duration:</label> 
                <input
                type="number"
                value={eventSelect.duration}
                onChange={(e) => setEventSelect({...eventSelect, duration: e.target.value})}
                min="0"
                required
                />
                <label> Start Time:</label> 
                <input
                type="datetime-local"
                value={(eventSelect.start_time).toString().substring(0, 16)}
                onChange={(e) => setEventSelect({...eventSelect, start_time: e.target.value})}
                required
                />
                <label> End Time:</label> 
                <input
                type="datetime-local"
                value={(eventSelect.end_time).toString().substring(0, 16)}
                onChange={(e) => setEventSelect({...eventSelect, end_time: e.target.value})}
                required
                />
                <label>Fixed?</label> 
                <input
                type="checkbox"
                checked={eventSelect.fixed}
                onChange={(e) => setEventSelect({...eventSelect, fixed: e.target.checked})}
                />

                <button className="btn btn-danger" type="submit">Update</button>              
              </form> 
                </div>
              <button className="btn btn-primary" onClick={() => {setOpenEditModal(false)}}> Close</button>
            </Modal>

            //add edit modal here
          )}

    </>
  )
}

export default Calendar