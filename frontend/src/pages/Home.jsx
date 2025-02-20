import { useState, useEffect } from 'react'
import Modal from '../components/Modal';

function Home() {

  const[Tasks, setTasks] = useState([]);
  // const[OpenModal, SetOpenModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState(0);
  const [openModal, setOpenModal] = useState(false);

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



  useEffect(() => {
    fetchTasks();
   }, []);    

  const addTask = async (e) => {

    e.preventDefault();
    setOpenModal(false)
    const newTask = {
      name: newName,
      description: newDescription,
      duration: newDuration,
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
        setNewDuration("")
        console.log('task added successfully');
        fetchTasks()
      }else{
        console.error('Error: failed to add new task');
      }
    }catch (error) {
      console.error("Error posting task:", error);
    }
  }


  
   
  const TaskList = Tasks.map(task =>
    <li key={task.id}>
      <p>{task.id}</p>
      <p>{task.name}</p>
      <p>{task.description}</p>
      <p>{task.duration}</p>
    </li>
  ); 

  return (
    <>
        <h1>Homepage</h1>
        <div className="HomeBoxTop">
          <h4>Tasks</h4>
        </div>
        <div className="HomeBox">
          <ul>{TaskList}</ul>
          {/* <button onClick={() => SetOpenModal(true)}>
            Add task
          </button> */}
          <button type="button" className="btn btn-primary" onClick={() => setOpenModal(true)}>
            Launch demo modal
          </button>
          {openModal && (
            <Modal onClose={() => setOpenModal(false)}>
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
                    <button type="submit">POST</button>              
              </form> 
            </Modal>
          )}


      
         
        </div>
        
    </>
  )
}

export default Home