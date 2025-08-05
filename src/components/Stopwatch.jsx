import { useState, useEffect } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // ********* Play the Stopwatch *********

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((i) => i + 1);
      }, 999);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div>
      <h2>Stopwatch</h2>
      <div className="time-display">
        {Math.floor(time / 3600)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((time % 3600) / 60)
          .toString()
          .padStart(2, "0")}
        :{(time % 60).toString().padStart(2, "0")}
      </div>

      <div className="controls">
        <button className="start-btn" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause " : "Start "}
          <i class={isRunning ? "fa-solid fa-pause" : "fa-solid fa-play"}></i>
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            setTime(0);
            setIsRunning(false);
          }}
        >
          Reset <i className="fa-solid fa-arrow-rotate-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
