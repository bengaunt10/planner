/* eslint-disable react/prop-types */


function TaskDisplay({eventSelect, setEventSelect, setOpenEditModal, setOpenDeleteModal, setOpenTaskModal}) {
  return (
    <>
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
  </>
  )
  
}

export default TaskDisplay