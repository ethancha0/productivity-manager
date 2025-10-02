import React, {useState} from 'react';
import Countdown from "react-countdown";
import styles from './Timer.module.css'

export default function Pomodoro() {

  const [inputTime, setInputTime] = useState(25);
  const [endTime, setEndTime] = useState(null); // exact timestamp coundown will finish

  function handleSubmit(e){
    e.preventDefault(); // prevent page refresh 
    const minutes = parseInt(inputTime, 10); // convert string input to number
    if(!isNaN(minutes) && minutes > 0){
      setEndTime(Date.now() + minutes * 60 * 1000); // calc end time in ms
    }
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
