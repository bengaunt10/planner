import "../Styling/modal.css"
// eslint-disable-next-line react/prop-types
function Modal({onClose,title, children}) {
  return (
    <div className="modal" style={{ display: 'block', color: "black" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close position-absolute top-0 end-0" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Modal