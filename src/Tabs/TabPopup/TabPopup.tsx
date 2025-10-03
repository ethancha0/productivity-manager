import {useState} from 'react';

function TabPopup({tabName}){

    const[links, setLinks] = useState([]);

    return(


        <div>
            {tabName}

            <form> 
                
                <input
                type="text"
                value= {links}
                onChange = {(e) => setLinks(e.target.value)}
                >
                </input>

            </form>
            
        </div>
    );

}

export default TabPopup
