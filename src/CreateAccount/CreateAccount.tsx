import {useState} from 'react'

function CreateAccount(){

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")


    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    function handleSubmit(e){
        //prevent refresh
        e.preventDefault();
        
        if(userName == "" || email == "" || password == "" || confirmPassword == ""){
            alert("missing text field(s)");
            return
        }

        console.log("sending to server!")
        console.log(userName, email, password, )

       

        //send data to backend
        async function sendAccountInfo(){
            try{
                const res = await fetch("http://127.0.0.1:5000/submit_accountinfo", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({userName, email, password, confirmPassword}) // convert JS obj to dict
                });

                const data = await res.json(); // read server response
                console.log("saved: ", data)
            }
            catch(err){
                console.error("error saving account info", err)
            }
        }

        // call function to send data to backend
        sendAccountInfo()
    
    }


    return(
        <div className="flex flex-col items-center outline-orange-500 outline m-6 font-mono font-semibold">
            <h1 className="p-16">
                Create Account
            </h1>
            <p>
                Already have an account? <a href ="">Sign in</a>
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


                {/* inline invalid password error */}
                {confirmPassword.length > 0 && confirmPassword != password && (
                    <p>passwords don't match BRUH</p>
                )}

            </form>

        </div>

    )

}

export default CreateAccount