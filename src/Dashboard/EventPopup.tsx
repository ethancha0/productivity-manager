import {useState} from "react"


function EventPopup(){
    const[event, setEvent] = useState("");

    return(
        <div className="border border-orange-400 p-4 m-5">
            <div>
                <h3>Add Event</h3>

                <form>
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
