"use client"
import {useState, useEffect, } from 'react';
import { Task } from '@/components/task';
import { sampleTasks } from '@/components/simpleTasks';
import TaskCard from '@/components/taskCard';


export default function Tasks(){
    const [viewChoice, setViewChoice] = useState('board');
    const [tasks, setTasks] = useState<Task[]>(sampleTasks);

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
    }

    return <div className = "taskScreen">
        <p className = 'welcomeMessage'> Hey there, what are we trying to get done today?</p>
        <div className = 'tasksContainer'>
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
                            <div className = 'inProgressCol'>
                                <p className = 'colHeading'> In Progress </p>
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
                            <div className = 'doneCol'>
                                <p className = 'colHeading'> Done </p>
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
                    :
                        <>
                        </>
                }
            </div>
        </div>
        <button className = "addNewTaskButton">
            +
        </button>
    </div>
}