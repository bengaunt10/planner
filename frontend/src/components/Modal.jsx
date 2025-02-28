
// eslint-disable-next-line react/prop-types
function Modal({onClose, children}) {
  return (
    <div className="card ">
      <div className="">
        <button className="" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
        
    </div>
  )
}

export default Modal