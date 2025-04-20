import "../styling/breathing.css";
import Navbar from "../components/Navbar";
import BreathingTimer from "../components/BreathingTimer";
import GratitudeJournal from "../components/GratitudeJournal";
import ResourceCard from "../components/ResourceCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faHandHoldingHeart, faLungs } from "@fortawesome/free-solid-svg-icons";

function WellBeing() {
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
            <FontAwesomeIcon icon={faBookOpen} /> Resources
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
            <FontAwesomeIcon icon={faHandHoldingHeart} /> Gratitude Journal
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
            <FontAwesomeIcon icon={faLungs} /> Breathing Timer
          </button>
        </li>
      </ul>

      <div className="tab-content ">
        <div className="tab-pane fade" id="breathing">
          <BreathingTimer />
        </div>
        <div className="tab-pane fade" id="gratitudes">
          <GratitudeJournal />
        </div>
        <div className="tab-pane fade show active" id="resources">
          <div className="resourcesContainer">
            <h2>WellBeing Resources</h2>
            <div className="row resourceCards">

            <ResourceCard 
              title="Anxiety Help Guide"
              subtitle="Anxiety Management"
              text="Understand anxiety and learn to manage it with self help techniques!"
              link="https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/"
            />
            
            <ResourceCard 
              title="Stress tips"
              subtitle="Stress Management"
              text="Effective methods to manage stress and build resilience"
              link="https://www.mind.org.uk/information-support/types-of-mental-health-problems/stress/managing-stress-and-building-resilience/"
            />
            <ResourceCard
            title="Calendar Tips"
            subtitle="Time Management"
            text="Techniques to manage time effectively using a Calendar"
            link="https://www.erincondren.com/inspiration-center-calendar-for-time-management?srsltid=AfmBOoqLfZQTfqk0LJ-GFNhCVmT3cHm4CpXEkmTw1_5t3I6ax5IfAcKl" 
            />
            <ResourceCard
            title="5 steps to mental wellbeing"
            subtitle="Wellbeing"
            text="Simple daily actions to boost mental wellbeing"
            link="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/"
            />
            <ResourceCard 
            title="Fight Procrastination"
            subtitle="Productivity"
            text="Strategies to overcome procrastination and stay focused"
            link="https://www.forbes.com/sites/vanessaloder/2016/04/15/10-scientifically-proven-tips-for-beating-procrastination/"
            />
            <ResourceCard
            title="Autism Guide"
            subtitle="Autism"
            text="Advice and guidance for daily life, needs and support"
            link="https://www.autism.org.uk/advice-and-guidance"
            />
            <ResourceCard 
            title="ADHD Management"
            subtitle="ADHD"
            text="Tips for managing ADHD in daily life such as organisation, routines focus"
            link="https://www.helpguide.org/mental-health/adhd/managing-adult-adhd"
            />
            <ResourceCard
            title="Study tips"
            subtitle="Academic"
            text="Techniques to study effectively and improve learning"
            link="https://summer.harvard.edu/blog/top-10-study-tips-to-study-like-a-harvard-student/#5-Find-Your-Learning-Style"
            />
            <ResourceCard
            title="Guide to a better sleep"
            subtitle="Sleep Health"
            text="Tips to improve sleep quality with a better routine for stress reduction"
            link="https://www.helpguide.org/mental-health/adhd/managing-adult-adhd"
            />
        </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WellBeing;
