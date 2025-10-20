// Import react-circular-progressbar module and styles
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Animation
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "../Animations/AnimatedProgressProvider";
function CircularProgressBar(){

    return(
        <div>
        
            <AnimatedProgressProvider
                valueStart={0}
                valueEnd={66}
                duration={1.4}
                easingFunction={easeQuadInOut}
                //repeat
        
            >
                {value => {
                // Keep smooth value for animation, but round for display
                const displayValue = Math.round(value);
                return (
                    <CircularProgressbar
                    value={value}
                    text={`${displayValue}%`}
                    /* This is important to include, because if you're fully managing the
                animation yourself, you'll want to disable the CSS animation. */
                    styles={buildStyles({ 
                        pathTransition: "none"
                    })}
                    />
                );
                }}
            </AnimatedProgressProvider>
     

        </div>


    );





}


export default CircularProgressBar