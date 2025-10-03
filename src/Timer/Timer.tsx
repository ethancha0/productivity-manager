import React, {useState} from 'react';
import Countdown from "react-countdown";
import styles from './Timer.module.css'


export default function Pomodoro() {

  const [inputTime, setInputTime] = useState(25);
  const [endTime, setEndTime] = useState(null); // exact timestamp coundown will finish

  const [getFeedback, setGetFeedback] = useState(false);  
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
    setGetFeedback(false)

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
            >Start Timer
        </button>
      </form>
      

      {getFeedback && (

          <form onSubmit ={sendUserFeedback} className={styles.feedback}>
          <textarea 
            
            type="text-area"
            value={intervalFeedback}
            placeholder="Enter Session Summary"
            onChange = {(e) => setIntervalFeedback(e.target.value)}
          ></textarea>
          
          <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={burnout ?? 5}
          onChange={(e) => setBurnout(Number(e.target.value))}
          aria-label = "Burnout level 1-10"

          >
          </input>

          <button
            type="submit"
          >End Interval</button>

        </form>
      )}
      

      {endTime && (
    <Countdown
      date={endTime}
      onComplete={async () => {
        try {
          await fetch("http://127.0.0.1:5000/api/log-study", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ duration: inputTime }),
          });
        } catch (e) {
          console.error("log-study failed", e);
        } finally {
          setGetFeedback(true);
        }
      }}
      renderer={({ minutes, seconds, completed }) =>
        completed ? <span>Done!</span> :
        <span>{String(minutes).padStart(2,"0")}:{String(seconds).padStart(2,"0")}</span>
      }
    />
)}

    </div>
  );
}
