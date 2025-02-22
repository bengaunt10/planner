import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
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
 
  const [newFixed, setNewFixed] = useState(false);
  const [newRepeat, setNewRepeat] = useState("none");

  const baseUrl="http://127.0.0.1:8000/api";

  // const deleteTask = async(taskID) => {
  //   try{
  //     const response = await fetch(`${baseUrl}/drftest/delete/${taskID}/`, {
  //       method: "DELETE",
  //     })
  //     if (response.ok){
  //       console.log("task deleted")
  //     }else{
  //       console.error("Failed to delete task")
  //     }
  //   }catch(error){
  //     console.error("error: ", error)
  //   }
  //   }
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

    useEffect(() => {
      fetchTasks();
     }, []);   


  const addTask = async (e) => {

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





  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }
  return (
    <>

    <FullCalendar 
      plugins={[ dayGridPlugin,  interactionPlugin ]}
      dateClick={handleDateClick}
      initialView="dayGridMonth"
      editable={true} // Enables drag-and-drop functionality
      droppable={true} // Enables the ability to drag events
      weekends={true}
      //here I will get it to loop through my events in my database and display all. handleevent change function when i drop it down. does a PUT to backend. reload the state change.
      events={Tasks.map(task => ({
        title: task.name, date: task.start_time
      }))
      }
    />



          <button className="btn btn-primary" onClick={() => setOpenAddModal(true)}>
            Add task
          </button>
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
                value={newFixed}
                onChange={(e) => setNewEndTime(e.target.value)}
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

    </>
  )
}

export default Calendar