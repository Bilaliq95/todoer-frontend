import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton";
import LoadingScreen from "./LoadingScreen";



const Home=(props)=>{
    const { userData, taskData, setTaskData, setIsLoggedIn, setUserData } = props;
    const navigate = useNavigate();
    const [taskValue,setTaskValue]=useState(''); //This is the value of the input box

    const handleDeleteTask=(e)=>{
        const selectedTask=taskData.find((item)=>{
            return item.task_id===e.target.id
        })
        const updatedTasks=taskData.filter((item)=>(item.task_id!==e.target.id));
        setTaskData(updatedTasks);

        setUserData(prev => ({
            ...prev,
            task_count: Math.max((prev.task_count || 1) - 1, 0),
        }));

        fetch(`https://todoer-backend-9xwq.onrender.com/tasks/${selectedTask.task_id}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userData.user_id, // add this line
            }),
        }).then(response => response.json()).then((data)=>{
            console.log(data);
        })

    }
    const handleAddedTask=()=>{
        const description=taskValue;
        if(!description){
            return;
        }
        setTaskValue('');
        fetch(`https://todoer-backend-9xwq.onrender.com/tasks/`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id:userData.user_id,description})
        }).then(response => response.json()).then((data)=>{
            setTaskData(prev => [...prev, data.newTask])
            setUserData(prev => ({
                ...prev,
                task_count: (prev.task_count || 0) + 1,
            }));
        })
    }

        const handleCompletion=(e)=>{
            const updatedTasks=taskData.map((item)=>{
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
            setTaskData(updatedTasks);
            fetch(`https://todoer-backend-9xwq.onrender.com/tasks/${selectedTask.task_id}`, {
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
        if (!userData?.user_id) return;

        fetch(`https://todoer-backend-9xwq.onrender.com/tasks/user/${userData.user_id}`, {
            method: "GET",
            credentials: 'include',
        })
            .then(response => response.json())
            .then((data) => {

                //console.log(data);
                if (!data.tasks) {
                    setTaskData([]);
                    setUserData(prev => ({ ...prev, task_count: 0 }));
                } else {
                    setTaskData(data.tasks);
                    setUserData(prev => ({ ...prev, task_count: data.tasks.length }));
                }
            });
    }, [userData?.user_id, setTaskData,setUserData]);

    // runs on every render
    const pending = taskData.filter(t => !t.completed).length;
    const completed = taskData.filter(t => t.completed).length;
    const total = taskData.length;

    return(

        <div className="min-h-screen w-full bg-gray-900">
            {(userData?.user_id)? <>
                <div className="flex flex-col text-white items-center w-full">
                    <h2 className="m-3 font-bold p-5">Welcome {userData.name}!</h2>
                    <div className="flex gap-6 justify-center text-lg text-white mt-4">
                        <div className="bg-slate-700 px-4 py-2 rounded-xl shadow">
                            <span className="font-semibold">Total:</span> {total}
                        </div>
                        <div className="bg-green-700 px-4 py-2 rounded-xl shadow">
                            <span className="font-semibold">Pending:</span> {pending}
                        </div>
                        <div className="bg-blue-700 px-4 py-2 rounded-xl shadow">
                            <span className="font-semibold">Completed:</span> {completed}
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-start sm:justify-end sm:pr-36">
                    <LogoutButton setIsLoggedIn={setIsLoggedIn}/>
                </div>
                <div
                    className="flex flex-col sm:flex-row sm:flex-wrap justify-start sm:justify-center sm:items-center gap-3">
                    <input onChange={(e) => {
                        setTaskValue(e.target.value);
                    }} value={taskValue} className=" p-3 text-black w-full sm:w-1/2"/>
                    <button onClick={handleAddedTask}
                            className="text-white p-3 my-2 rounded-full bg-slate-600 w-full sm:w-auto">Add Task
                    </button>
                    <button onClick={() => {
                        navigate('/completed-tasks')
                    }} className="p-3 text-white rounded-full bg-slate-600 w-full sm:w-auto">Show Completed Tasks
                    </button>
                </div>
                <div className=" text-white flex flex-col items-center justify-center">
                    <h2 className="font-bold text-3xl p-2">Your Tasks:</h2>
                    {taskData && taskData.length !== 0 ?
                        <table className="w-4/6 border-separate border-spacing-2 border ">
                            <thead>
                            <tr>

                                <th className="text-white border ">Task</th>
                                <th className="w-3 p-1 text-white border ">Date Created</th>
                                <th className="w-2 p-1 text-white border ">Action</th>
                                <th className="w-1 p-1 text-white border ">Mark Completed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[...taskData].filter((item) => !item.completed).sort((a, b) => a.date_created.localeCompare(b.date_created)).map(task => (
                                <tr key={task.task_id}>
                                    <td className="text-white text-center border">{task.description}</td>
                                    <td className=" text-white text-center border">{new Date(task.date_created).toLocaleString()}</td>
                                    <td className=" text-white text-center">
                                        <button id={task.task_id} onClick={handleDeleteTask}
                                                className="p-2 rounded-full bg-slate-600">Delete
                                        </button>
                                    </td>
                                    <td className="flex justify-center"><input
                                        id={task.task_id}
                                        type="checkbox"
                                        checked={task.completed}
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
                </div>
            </> : <LoadingScreen/>}
        </div>


    )
}


export default Home;