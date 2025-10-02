import React, {useState} from 'react';
import Countdown from "react-countdown";
import styles from './Timer.module.css'

export default function Pomodoro() {

  const [inputTime, setInputTime] = useState(25);
  const [endTime, setEndTime] = useState(null); // exact timestamp coundown will finish
  
  const [intervalFeedback, setIntervalFeedback] = useState(""); 
  const [burnout, setBurnout] = useState(5);

  function handleSubmit(e){
    e.preventDefault(); // prevent page refresh 
    const minutes = parseInt(inputTime, 10); // convert string input to number
    if(!isNaN(minutes) && minutes > 0){
      setEndTime(Date.now() + minutes * 60 * 1000); // calc end time in ms
    }
  }

  //FUNCTION: 
 //         Send summerized user notes and mood to backend
  function sendUserFeedback(e){
    e.preventDefault()
    console.log(intervalFeedback)
    console.log(burnout)

  }


  return ( 
    <div>
      <form onSubmit ={handleSubmit} className={styles.userInput}>

        <input 
          type="number"
          value = {inputTime}
          onChange={(e) => setInputTime(e.target.value)}
        ></input>


        <button
            type="submit"
            >Submit
        </button>
      </form>
      
      <form onSubmit ={sendUserFeedback} className={styles.feedback}>
        <input
          type="text"
          value={intervalFeedback}
          onChange = {(e) => setIntervalFeedback(e.target.value)}
        ></input>
        
        <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={burnout ?? 5}
        onChange={(e) => setBurnout(Number(e.target.value))}
        aria-level = "Burnout level 1-10"

        >
        </input>

        <button
          type="submit"
        >End Interval</button>

      </form>
        


      {endTime && ( // only show countdown if endTime exists 
        <Countdown
          date={endTime}
          onComplete={() => {
            fetch("http://127.0.0.1:5000/api/log-study", { //send post request when completed 
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ duration: inputTime })
            });
          }}
          renderer={({ minutes, seconds, completed }) =>
            completed ? (
              <span>Done!</span>
            ) : (
              <span>
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            )
          }
        />
      )}
    </div>
  );
}
