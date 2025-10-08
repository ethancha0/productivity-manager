import {useState} from 'react';

function WeeklyGoals(){

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
                const res = await fetch("http://127.0.0.1:5000/submit_weeklygoal",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({weeklyGoal})
                });

                const data = await res.json() // read server response
                console.log("saved: ", data)
            }
            catch(err){
                console.log("error saving weekly goal", err)
            }
        }

        sendWeeklyGoal();


    }


    return(
        <div className="font-mono outline outline-orange-500 p-5 flex-row m-8">

            <h1 className="mx-auto grid" >How many hours should we preheat your week for?</h1>
            <h2 className="">Set your weekly study goals</h2>

            <form onSubmit ={handleSubmit}>

                <input
                    type="number"
                    className="mx-auto grid"
                    placeholder="How often are we baking?"
                    value = {weeklyGoal}
                    onChange = {(e) => setWeeklyGoal(e.target.value)}
                ></input>
                <p className="mx-auto grid">Hours a Week</p>

                <button
                className ="mx-auto grid"
                type="submit"
                disabled = {weeklyGoal === 0}>
                    Submit
                </button>


            </form>

        </div>

    );

}

export default WeeklyGoals