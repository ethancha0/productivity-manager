import {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";

import Spinner from "../Animations/Spinner"

//const API = import.meta.env.VITE_API_BASE;
import {API} from "../api"

function CreateAccount(){

    const nav = useNavigate();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)


    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    function handleSubmit(e: React.FormEvent){
        //prevent refresh
        e.preventDefault();
        setLoading(true);
        
        if(userName == "" || email == "" || password == "" || confirmPassword == ""){
            alert("missing text field(s)");
            return;
        }

        console.log("sending to server!")
        console.log(userName, email, password, )

       

        //send data to backend
        async function sendAccountInfo(){
            try{
                const res = await fetch(`${API}/submit_accountinfo`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({userName, email, password}), // convert JS obj to dict
                });

                const data = await res.json(); // read server response
                console.log("saved: ", data)

                // go to /login 
                nav("/login", {replace : true});
            }
            catch(err){
                console.error("error saving account info", err)
                alert(String(err))
            }
            finally{
                setLoading(false);
            }
        }

        // call function to send data to backend
        sendAccountInfo()
    
    }


    return(
        <div className="min-h-screen w-screen flex items-center justify-center px-4">
        <div className=" flex flex-col justify-center items-center m-6  font-semibold border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
    rounded-3xl
    hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
    transition">
            <h1 className="p-16">
                Create Account
            </h1>
            <p>
                Already have an account? <Link to="/login" >Sign in</Link>
            </p>

            <form onSubmit={handleSubmit} className = "mt-10 w-full max-w-3xl space-y-6 p-6">
                {/*Row 1 */}
                <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                    className="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
                    placeholder = "Username"
                    value = {userName}
                    onChange = {(e) => (setUserName(e.target.value))}
                    ></input>
        
                    <input
                    className ="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
                    placeholder = "Email"
                    value = {email}
                    onChange = {(e) => (setEmail(e.target.value))}
                    ></input>
                </div>
               
                {/* Row 2 */}
                <div className = "mt-8" > 
                    <input
                    type = "password"
                    className = "w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3"
                    placeholder = "Create Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    
    
                    ></input>

                    <input
                    type = "password"
                    className = "w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3"
                    placeholder = "Re-type Password"
                    value = {confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                   
                    ></input>
                </div>

                


                
               {/* Row 3 */}
                <button 
                className = "block mx-auto w-full border border-neutral-700 py-3"
                disabled = {!passwordsMatch || password.length === 0} 
                >  
                    Submit
                </button>

                {loading && <Spinner/>}


                {/* inline invalid password error */}
                {confirmPassword.length > 0 && confirmPassword != password && (
                    <p>passwords don't match BRUH</p>
                )}

            </form>

        </div>
    </div>

    )

}

export default CreateAccount