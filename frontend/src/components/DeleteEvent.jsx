/* eslint-disable react/prop-types */


function DeleteEvent({deleteTask, eventSelect, deleteRepeat, setDeleteRepeat, setOpenDeleteModal}) {
  return (
    <>
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
    </>
  )
}

export default DeleteEvent