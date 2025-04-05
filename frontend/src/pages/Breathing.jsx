import "../styling/breathing.css";
import Navbar from "../components/Navbar";
function Breathing() {
  return (
    <>
      <Navbar />
      <ul className="nav nav-pills nav-fill">
        <li className="nav-item">
          <button
            className="nav-link active tab"
            data-bs-toggle="tab"
            data-bs-target="#resources"
            aria-selected="true"
            type="button"
          >
            Resources
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link tab"
            data-bs-toggle="tab"
            data-bs-target="#gratitudes"
            aria-selected="false"
            type="button"
          >
            Gratitude Journal
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link tab"
            data-bs-toggle="tab"
            data-bs-target="#breathing"
            aria-selected="false"
            type="button"
          >
            Breathing Timer
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="breathing">
          <div className="breathingContainer">
            <h2 className="breathingTitle">Breathing Timer</h2>
            <p className="breathingInstructions">
              Follow along with the circle to breathe in and out
            </p>
            <p className="anim-circle"></p>
          </div>
        </div>
        <div className="tab-pane fade" id="gratitudes">
          <div className="gratitudeContainer">
            <h2>Gratitude Journal</h2>
          </div>
        </div>
        <div className="tab-pane fade" id="resources">
          <div className="resourcesContainer">
            <h2>WellBeing Resources</h2>
            <div className="row resourceCards">
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Anxiety Help Guide</h5>
                <h6 className="card-subtitle text-muted mb-3">Anxiety </h6>
                <p className="card-text">.......</p>
                <a href="https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Stress tips</h5>
                <h6 className="card-subtitle text-muted mb-3">Stress </h6>
                <p className="card-text">.......</p>
                <a href="https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/managing-stress-and-building-resilience/" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Calendar</h5>
                <h6 className="card-subtitle text-muted mb-3">Anxiety </h6>
                <p className="card-text">.......</p>
                <a href="https://www.erincondren.com/inspiration-center-calendar-for-time-management?srsltid=AfmBOoqLfZQTfqk0LJ-GFNhCVmT3cHm4CpXEkmTw1_5t3I6ax5IfAcKl" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">5 steps to mental wellbeing</h5>
                <h6 className="card-subtitle text-muted mb-3">Wellbeing </h6>
                <p className="card-text">.......</p>
                <a href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Procrastination help</h5>
                <h6 className="card-subtitle text-muted mb-3">Procrastination </h6>
                <p className="card-text">.......</p>
                <a href="https://www.forbes.com/sites/vanessaloder/2016/04/15/10-scientifically-proven-tips-for-beating-procrastination/" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Autism Guide</h5>
                <h6 className="card-subtitle text-muted mb-3">Autism </h6>
                <p className="card-text">.......</p>
                <a href="https://www.autism.org.uk/advice-and-guidance" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">ADHD help</h5>
                <h6 className="card-subtitle text-muted mb-3">ADHD </h6>
                <p className="card-text">.......</p>
                <a href="https://www.helpguide.org/mental-health/adhd/managing-adult-adhd" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">Study Tips</h5>
                <h6 className="card-subtitle text-muted mb-3">Studying </h6>
                <p className="card-text">.......</p>
                <a href="https://summer.harvard.edu/blog/top-10-study-tips-to-study-like-a-harvard-student/#5-Find-Your-Learning-Style" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card" >
              <div className="card-body">
                <h5 className="card-title">ADHD help</h5>
                <h6 className="card-subtitle text-muted mb-3">ADHD </h6>
                <p className="card-text">.......</p>
                <a href="https://www.helpguide.org/mental-health/adhd/managing-adult-adhd" className="card-link">Navigate</a>
              </div>
            </div>
            </div>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Breathing;
