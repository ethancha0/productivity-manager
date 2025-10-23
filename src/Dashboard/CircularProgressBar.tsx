// Import react-circular-progressbar module and styles
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Animation
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "../Animations/AnimatedProgressProvider";
function CircularProgressBar({total, goal, title}){

let percent = (total / goal) * 100;

    return(
        <div className="flex items-center gap-2" >
        
            <div className = "flex items-center gap-3">
                <AnimatedProgressProvider
                
                    valueStart={0}
                    valueEnd={percent}
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                    //repeat

            
                >
                    {value => {
                    // Keep smooth value for animation, but round for display
                    const displayValue = Math.round(value);
                    return (
                        <>
                        <CircularProgressbar
                        value={value}
                        text={`${displayValue}%`}
                        /* This is important to include, because if you're fully managing the
                    animation yourself, you'll want to disable the CSS animation. */
                        styles={buildStyles({ 
                            pathTransition: "none"
                        })}

                        />
                        <p className="font-semibold">{title}</p>
                        </>
                    );
                    }}


                </AnimatedProgressProvider>
            </div>

        </div>


    );





}


export default CircularProgressBar