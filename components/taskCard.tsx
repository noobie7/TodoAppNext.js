'use client';
import { useState } from 'react';
import { Task } from './task';

interface TaskCardProps{
    task : Task, 
    shiftTask: (event: React.MouseEvent<HTMLButtonElement>,key : number) => void, 
    markTaskAsDone : (event: React.MouseEvent<HTMLButtonElement>, key : number) => void, 
    removeTask : (event: React.MouseEvent<HTMLButtonElement>, key : number) => void,
}

export default function TaskCard({task, shiftTask, removeTask, markTaskAsDone} : TaskCardProps){
    return <div className = 'taskCard'>
        <div className='taskCardTopRow'>
            <p className = 'serialNo'>{task.id}</p>
            <p className = 'taskTitle'>{task.title}</p>
        </div>
            <p className = 'taskDescription'>{task.description}</p>
        <div className = 'taskCardButtonRow'>
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