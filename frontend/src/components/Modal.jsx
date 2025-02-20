
// eslint-disable-next-line react/prop-types
function Modal({onClose, children}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <button className="absolute top-2 right-4 text-lg" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
        
    </div>
  )
}

export default Modal