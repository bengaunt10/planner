/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquarePlus, faStopwatch, faHandHoldingHeart, faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import "../Styling/modal.css"
function HelpGuide({onClose}) {
  return (
    <div className="modal" style={{ display: 'block', color: "black" }} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content help-content">
        <div className="modal-header">
          <h5 className="modal-title">Help Guide</h5>
          <button type="button" className="close position-absolute top-1 end-2" onClick={onClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <div className="helpBox">
            <p>Welcome to Calm Day! Here are some tips to help get you started:</p>
            <p>Use the navigation bar above to navigate Calm Day. You are currently on the <strong>Dashboard</strong>.</p>
            <ul>
                <li>Click the <FontAwesomeIcon icon={faSquarePlus} /> button to add a new task. You can choose your preffered start time or let Calm Day schedule the task for you!</li>
                <li>Click the <FontAwesomeIcon icon={faStopwatch} /> button to begin a study session</li>
                <li>Click the <FontAwesomeIcon icon={faHandHoldingHeart} /> button to add a gratitude entry</li>
                <li>If you wish to edit entrys across Calm Day you can do so by clicking the <FontAwesomeIcon icon={faPenToSquare} /> button or the <FontAwesomeIcon icon={faTrash} /> button to delete.</li>
            </ul>
            <p><strong>Calendar Page </strong></p>
            <ul>
                <li>Click the calendar in the navigation bar to view your tasks in a calendar format. You can add, edit, and delete tasks from this page as well.</li>
                <li>Click on a task to view its details or delete/edit the task. Resize tasks to change duration and drag and drop tasks to reschedule them.</li>
            </ul>
            <p><strong>Wellbeing Page </strong></p>
            <ul>
                <li>Click the Gratitude Journal option to view your entries in a journal format. You can add, edit, and delete entries here</li>
                <li>Click the Breathing Timer to breathe in and out, following the animated circle. This is perfect for quick relaxation. </li>
                <li>Click the Resources option to find helpful links from professionals.</li>
            </ul>
        </div>
        </div>
        <div className="modal-footer">
            <div className="helpLogo"></div>
        </div>
      </div>
    </div>
  </div>
    
  )
}

export default HelpGuide