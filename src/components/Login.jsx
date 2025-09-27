import React from 'react';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3002/users/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({email: email, password: password})
        }).then(response => response.json()).then((data)=>{
            if(data.user)
            {
                props.setUserData(data.user);
                fetch(`http://localhost:3004/tasks/user/${data.user.user_id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => response.json()).then((data)=>{
                    if(!data.tasks)
                    {
                        props.setTaskData([]);
                    }
                    else{
                        props.setTaskData(data.tasks);
                    }
                    navigate("/home");
                })


            }
        })

    }


    return (
        <div
            style={{backgroundImage: "url('/background.jpg')"}}
            className="h-screen w-full flex items-center justify-center bg-cover bg-center"
        >
            <div className="w-full max-w-md bg-slate-700 sm:p-6 md:p-10 lg:p-10 ">
                <form onSubmit={handleFormSubmit}>
                    <label className="form-elements" htmlFor="email">Email</label>
                    <input onChange={handleEmailChange} className="text-black form-elements" value={email} type="email" id="email" name="email"/>
                    <label className="form-elements" htmlFor="password">Password</label>
                    <input onChange={handlePasswordChange} className="text-black form-elements" value={password} type="password" id="password" name="password"/>
                    <div className=" flex items-center justify-center m-5">
                        <button className="bg-fuchsia-50 p-1">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;