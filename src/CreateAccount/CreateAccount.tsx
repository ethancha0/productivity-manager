import {useState} from 'react'

function CreateAccount(){

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")


    const passwordsMatch = confirm.length > 0 && password === confirmPassword;

    function handleSubmit(){
        //clear input 


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
                    className = "w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3"
                    placeholder = "Re-type Password"
                    value = {confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                    aria-invald = {confirm.length > 0 && !passwordsMatch}
                    ></input>
                </div>

                


                
               {/* Row 3 */}
                <button 
                className = "block mx-auto w-full border border-neutral-700 py-3"
                disabled = {!passwordsMatch || password.length === 0}>  
                    Submit
                </button>

            </form>

        </div>

    )

}

export default CreateAccount