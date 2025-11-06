import React from 'react';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const [credentialsCheck,setCredentialsCheck]=useState(true);
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        if(!credentialsCheck){
            setCredentialsCheck(true);
        }
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        if(!credentialsCheck){
            setCredentialsCheck(true);
        }
        setPassword(e.target.value);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setCredentialsCheck(true);
        fetch("https://user-service-br5f.onrender.com/users/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password })
        }).then(async (response)=>{
            if (response.ok) {
                const data = await response.json();
                if(data.user)
                    {
                        props.setIsLoggedIn(true);
                        props.setUserData(data.user);
                            navigate("/home");
                    }
            }
            else{
                setCredentialsCheck(false);
            }
        }).catch(() => {
            // show generic “server unreachable” state if you have one
            setCredentialsCheck(false);
        });
    }


    return (
        <div
            style={{backgroundImage: "url('/background.jpg')"}}
            className="h-screen w-full flex items-center justify-center bg-cover bg-center"
        >
            <div className="w-full max-w-[380px] bg-slate-700 px-4 py-5 sm:p-6 md:p-10 ">
                <form onSubmit={handleFormSubmit}>
                    <label className="pt-3 text-center form-elements" htmlFor="email">Email</label>
                    <input onChange={handleEmailChange} className=" h-8 text-black form-elements" value={email}
                           type="email" id="email" name="email"/>
                    <label className="pt-3 text-center form-elements" htmlFor="password">Password</label>
                    <input onChange={handlePasswordChange} className="h-8 text-black form-elements" value={password}
                           type="password" id="password" name="password"/>
                    {!credentialsCheck &&
                        <label className=" pt-3 text-center form-elements">Email or password does not match. Try
                            again</label>}
                    <div className=" flex items-center justify-center m-5">
                        <button className="p-3 text-white rounded-full bg-slate-600">Login</button>
                    </div>
                </form>
                <div className="block text-white">New User?</div>
                <button onClick={()=>{
                    navigate('/register');
                }} className="p-3 text-white rounded-full bg-slate-600">Register</button>
            </div>
        </div>
    )
}

export default Login;