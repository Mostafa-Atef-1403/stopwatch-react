import { useState } from "react";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import './styles/App.css'
import './styles/Stopwatch.css'
import './styles/Timer.css'


function App() {

  const [current, changeCurrent] = useState("Timer")

  return (
    <div className="container">

      <h1>Stopwatch & Timer</h1>

      <div className="nav-btns">
        <button className="stopwatch-btn" onClick={() => changeCurrent("Stopwatch")} >Stopwatch <i class="fa-solid fa-stopwatch"></i></button> | 
        <button className="timer-btn" onClick={() => changeCurrent("Timer")}>Timer <i class="fa-solid fa-hourglass-start"></i></button>
      </div>

      <main>
        {current === "Stopwatch" ? <Stopwatch /> : <Timer />}
      </main>

    </div>
  )
}

export default App;
