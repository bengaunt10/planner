/* eslint-disable react/prop-types */


function ResourceCard({title, subtitle, text, link}) {
  return (
    
    <div className="col-md-4">
    <div className="card" >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle text-muted mb-3">{subtitle} </h6>
        <p className="card-text">{text}</p>
        <a href={link} className="card-link">Learn More</a>
      </div>
    </div>
    </div>
  )
}

export default ResourceCard