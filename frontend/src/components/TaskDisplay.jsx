/* eslint-disable react/prop-types */
import "../Styling/calendar.css"

function TaskDisplay({taskSelected, setTaskSelected, setOpenEditModal, setOpenDeleteModal, setOpenTaskModal}) {
  return (
    <div className="task-display">
        <label>Task Name: </label>
        <div className="form-control">
        {taskSelected.name}
        </div>
        <label>Description: </label>
        <div className="form-control">
        {taskSelected.description}
        </div>
        <label>Duration: </label>
        <div className="form-control">
            {taskSelected.duration} Hours
        </div>
        <label>Start Time: </label>
        <div className="form-control">
            {new Date(taskSelected.start_time).toLocaleString("en-US", {dateStyle:"long", timeStyle:"short"} )}
        </div>
        <label>End Time: </label>
        <div className="form-control">
            {new Date(taskSelected.end_time).toLocaleString("en-US", {dateStyle:"long", timeStyle:"short"} )}
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
        setTaskSelected(null);
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
  </div>
  )
  
}

export default TaskDisplay