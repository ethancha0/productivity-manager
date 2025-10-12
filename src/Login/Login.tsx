import {useState} from 'react'

const API = import.meta.env.VITE_API_BASE;


function Login(){

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    /*
    function handleSubmit(e: React.FormEvent){
        //prevent refresh
        e.preventDefault();

        console.log("loggin to server!")

        //send data to backend
        async function sendLogin(){
            try{
                const res = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include", // required for session cookie
                    body: JSON.stringify({userName, password}), // convert JS obj to dict
                    
                });
                const r = fetch("http://127.0.0.1:5000/welcome", { credentials: "include" });
                console.log(r)

                const data = await res.json(); // read server response
                console.log("saved: ", data)
            }
            catch(err){
                console.error("error logging", err)
            }
        }

        // call function to send data to backend
        sendLogin()
    
    }
    */

    async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    // 1) Login (sets session cookie)
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // required for session cookie
      body: JSON.stringify({ userName, password }), // keys must match Flask
    });

    const loginBody = await res.text(); // read something even on errors
    if (!res.ok) {
      throw new Error(`Login failed (${res.status}): ${loginBody}`);
    }
    console.log("login ok:", loginBody);

    
    // 2) Verify session with user stats
    const w = await fetch("http://127.0.0.1:5000/stats", {
      method: "GET",
      credentials: "include",
    });
    const userStats = await w.text();
    console.log("userStats says:", userStats);
    
    
    // (optional) set app state based on welcomeText, e.g. setLoggedIn(true)
  } catch (err) {
    console.error("error logging in:", err);
  }
  
}



    return(
        <div>
            <h1>Login</h1>
        <form onSubmit = {handleSubmit} >
            <p>Username</p>
            <input
            type="text"
            value = {userName}
            onChange = {(e) => setUserName(e.target.value)}
            ></input>

            <p>password</p>
            <input
            type="password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            ></input>


        <button
            type="submit"
            >Submit
        </button>

        </form>


        </div>
    )

}

export default Login