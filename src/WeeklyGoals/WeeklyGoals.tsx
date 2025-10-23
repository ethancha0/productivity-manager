import {useState} from 'react';
import {useNavigate} from "react-router-dom"
import Spinner from '../Animations/Spinner'
import Blur from '../Animations/BlurText'

import {API} from "../api"

function WeeklyGoals(){

    const nav = useNavigate();
    const[weeklyGoal, setWeeklyGoal] = useState(0);


    function handleSubmit(e){

        e.preventDefault();

        if(weeklyGoal < 0){
            alert("Hey you have more faith in yourself!...")
            return
        }
        else if(weeklyGoal > 200){
            alert("Maybe we should set a realistic goal...")
            return
        }

        console.log("Sending weekly goal to server: ",weeklyGoal)

        const goal = Number(weeklyGoal)
        async function sendWeeklyGoal(){
            try{
                const res = await fetch(`${API}/submit_weeklygoal`,{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({weeklyGoal})
                });

                const data = await res.json() // read server response
                console.log("saved: ", data)

                //redirect to dashboard
                nav("/dashboard", {replace: true});

            }
            catch(err){
                console.log("error saving weekly goal", err)
            }
        }

        sendWeeklyGoal();


    }


    return(
        <div className="min-h-screen w-screen flex items-center justify-center px-4">
            <div className="flex flex-col items-center m-6  font-semibold border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
      rounded-3xl p-8 m-32
      hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
      transition">
                <div className="w-full">
                <Blur
                    text="Set Weekly Goals"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-6xl p-16"
                    />
                </div>

                <h2 className="flex">Set your weekly study goals</h2>

                <form onSubmit ={handleSubmit}>

                    <input
                        className="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
                        type="number"
                        placeholder="How often are we studying"
                        value = {weeklyGoal}
                        onChange = {(e) => setWeeklyGoal(e.target.value)}
                        
                    ></input>   

                    <p className="flex">Hours a Week</p>

                    <button
                    className ="mx-auto grid"
                    type="submit"
                    disabled = {weeklyGoal === 0}>
                        Submit
                    </button>


                </form>

            </div>
        </div>

    );

}

export default WeeklyGoals