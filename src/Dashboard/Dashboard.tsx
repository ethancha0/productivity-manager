import Calendar from "./Calendar"
import HabitTracker from "./HabitTracker"
import Timer from "./Timer"
import Stopwatch from "./Stopwatch"

function Dashboard(){

    return(
        <div className="min-h-screen flex md:flex-row border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 
        shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
        rounded-3xl p-2 m-32
        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
        transition">

            {/* Left column*/}
            <div className="mx-auto max-w-6xl flex flex-col"> 
                <Calendar/>
            </div>
            {/* Right column */}
            <aside className = "w-full md:w-80 flex flex-col gap-6">
                <Timer/>
                <Stopwatch/>
                <HabitTracker/>
            </aside>

    
        </div>

    );

}

export default Dashboard