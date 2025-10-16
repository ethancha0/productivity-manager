import React, {useState} from 'react';
import Countdown from "react-countdown";
import oven from '../assets/oven.gif'

import {API} from '../api'


export default function Pomodoro() {

  const [inputTime, setInputTime] = useState(25);
  const [endTime, setEndTime] = useState(null); // exact timestamp coundown will finish

  const [getFeedback, setGetFeedback] = useState(false);  
  const [intervalFeedback, setIntervalFeedback] = useState(""); 
  const [burnout, setBurnout] = useState(5);
  const [inSession, setInSession] = useState(false);
  

  function handleSubmit(e){
    e.preventDefault(); // prevent page refresh 
    const minutes = parseInt(inputTime, 10); // convert string input to number
    if(!isNaN(minutes) && minutes > 0){
      setEndTime(Date.now() + minutes * 60 * 1000); // calc end time in ms
    }
    setInSession(true);
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
      

      <form onSubmit ={handleSubmit} className="flex flex-col-reverse items-center gap-2 pt-8 m-2 pb-0">

        {/* input time */}
        {!inSession && (
        <input
          className="bg-transparent font-mono text-5xl size-20 text-orange-500" 
          type="number"
          step={1}
          value = {inputTime}
          onChange={(e) => setInputTime(e.target.value)}
        ></input> )
        }
        {/*The oven is the button */}
        <button
            className="font-mono font-bold text-orange-500"
            type="submit">
  
            <img 
              className ="h-48 w-auto"
              src = {oven}
              alt="Oven"
            />

            {!inSession ? <p>Begin Baking</p> : <p>Cooking!!</p>}
        </button>
      </form>
      

      {getFeedback && (
        <>
        <form onSubmit ={sendUserFeedback} className={styles.feedback}>
        <textarea 
            className = {`font-mono rounded-xl size-30 h-20 w-full max-w-md border border-purple-400/30
            shadow-lg shadow-purple-500/10 p-11`}
            value={intervalFeedback}
            placeholder="What did you accomplish?"
            onChange = {(e) => setIntervalFeedback(e.target.value)}
          />
          
          <input
          className ="mt-4 w-full"
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
        </>
      )}
      

      {endTime && (
    <div className = "mt-2 flex justify-center">
    <Countdown
      date={endTime}
      onComplete={async () => {
        try {
          await fetch(`${API}/api/log-study`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ duration: inputTime }),
          });
        } catch (e) {
          console.error("log-study failed", e);
        } finally {
          setGetFeedback(true);
        }
      }}
      renderer={({ minutes, seconds, completed }) =>
  completed ? (
    <span className="font-mono text-2xl text-orange-600">Done!</span>
  ) : (
    <div className="mx-auto w-fit flex items-baseline justify-center">
      <span className="font-mono tabular-nums text-5xl text-orange-600 w-[2ch] text-right">
        {String(minutes).padStart(2, "0")}
      </span>
      <span className="font-mono text-5xl text-orange-600 px-2 leading-none">:</span>
      <span className="font-mono tabular-nums text-5xl text-orange-600 w-[2ch] text-left">
        {String(seconds).padStart(2, "0")}
      </span>
    </div>
  )
}

    />
    </div>
)}

    </div>
  );
}
