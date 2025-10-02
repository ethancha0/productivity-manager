import React, {useState} from 'react';
import Popup from './TabPopup/TabPopup'
import styles from './Tabs.module.css';
import gearIcon from '../assets/settings.png'

function Tabs()
{
    const [currInput, setCurrInput] = useState(""); // curr input text
    const [tabs, setTabs] = useState([]); //create a dict of tabs
    const [options, setOptions] = useState([]); // create dict of 'settings' 
    const [activeTab, setActiveTab] = useState(null); //which tab is open


    function handleButtonAdder(e){
        e.preventDefault(); //prevent page refresh
        if(currInput.trim() === "") return;

        //add new tab to list 
        setTabs([...tabs, currInput]); //creates new array with old items, then updates
        

        //clear input
        setCurrInput("");
    }

    function removeButton(value){

        setTabs(tabs.filter((t) => t !== value));
    }


    function togglePopup(tabName){
        setActiveTab((prev) => (prev === tabName ? null : tabName));
    }
    
    return(
        <div className="tab">
            
            <h3>Tabs</h3>

            
            
            <form onSubmit = {handleButtonAdder}>
                <input
                type="text"
                value={currInput}
                onChange = {(e) => setCurrInput(e.target.value)}
                placeholder = "Enter tab name"
                >
                </input>

                <button
                type="submit"
                >Add Tab</button>
            </form>

            {/* render buttons for each added tab */}
            <div>
                {tabs.map((t, index) => (
                    <div className = {styles.category}>
                    <button key = {index}>
                    {t}
                    </button>
                    

                    <a href = "#" 
                    className={styles.settings}
                    onClick={(e) => {
                        e.preventDefault();
                        togglePopup(t)}}>
                        <img src={gearIcon} alt="settings"></img>
                    </a>

                    {activeTab === t && <Popup tabName={t}/>}
                    </div>
                ))}
            </div>
            
            {/*
            <div>
                <h3>Popup</h3>
                {tabs.map((tab, index) => (
                <Popup key={index} tabName={tab}/>
                ))}
            </div>
            */}

            
            
            
            
        
        
        </div>
    );





}

export default Tabs