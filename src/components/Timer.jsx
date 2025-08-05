import { useState, useEffect, useRef } from "react";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [initialTime, setInitialTime] = useState({ h: 0, m: 0, s: 0 });

  // ********** Load the default labs **********

  // Not a state: just fixed array
  const defaultTimers = [
    { id: 1, name: "5 Minutes Timer", seconds: 300 },
    { id: 2, name: "10 Minutes Timer", seconds: 600 },
    { id: 3, name: "15 Minutes Timer", seconds: 900 },
  ];

  // State for the timers YOU create
  const [userTimers, setUserTimers] = useState([]);

  const loadDefaultTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  // ********** Handle timer logic **********

  const handleTimeChange = (newHours, newMinutes, newSeconds) => {
    if (newSeconds >= 60) {
      newMinutes += Math.floor(newSeconds / 60);
      newSeconds = newSeconds % 60;
    }
    if (newMinutes >= 60) {
      newHours += Math.floor(newMinutes / 60);
      newMinutes = newMinutes % 60;
    }

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };

  // ********** start the countdown **********

  // ********** reduce the counter by 1, subtract 1 from total seconds

  const alarmAudioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  const playAlertSound = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current = null;
    }

    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }

    const audio = new Audio(
      "/sound/Dr  Dre – Keep Their Heads Ringin_ (1995)(MP3_160K).mp3"
    );

    audio.play().catch((error) => {
      console.log("Could not play audio:", error);
    });

    alarmAudioRef.current = audio;

    alarmTimeoutRef.current = setTimeout(() => {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current.currentTime = 0;
        alarmAudioRef.current = null;
      }
      alarmTimeoutRef.current = null;
    }, 22000);
  };

  useEffect(() => {
    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;

          const h = Math.floor(newTime / 3600);
          const m = Math.floor((newTime % 3600) / 60);
          const s = newTime % 60;

          setHours(h);
          setMinutes(m);
          setSeconds(s);

          if (newTime <= 0) {
            setIsRunning(false);
            playAlertSound();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTime(totalSeconds);

      setInitialTime({ h: hours, m: minutes, s: seconds });
    }
    setIsRunning(!isRunning);
  };

  // ********** reset the countdown **********

  const resetTimer = () => {
    setHours(initialTime.h);
    setMinutes(initialTime.m);
    setSeconds(initialTime.s);
    setIsRunning(false);
  };

  // ********** save the Timer **********

  const saveTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds === 0) {
      alert("Set a timer first!");
      return;
    }

    const name = prompt("Enter timer name:");

    const timer = {
      id: Date.now(),
      name: `${name} ${minutes} Minutes Timer`,
      seconds: totalSeconds,
    };

    const updatedTimers = [...userTimers, timer];
    setUserTimers(updatedTimers);
    localStorage.setItem("userTimers", JSON.stringify(updatedTimers));
  };

  // ********** rename the Timer **********

  const editTimer = (id) => {
    const target = userTimers.find((timer) => timer.id === id);
    if (!target) return;

    const newName = prompt("Edit the timer name:", target.name);
    if (!newName || newName.trim() === "") return;

    const updatedTimers = userTimers.map((timer) =>
      timer.id === id ? { ...timer, name: newName } : timer
    );

    setUserTimers(updatedTimers);
    localStorage.setItem("userTimers", JSON.stringify(updatedTimers));
  };

  // ********** delete the Timer **********

  const deleteTimer = (id) => {
    const updatedTimers = userTimers.filter((timer) => timer.id !== id);
    setUserTimers(updatedTimers);
    localStorage.setItem("userTimers", JSON.stringify(updatedTimers));
  };

  // ********** ring progress the Timer **********

  const totalSeconds =
    initialTime.h * 3600 + initialTime.m * 60 + initialTime.s;
  const progress = time / totalSeconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  // ********** localStorage **********

  useEffect(() => {
    const savedTimers = localStorage.getItem("userTimers");
    if (savedTimers) {
      setUserTimers(JSON.parse(savedTimers));
    }
  }, []);

  return (
    <div>
      <h2>Timer</h2>

      <div>
        <div className="timer-display-wrapper">
          <svg className="progress-ring" width="200" height="200">
            <circle
              className="progress-ring-circle"
              stroke="#e9ecef"
              strokeWidth="4"
              fill="transparent"
              r={radius}
              cx="100"
              cy="100"
            />
            <circle
              className="progress-ring-progress"
              stroke="#007bff"
              strokeWidth="4"
              fill="transparent"
              r={radius}
              cx="100"
              cy="100"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="timer-display">
            <input
              type="number"
              value={hours.toString().padStart(2, "0")}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                handleTimeChange(value, minutes, seconds);
              }}
            />
            :
            <input
              type="number"
              value={minutes.toString().padStart(2, "0")}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                handleTimeChange(hours, value, seconds);
              }}
            />
            :
            <input
              type="number"
              value={seconds.toString().padStart(2, "0")}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                handleTimeChange(hours, minutes, value);
              }}
            />
          </div>
        </div>

        <div className="timer-controls">
          <button className="start-btn" onClick={startTimer}>
            {isRunning ? "Pause " : "Start "}
            <i
              className={isRunning ? "fa-solid fa-pause" : "fa-solid fa-play"}
            ></i>
          </button>
          <button className="reset-btn" onClick={resetTimer}>
            Reset <i className="fa-solid fa-arrow-rotate-right"></i>
          </button>
        </div>
      </div>

      <div className="default-laps">
        <button className="create-btn" onClick={saveTimer}>
          Save a timer
        </button>

        {[...defaultTimers, ...userTimers].map((lab) => (
          <div
            key={lab.id}
            className="lap"
            onClick={() => loadDefaultTime(lab.seconds)}
          >
            {lab.name}{" "}
            <span className="action-btns">
              <button className="edit" onClick={() => editTimer(lab.id)}>
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button className="delete" onClick={() => deleteTimer(lab.id)}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timer;
