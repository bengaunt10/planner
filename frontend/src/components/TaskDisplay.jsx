/* eslint-disable react/prop-types */


function TaskDisplay({taskSelected, setTaskSelected, setOpenEditModal, setOpenDeleteModal, setOpenTaskModal}) {
  return (
    <>
        <h2>Task</h2>
        <div className="form-group">
        <label>Task Name: {taskSelected.name}</label>
        </div>
        <div className="form-group">
        <label>Description: {taskSelected.description}</label>
        </div>
        <div className="form-group">
        <label>Duration: {taskSelected.duration}</label>
        </div>
        <div className="form-group">
        <label>Start Time: {taskSelected.start_time}</label>
        </div>
        <div className="form-group">
        <label>End Time: {taskSelected.end_time}</label>
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
  </>
  )
  
}

export default TaskDisplay