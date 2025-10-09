import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton";
import LoadingScreen from "./LoadingScreen";



const Home=(props)=>{
    const { userData, setTaskData} = props;
    const navigate = useNavigate();
    const [taskValue,setTaskValue]=useState(''); //This is the value of the input box
    const handleAddedTask=()=>{
        const description=taskValue;
        setTaskValue('');
        fetch(`http://localhost:3004/tasks/`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id:props.userData.user_id,description})
        }).then(response => response.json()).then((data)=>{
            props.setTaskData(prev => [...prev, data.newTask])
        })
    }

        const handleCompletion=(e)=>{
            const updatedTasks=props.taskData.map((item)=>{
                if(item.task_id===e.target.id)
                {
                    return {...item,completed:true};
                }
                else
                {
                    return item;
                }
            })
            const selectedTask=updatedTasks.find((item)=>{
                    return item.task_id===e.target.id
                })
            props.setTaskData(updatedTasks);
            console.log(selectedTask);
            setTaskValue('');
            fetch(`http://localhost:3004/tasks/${selectedTask.task_id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedTask)
            }).then(response => response.json()).then((data)=>{
                console.log(data);
            })
        }

    useEffect(() => {
        console.log(userData?.user_id);
        if (!userData?.user_id) return;

        fetch(`http://localhost:3004/tasks/user/${userData.user_id}`, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then((data) => {

                console.log(data);
                if (!data.tasks) {
                    setTaskData([]);
                } else {

                    setTaskData(data.tasks);
                }
            });
    }, [userData?.user_id, setTaskData]);


    return(

        <div className="bg-gray-900 min-h-screen">
            {(userData?.user_id)?<>
            <div className="flex flex-col text-white items-center w-full">
                <h2 className="m-3 font-bold p-5">Welcome {props.userData.name}!</h2>
                <LogoutButton setIsLoggedIn={props.setIsLoggedIn}/>
                <input onChange={(e) => {
                    setTaskValue(e.target.value);
                }} value={taskValue} className=" w-1/2 p-3 text-black"/>
                <button onClick={handleAddedTask} className="p-3 m-3 rounded-full bg-slate-600">Add Task</button>
            </div>
            <div className="w-full flex justify-end">
            <button onClick={() => {
                navigate('/completed-tasks')
            }} className="mr-[19rem] p-3 text-white rounded-full bg-slate-600">Show Completed Tasks
            </button>
            </div>

            <div className=" text-white flex flex-col items-center justify-center">
                <h2 className="font-bold p-2">Your tasks:</h2>
                {props.taskData && props.taskData.length !== 0 ?
                    <table className="w-4/6 border-separate border-spacing-2 border ">
                        <thead>
                        <tr>

                            <th className=" p-4 text-white border ">Task</th>
                            <th className="  text-white border ">Date Created</th>
                            <th className="w-1 p-4 text-white border ">Mark Completed</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...props.taskData].filter((item) => !item.completed).sort((a, b) => a.date_created.localeCompare(b.date_created)).map(task => (
                            <tr key={task.task_id}>
                                <td className="text-white text-center border">{task.description}</td>
                                <td className=" text-white text-center border">{new Date(task.date_created).toLocaleString()}</td>
                                <td className="flex justify-center"><input
                                    id={task.task_id}
                                    type="checkbox"
                                    className="appearance-none w-12 h-12 border border-white-300 rounded shadow
                                 checked: checked:after:content-['✔']
                                 checked:after:text-white checked:after:text-xl
                                 checked:after:flex checked:after:items-center checked:after:justify-center
                                 checked:after:w-full checked:after:h-full"
                                    onChange={handleCompletion}
                                /></td>
                            </tr>
                        ))}

                        </tbody>

                    </table> : <div className="text italic">No tasks found</div>}
            </div></>:<LoadingScreen/>}
        </div>

    )
}


export default Home;