import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import "../Styling/study.css";
function Study() {
  const [minutesLeft, setMinutesLeft] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [displayWriting, setDisplayWriting] = useState(false);

  useEffect(() => {
    let callAt = setInterval(() => {
      clearInterval(callAt);
      if (secondsLeft === 0) {
        if (minutesLeft !== 0) {
          setSecondsLeft(59);
          setMinutesLeft(minutesLeft - 1);
        } else {
          let minutesLeft = displayWriting ? 24 : 4;
          let secondsLeft = 59;

          setMinutesLeft(minutesLeft);
          setSecondsLeft(secondsLeft);
          setDisplayWriting(!displayWriting);
        }
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
  }, [secondsLeft]);

  const minutesDisplay = minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft;
  const secondsDisplay = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
  return (
    <div className="studyPage">
      <Navbar />
      <h1>Pomodoro timer</h1>
      <div className="pomodoroContainer">
        <div >
          {displayWriting && (
            <div className="timerWriting">Take a break, your next session starts in: </div>
          )}
          {!displayWriting && (
            <div className="timerWriting">Keep studying, you got this!!</div>
          )}
        </div>
        <div className="timer">
          {minutesDisplay}:{secondsDisplay}
        </div>
      </div>
    </div>
  );
}

export default Study;

// Pomodoro timer code inspired and adapted from: https://www.youtube.com/watch?v=9z1qBcFwdXg&list=WL&index=2&t=11s
