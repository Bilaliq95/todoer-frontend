import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


const Register = (props) => {
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const [name, setName]=useState("");
    const [phone_number, setPhone_Number]=useState("");
    const [userStatusCheck,setUserStatusCheck]=useState(false);
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        if(userStatusCheck){
            setUserStatusCheck(!userStatusCheck);
        }
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handlePhoneNumberChange = (e) => {
        setPhone_Number(e.target.value);
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3002/users/register", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({name:name,email: email, password: password, phone_number:phone_number})
        }).then(response => {
            console.log(response);
            if (response.ok) {
                setUserStatusCheck(false);
                navigate("/login");
            }
            else if (response.status === 400 || response.status === 409)
                {
                    setUserStatusCheck(true);
                }
            else{
                setUserStatusCheck(false);
            }
        })
    };
    return (
        <div
            style={{backgroundImage: "url('/background.jpg')"}}
            className="h-screen w-full flex items-center justify-center bg-cover bg-center"
        >
            <div className="w-full max-w-md bg-slate-700 sm:p-6 md:p-10 lg:p-10 ">
                <form onSubmit={handleFormSubmit}>
                    <label className="pt-3 text-center form-elements" htmlFor="name">Name</label>
                    <input onChange={handleNameChange} className="h-8 text-black form-elements" type="text" id="name" name="name"/>
                    <label className="pt-3 text-center form-elements" htmlFor="email">Email</label>
                    {userStatusCheck && <label className="pt-3 text-center form-elements">Email Already Exists</label>}
                    <input onChange={handleEmailChange} className="h-8 text-black form-elements" type="email" id="email" name="email"/>
                    <label className="pt-3 text-center form-elements" htmlFor="password">Password</label>
                    <input onChange={handlePasswordChange} className="h-8 text-black form-elements" type="password" id="password" name="password"/>
                    <label className="pt-3 text-center form-elements" htmlFor="phone_number">Phone</label>
                    <input onChange={handlePhoneNumberChange} className="h-8 text-black form-elements" type="text" id="phone_number" name="phone_number"/>
                    <div className=" flex items-center justify-center m-5">
                        <button className="p-3 text-white rounded-full bg-slate-600">Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;