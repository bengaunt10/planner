/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
function NextTask({Tasks, setOpenDeleteModal, setTaskToDelete, setOpenEditModal, setTaskSelected}) {


  const getNextTask = () => {
    if (!Tasks) {
      return null;
    }
    const currentTime = new Date();
    const nextTasks = Tasks.filter((task) => {
    const taskTime = new Date(task.start_time);
    const taskEnd = new Date(task.end_time);
    return (taskTime <= currentTime && currentTime <= taskEnd) || taskTime > currentTime;
    });
    if (nextTasks.length === 0) {
      return null;
    }
    nextTasks.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });
    return nextTasks[0];
  }

  const nextTask = getNextTask();

    if (!nextTask) {
      return (
        <h2 className='noTaskAlert'>You have no tasks! Click the <FontAwesomeIcon icon={faSquarePlus} /> button to add a new task</h2>
      );
    }
    return (
        <li className="nextTask"key={nextTask.id}>
          <button
            className="btn btn-danger HomeBoxButton"
            onClick={() => {
              setOpenDeleteModal(true);
              setTaskToDelete(nextTask);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <h2 className="HomeBoxTask" >{nextTask.name}</h2>
          <p className="HomeBoxDescriptionn">{nextTask.description}</p>
    
          <p className="HomeBoxTime">{new Date(nextTask.start_time).toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'})}- {new Date(nextTask.end_time).toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'})}
            <br />
            {new Date(nextTask.start_time).toLocaleDateString("en-us", {month: 'long', day: 'numeric'})}
          </p> 
          <button
            className="btn btn-warning HomeBoxEdit"
            onClick={() => {
              setOpenEditModal(true);
              setTaskSelected(nextTask);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare}/>
          </button>
        </li>
      )
}

export default NextTask