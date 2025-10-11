
function HabitTracker(){

    return(
        <div className = "border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
    rounded-3xl p-8 m-32
    hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
    transition ">
            <h1 className="text-yellow-300">Habits</h1>

            <div className="flex gap-6">
                <h2>Daily</h2>

                <h2>Weekly</h2>
            </div>
            



        </div>



    );



}

export default HabitTracker