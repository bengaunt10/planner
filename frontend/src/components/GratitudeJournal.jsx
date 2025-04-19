import { useState, useEffect } from "react"
import GratitudeServices from "../services/GratitudeServices"
import GratitudeForm from "./GratitudeForm"
import Modal from "./Modal"

import "../Styling/gratitudes.css"

function GratitudeJournal() {
  const [Gratitudes, setGratitudes] = useState([])
  const [GratitudeSelected, setGratitudeSelected] = useState(null); 

  const [openAddModal, setOpenAddModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [openEditModal, setOpenEditModal] = useState(false);

  const Token = localStorage.getItem("access")

  const fetchGratitudes = async () => {
    const response = await GratitudeServices.fetch_Gratitude(Token);
    if (response) {
      setGratitudes(response);
    } else {
      console.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchGratitudes();
  }, []);

  const addGratitude = async (gratitudeData) => {
    try {
      await GratitudeServices.add_gratitudes(gratitudeData, Token);
    }catch (error){
      console.error("Error adding task:", error);
    }
    setOpenAddModal(false);
    fetchGratitudes();
  }

  const deleteGratitude = async () => {
    try {
      await GratitudeServices.deleteGratitude(GratitudeSelected.id, Token);
      setOpenDeleteModal(false);
    }catch(error){
      console.error("Error deleting task:", error);
    }
    setGratitudeSelected(null);
    fetchGratitudes();
  };

  const editGratitude = async (taskData) => {
    await GratitudeServices.editGratitude(GratitudeSelected.id, Token, taskData);
    setOpenEditModal(false)
    fetchGratitudes();
  };

  return (
    <div className="gratitudeContainer">
      <button className="btn btn-primary addGratitudeButton" onClick={() => setOpenAddModal(true)}>
          Add Entry
      </button>

      <div className="gratitude_list">
      {Gratitudes.length === 0 ? (
        <div className="noGratitude">
          <h2> No Gratitude Entries Yet!</h2>
          <p>Click the button above to add your first entry.</p>
        </div>
      ) : (
      Gratitudes.sort((a, b) => new Date(b.created) - new Date(a.created)) .map((gratitude) =>
        <div key={gratitude.id} className="gratitudeCard">
          <div className="gratitudeCardHead">
            <h4>Posted {new Date(gratitude.created).toLocaleDateString()}</h4>
            <div className="gratitudeButtons">
              <button className="btn btn-info " onClick={() => {
                setOpenEditModal(true);
                setGratitudeSelected(gratitude);
              }}>Edit</button>   
              <button className="btn btn-primary" onClick={() => {
                setOpenDeleteModal(true);
                setGratitudeSelected(gratitude);
              }}>Delete</button>         
            </div> 
          </div>
          <p>Gratitudes: <span className="entryinfo">{gratitude.gratitudes}</span></p>
          <p>Done today: <span className="entryinfo">{gratitude.doneToday}</span></p>
          <p>Best part of the day: <span className="entryinfo">{gratitude.bestPartToday}</span></p>


        </div>
      ))}
    </div>


    {openAddModal && (
        <Modal onClose={() => setOpenAddModal(false)} title="Add Task">
          <h2> Add a new task</h2>
          <GratitudeForm onSubmit={addGratitude} /> 
        </Modal>
      )}

      {openDeleteModal && GratitudeSelected && (
        <Modal onClose={() => setOpenDeleteModal(false)} title="Delete Gratitude?">
          <h2>You are about to delete this entry! Are you sure?</h2>
          <button className="btn btn-danger" onClick={deleteGratitude}>Delete</button>
          <button className="btn btn-secondary" onClick={() => setOpenDeleteModal(false)}>Back</button>
        </Modal>
      )}
      {openEditModal && GratitudeSelected && (
        <Modal onClose={() => setOpenEditModal(false)} title="Edit Task">
          <GratitudeForm onSubmit={editGratitude} passedData={GratitudeSelected} editForm={true}/>
      </Modal>


      )}
    </div>
  )
}

export default GratitudeJournal