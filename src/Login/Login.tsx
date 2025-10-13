import {useState} from 'react'

//const API = import.meta.env.VITE_API_BASE;
import {API} from "../api"
import {useNavigate} from "react-router-dom"
import Spinner from '../Animations/Spinner'
import Blur from '../Animations/BlurText'


function Login(){
    const nav = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);



    async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {

    // show loading spinner 
    setLoading(true);

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
    const w = await fetch(`${API}/stats`, {
      method: "GET",
      credentials: "include",
    });
    const userStats = await w.text();
    console.log("userStats says:", userStats);
    
    
    // nav to dashboard
    nav("/dashboard", {replace: true});
  }
  
  catch (err) {
    console.error("error logging in:", err);
    alert("invalid credentials")
  }
  setLoading(false);
}



    return(
        <div className="min-h-screen w-screen flex items-center justify-center px-4">
          <div className="flex flex-col items-center m-6  font-semibold border border-8  border-[#8e8db5]  bg-[#283848] backdrop-blur ring-1 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.25),0_0_40px_10px_rgba(56,189,248,.18)]
      rounded-3xl p-8 m-32
      hover:ring-2 hover:ring-sky-300/35 hover:shadow-[0_0_30px_8px_rgba(56,189,248,.18)]
      transition">
               <Blur
                text="Login"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-6xl p-16"
                />
          <form onSubmit = {handleSubmit} >
              <p>Username</p>
              <input
              className="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
              type="text"
              value = {userName}
              onChange = {(e) => setUserName(e.target.value)}
              ></input>

              <p>Password</p>
              <input
              className="w-full rounded-full border border-neutral-700 bg-neutral-800/60 px-5 py-3 shadow-inner placeholder-neutral-400 focus:outline-none focus:ring-2"
              type="password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              ></input>


          <button
              type="submit"
              >Submit
          </button>
          {loading && <Spinner/>}

          </form>


          </div>
        </div>
    )

}

export default Login