const CompletedTasks = (props) => {

    const handleMarkNotCompleted = (e) => {
        const updatedTasks=props.taskData.map((item)=>{
            if(item.task_id===e.target.id)
            {
                return {...item,completed:false};
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
        fetch(`http://localhost:3004/tasks/${selectedTask.task_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedTask)
        }).then(response => response.json()).then((data)=>{
            console.log(data);

        })
    }
    return(
    <div className=" bg-gray-900 min-h-screen text-white flex flex-col items-center ">
        <h2 className="font-bold p-5">Your Completed Tasks:</h2>
        {props.taskData.some(t => t.completed === true)?
            <table className="w-4/6 border-separate border-spacing-2 border ">
                <thead>
                <tr>

                    <th className=" p-4 text-white border ">Task</th>
                    <th className="  text-white border ">Date Created</th>
                    <th className=" p-4 text-white border ">Mark Not Completed</th>
                </tr>
                </thead>
                <tbody>
                {[...props.taskData].filter((item) => item.completed).sort((a, b) => a.date_created.localeCompare(b.date_created)).map(task => (
                    <tr key={task.task_id}>
                        <td className="p-4 text-white border">{task.description}</td>
                        <td className="p-2 text-white border">{new Date(task.date_created).toLocaleString()}</td>
                        <td className="flex justify-center"><input
                            id={task.task_id}
                            type="checkbox"
                            className="appearance-none w-12 h-12 border border-white-300 rounded shadow
                                 checked: checked:after:content-['✔']
                                 checked:after:text-white checked:after:text-xl
                                 checked:after:flex checked:after:items-center checked:after:justify-center
                                 checked:after:w-full checked:after:h-full"
                            onChange={handleMarkNotCompleted}
                        /></td>
                    </tr>
                ))}

                </tbody>

            </table> : <div className="text italic">No tasks found</div>}
    </div>
    )
}

export default CompletedTasks;