/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function TaskOperationForm({ onSubmit, passedData, editForm=false, start="" }) {
    const [taskData, setTaskData] = useState({
        newName: "",
        newDescription: "",
        newDuration: 0,
        newStartTime: start,
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
              <label htmlFor="name"> Task Name: </label>
              <input className="form-control"
                id="name"
                type="text"
                placeholder="Enter Name..."
                value={taskData.newName}
                onChange={(e) =>
                  setTaskData({ ...taskData, newName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description"> Description: </label>
              <textarea className="form-control"
                id="description"
                type="text"
                placeholder="Enter Description..."
                value={taskData.newDescription}
                maxLength={170}
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
              <label htmlFor="duration"> duration:</label>
              <input className="form-control"
                id="duration"
                type="number"
                placeholder="Enter Duration..."
                value={taskData.newDuration}
                onChange={(e) =>
                  setTaskData({ ...taskData, newDuration: e.target.value })
                }
                min="0"
                required
              />
            </div>            
            {!editForm && (
            <>
              <div className="form-group chooseToSchedule">
                <div className ="chooseScheduleBox">
                  <label className="form-check-label " htmlFor="schedule">Schedule for me?</label>
                  <input className="form-check-input"
                    id="schedule"
                    type="checkbox"
                    checked={taskData.scheduleForMe}
                    onChange={(e) => setTaskData({...taskData, scheduleForMe: e.target.checked})}
                  />
                </div>
               <small>Let CalmDay find the best slot to schedule your task! Just check the box above and enter a Due Date! </small>
                <br></br>
                {taskData.scheduleForMe && (
                  <>
                    <label htmlFor="due" >Date Due</label>
                    <input className="form-control"
                      id="due"
                      type="datetime-local"
                      value={taskData.dueDate.toString().substring(0, 16)}
                      onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                    />
                  </>
                )}
              </div>
            </>
            )}
            {!taskData.scheduleForMe && (
                  <>
                    <label htmlFor="start"> Start Time:</label>
                    <input className="form-control"
                      id="start"
                      type="datetime-local"
                      value={taskData.newStartTime.toString().substring(0, 16)}
                      onChange={(e) => setTaskData({...taskData, newStartTime: e.target.value})}
                      required
                    />
                {!editForm && (
                  <>
                  <label htmlFor="repeat">Repeat: </label>
                  <select className="form-control"
                    id="repeat"
                    value={taskData.newRepeat}
                    onChange={(e) => setTaskData({...taskData, newRepeat: e.target.value})}
                  >
                    <option value="none">No</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </>
                )}
                </>
                )}                




            <button className="btn btn-success" type="submit">
                {editForm ? 'Update' : 'Add'} Task
            </button>
          </form>

    </div>
  )
}

export default TaskOperationForm