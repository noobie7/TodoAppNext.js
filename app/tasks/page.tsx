"use client"
import { useState } from 'react';
import { Task } from '@/components/task';
import { sampleTasks } from '@/components/simpleTasks';
import TaskCard from '@/components/taskCard';
import ListItem from '@/components/listItem';


export default function Tasks(){
    const [viewChoice, setViewChoice] = useState('list');
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // Initialize with 'All' to show all tasks by default

    const shiftTaskToNextCol = (event: React.MouseEvent<HTMLButtonElement>, key : number) => {
        let task = tasks.find((task) => task.id === key) as Task;
        task.status = (task.status === 'To Do' ? 'In Progress' : 'Done');
        let newTasks = tasks.filter((task) => (task.id != key));
        newTasks.push(task);
        setTasks(newTasks);
    }

    const markTaskAsDone = (event : React.MouseEvent<HTMLButtonElement>, key : number) => {
        let task = tasks.find((task) => task.id === key) as Task;
        task.status = 'Done';
        let newTasks = tasks.filter((task) => task.id !== key);
        newTasks.push(task);
        setTasks(newTasks);
    }

    const removeTask = (event : React.MouseEvent<HTMLButtonElement>, key : number) => {
        let newTasks = tasks.filter((task) => task.id !== key);
        setTasks(newTasks);
    }

    const changeViewToBoard = () => {
        setViewChoice('board');
    }

    const changeViewToList = () => {
        setViewChoice('list');
        setSelectedStatusFilter('All'); 
    };


    const toggleShowForm = () => {
        setShowForm(!showForm);
    }

    const handleTaskTitleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }
    
    const handleDescriptionChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const nextId = () => {
        let max_id = 0;
        for(let taskItem = 0; taskItem < tasks.length; taskItem++){
            if(tasks[taskItem].id > max_id)
                max_id = tasks[taskItem].id;
        }
        return max_id + 1;
    }

    const handleSubmitForm = (event : React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        let newTask = {
            id : nextId(), 
            title : title,
            description : description,
            status : status
        } as Task;
        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
        setStatus("");
        setShowForm(false);
    }

    const handleExitWithoutSaving = () => {
        setTitle("");
        setDescription("");
        setStatus("");
        setShowForm(false);
    }

    const handleExitWithSaving = () => {
        setShowForm(false);
    }

    const handleStatusChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    }

    return <div className = "taskScreen">
        <p className = 'welcomeMessage'> Hey there, what are we trying to get done today?</p>
        <div className = 'tasksContainer'>
            { 
                viewChoice == 'list'
                    && 
                <div className = 'filterDropDown'>
                        Filter by Status:
                        <select
                            value={selectedStatusFilter}
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                </div> 
            }
            <div className = 'viewChoiceButtonRow'>
            <button className = {`viewChoiceButton ${viewChoice == 'list' ? "viewChoice" : ""}`} 
                    onClick={changeViewToList}> List </button>
            <button className = {`viewChoiceButton ${viewChoice == 'board' ? "viewChoice" : ""}`}
                    onClick={changeViewToBoard}> Board </button>
            </div>
            <div className = 'tasks'>
                {
                    viewChoice == 'board' 
                    ?   
                        <div className = 'boardLayout'>
                            <div className = 'todoCol'>
                                <p className = 'colHeading'> To Do </p>
                                <div className = 'listOfTasks'>
                                    {
                                        tasks
                                        .filter((task) => task.status === "To Do" )
                                        .map((task) => 
                                        <TaskCard key = {task.id} 
                                            task = {task} 
                                            shiftTask={shiftTaskToNextCol}
                                            markTaskAsDone={markTaskAsDone}
                                            removeTask={removeTask}/>) 
                                    }
                                </div>
                            </div>
                            <div className = 'inProgressCol'>
                                <p className = 'colHeading'> In Progress </p>
                                <div className = 'listOfTasks'>
                                {
                                    tasks
                                    .filter((task) => task.status === "In Progress" )
                                    .map((task) => <TaskCard key = {task.id} 
                                        task = {task} 
                                        shiftTask={shiftTaskToNextCol}
                                        markTaskAsDone={markTaskAsDone}
                                        removeTask={removeTask}/>) 
                                }
                                </div>
                            </div>
                            <div className = 'doneCol'>
                                <p className = 'colHeading'> Done </p>
                                <div className = 'listOfTasks'>
                                {
                                    tasks
                                    .filter((task) => task.status === "Done" )
                                    .map((task) => <TaskCard key = {task.id} 
                                        task = {task} 
                                        shiftTask={shiftTaskToNextCol}
                                        markTaskAsDone={markTaskAsDone}
                                        removeTask={removeTask}/>) 
                                }
                                </div>
                            </div>
                        </div>
                    :
                        <div className = 'listLayout'>
                            <div className = 'listOptionBar'> 
                            </div>
                            <div className = 'listLabelRow'>
                                <div className = 'listSerialNo'>S. no</div>
                                <div className = 'listTaskTitle'>Title</div>
                                <div className = 'listTaskDescription'>Description</div>
                                <div className = 'listButtonRow'>
                                    Options
                                </div>                                
                            </div>
                            {
                                tasks
                                    .filter((task) => selectedStatusFilter === 'All' || task.status === selectedStatusFilter)
                                    .map((task) => <ListItem 
                                                        key = {task.id}
                                                        task = {task} 
                                                        shiftTask={shiftTaskToNextCol}
                                                        markTaskAsDone={markTaskAsDone}
                                                        removeTask={removeTask}
                                                        />)
                            }
                        </div>
                }
            </div>
        </div>
        <button className = "addNewTaskButton" onClick = {toggleShowForm}>
            +
        </button>
        {
            showForm 
            && 
            <div className = 'formModalContainer'>
                Fill the form below to create a Task
                <form className = 'formBox' onSubmit = {handleSubmitForm}>
                    <div className = 'formInputFieldsCol'>
                        <label className = 'formInputField'>
                            Task
                            <input 
                                type='text'
                                placeholder='what are we doing?'
                                value = {title}
                                onChange={handleTaskTitleChange}>
                            </input> 
                        </label>
                        <label className = 'formInputField'>
                            Description
                            <input 
                                type='text'
                                placeholder='what are we doing?'
                                value = {description}
                                onChange={handleDescriptionChange}>
                            </input> 
                        </label>
                        <div className = 'formInputField'>
                            Status
                            <div className = 'statusInputRow'>
                                <div className = 'statusRadioButton'>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="To Do"
                                        id="To Do"
                                        checked={status === 'To Do'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="To Do"> To Do</label>
                                </div>
                                <div className = 'statusRadioButton'>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="In Progress"
                                        id="In Progress"
                                        checked={status === 'In Progress'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="In Progress"> In Progress</label>
                                </div>
                                <div className = 'statusRadioButton'>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Done"
                                        id="Done"
                                        checked={status === 'Done'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="Done"> Done</label>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className = 'formButtonsCol'>
                        <div className = 'button-card'>
                            <button onClick = {handleExitWithoutSaving}>❌</button>
                            <p className = 'buttonHint'>Exit without saving</p>
                        </div>
                        <div className = 'button-card'>
                            <button onClick = {handleExitWithSaving}>🤔</button>
                            <p className = 'buttonHint'>Exit and save</p>
                        </div>
                        <div className = 'button-card'>
                            <button type='submit'>👍</button>
                            <p className = 'buttonHint'>Submit</p>
                        </div>
                    </div>
                </form>
            </div>
        }
    </div>
}