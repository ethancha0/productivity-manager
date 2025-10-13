import Calendar from "./Calendar"
import HabitTracker from "./HabitTracker"
import Timer from "./Timer"
import Stopwatch from "./Stopwatch"
import exStats from "../assets/ex-statbreakdown.png"

function Dashboard(){

    return(
        <div className="min-h-screen flex md:flex-row border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 
        shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
        rounded-3xl p-8 m-32
        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
        transition">

            {/* Left column - Calendar */}
            <div className="flex-1 max-w-4xl"> 
                <Calendar/>
            </div>
            
            {/* Right column - Timer with image below, Stopwatch to the right */}
            <div className="flex flex-row gap-8 ml-8">
                <div className="flex flex-col gap-4" >
                    <Timer/>
                    <img src={exStats} className=" flex md:flex-row border border-2  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 
        shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
        rounded-3xl h-52 p-2
        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
        transition"/> 
                </div>
                <Stopwatch/>
            </div>

    
        </div>

    );

}

export default Dashboard