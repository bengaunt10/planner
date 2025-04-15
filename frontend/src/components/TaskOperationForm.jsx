import { useState, useEffect } from "react";

function TaskOperationForm({ onSubmit, passedData, isEdit=false }) {
    const [taskData, setTaskData] = useState({
        newName: "",
        newDescription: "",
        newDuration: 0,
        newStartTime: "",
        newRepeat: "none",
        scheduleForMe: false,
        dueDate: "",
    });

    useEffect(() => {
        if (passedData) {
            setTaskData({
                newName: passedData.name,
                newDescription: passedData.description,
                newDuration: passedData.duration,
                newStartTime: passedData.start_time,
                newRepeat: passedData.repeat || "none",
                scheduleForMe: passedData.schedule || false,
                dueDate: passedData.dueDate || "",
            });
        }
    }
    , [passedData]);

    const preSubmission = (e) => {
        e.preventDefault();
        const currentTime = new Date().toISOString().substring(0, 16);
        
        if (!taskData.scheduleForMe && taskData.ewStartTime < currentTime) {
          alert("Start time cannot be before current time");
          return;
        }
    
        onSubmit({
          name: taskData.newName,
          description: taskData.newDescription,
          duration: taskData.newDuration,
          start_time: taskData.scheduleForMe ? null : taskData.newStartTime,
          repeat: taskData.newRepeat,
          schedule: taskData.scheduleForMe,
          due_date: !taskData.scheduleForMe ? null : taskData.dueDate
        });
    };




  return (
    <div>
        <form onSubmit={preSubmission}>
            <div className="form-group">
              <label> Task Name: </label>
              <input className="form-control"
                type="text"
                value={taskData.newName}
                onChange={(e) =>
                  setTaskData({ ...taskData, newName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label> Description: </label>
              <input className="form-control"
                type="text"
                value={taskData.newDescription}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    newDescription: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label> duration:</label>
              <input className="form-control"
                type="number"
                value={taskData.newDuration}
                onChange={(e) =>
                  setTaskData({ ...taskData, newDuration: e.target.value })
                }
                min="0"
                required
              />
            </div>
            {!taskData.scheduleForMe && (
                  <>
                    <label> Start Time:</label>
                    <input className="form-control"
                      type="datetime-local"
                      value={taskData.newStartTime.toString().substring(0, 16)}
                      onChange={(e) => setTaskData({...taskData, newStartTime: e.target.value})}
                      required
                    />
                  </>
                )}                
                <label>Repeat: </label>
                <select className="form-control"
                  value={taskData.newRepeat}
                  onChange={(e) => setTaskData({...taskData, newRepeat: e.target.value})}
                >
                  <option value="none">No</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
            {!isEdit && (
            <>
                <label className="form-check-label">Schedule for me?</label>
                <input className="form-check-input"
                  type="checkbox"
                  checked={taskData.scheduleForMe}
                  onChange={(e) => setTaskData({...taskData, scheduleForMe: e.target.checked})}
                />
                <br />
                {taskData.scheduleForMe && (
                  <>
                    <label>Date Due</label>
                    <input className="form-control"
                      type="datetime-local"
                      value={taskData.dueDate.toString().substring(0, 16)}
                      onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                    />
                  </>
                )}
            </>
            )}


            <button className="btn btn-success" type="submit">
                {isEdit ? 'Update' : 'Add'} Task
            </button>
          </form>

    </div>
  )
}

export default TaskOperationForm