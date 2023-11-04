'use client';
import {useState, useEffect} from 'react';
import {Task} from './task';

interface ListItemProps{
    task : Task, 
    shiftTask : (event : React.MouseEvent<HTMLButtonElement>, key : number) => void,
    markTaskAsDone : (event : React.MouseEvent<HTMLButtonElement>, key : number) => void,
    removeTask : (event : React.MouseEvent<HTMLButtonElement>, key : number) => void,
}

export default function ListItem({task, shiftTask, markTaskAsDone, removeTask} : ListItemProps){
    return <div className = 'listItem'>
        <div className = 'listSerialNo'>{task.id}</div>
        <div className = 'listTaskTitle'>{task.title}</div>
        <div className = 'listTaskDescription'>{task.description}</div>
        <div className = 'listButtonRow'>
            {
                (task.status === 'In Progress' || task.status === 'To Do' ) 
                && 
                <button onClick = {(e) => markTaskAsDone(e, task.id)}>✅</button>
            }
            {
                (task.status === 'In Progress' || task.status === 'To Do' || task.status === 'Done') 
                && 
                <button onClick = {(e) => removeTask(e, task.id)}>❎</button>
            }
            {
                (task.status === 'To Do' ) 
                &&
                <button onClick={(e) => shiftTask(e, task.id)}>➡️</button>
            }
        </div>
    </div> 
}