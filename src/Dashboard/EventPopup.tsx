import {useState} from "react"


function EventPopup({open, draft, onChangeDraft, onClose, onSave}){

    if(!open) return null
    const[event, setEvent] = useState("");

    return(
        <div className="border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
                        rounded-3xl p-2 m-2 w-fit flex
                        hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
                        transition">
            <div>
                <h2>Add Event</h2>

                <form className="flex gap-7">
                    <input
                        type="text"
                        placeholder="New Event"
                        value ={event}
                        onChange={(e) => setEvent(e.target.value)}
                    ></input>

                    <button type="submit">
                        Submit
                    </button>



                </form>
            </div>

        </div>

    )


}

export default EventPopup
