import {useState} from 'react';

function TabPopup({tabName}){

    /* FLOW:
        1. starts w/ links = [""] one empty input 
        2. Add Link btn => links = ["", ""] => now two inputs
        3. React re-renders and .map runs again, but with 2 elems
        4. React creates 2 input fields
    */

    const[links, setLinks] = useState([""]);


    //FUNCTION: adds an empty link to the arr 
    function LinkAdder(e){
        setLinks([...links, ""]);//add a new blank input to arr
    }

    //FUNCTION: add value to arr
    function handleInputChange(e, index){
        const newLinks = [...links]; // shallow copy of arr
        newLinks[index] = e.target.value; // updates the input based on index
        setLinks(newLinks); // updates arr, refreshes

    }

    return(


        <div>
            {tabName}

            <form> 
                {/* 
                links => state arr. 
                link => curr value, 
                index => position in array 
                creates an input field for each link in arr
                
                */}
                {links.map((link, index) => (
                    <input
                    key={index}
                    type="text"
                    value= {link}
                    placeholder="Enter Link here"
                    onChange = {(e) => handleInputChange(e, index)}
                    >
                    </input>
                ))}
                

                <button onClick = {LinkAdder} type ="button">
                    Add Link
                </button>

            </form>
            
        </div>
    );

}

export default TabPopup
