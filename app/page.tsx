"use client"
import { useEffect, useState } from 'react';
import { Task } from '@/components/task';
import { sampleTasks } from '@/components/simpleTasks';
import TaskCard from '@/components/taskCard';
import ListItem from '@/components/listItem';
import axios from 'axios';
import AddItemMessage from '@/components/AddItemMessage';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
    const [viewChoice, setViewChoice] = useState('list');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
    const [csrfToken, setCsrfToken] = useState('');
    const [isTitleOfValidLength, setIsTitleOfValidLength] = useState(true);
    const [isDescriptionOfValidLength, setIsDescriptionOfValidLength] = useState(true);
    const [isStatusProvided, setIsStatusProvided] = useState(true);
  
    const getCsrfToken = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get-csrf-token/');
            const CSRFToken = response.data.csrfToken; // Adjust this based on your Django response structure
            setCsrfToken(CSRFToken);
        } catch (error) {
            console.error('Error obtaining CSRF token:', error);
            return null;
        }
    }

    const getTasks = async () => {
      try{
        if(csrfToken === ''){
          await getCsrfToken();
        }
        const config = {
          headers : {
            'X-CSRFToken' : csrfToken, 
          }, 
        };
        const tasksFromDB = (await axios.get('http://localhost:8000/tasks/', config)).data as Task[];
        console.log(tasksFromDB);
        setTasks([...tasksFromDB]);
      }catch(error){
        console.log(error);
      }
    } 

    const shiftTaskToNextCol = async (event: React.MouseEvent<HTMLButtonElement>, key : number) => {
        try{
          if(csrfToken === ''){
            await getCsrfToken();
          }
          const config = {
            headers : {
              'X-CSRFToken' : csrfToken, 
            }, 
          };
          let task = tasks.find((task) => task.id === key) as Task;
          let updatedStatus = (task.status === 'To Do' ? 'In Progress' : 'Done');
          const statusUpdate = {
            status : updatedStatus
          };
          await axios.patch(`http://localhost:8000/tasks/${key}/update/`, statusUpdate, config);
          const tasksFromDB = (await axios.get('http://localhost:8000/tasks/', config)).data as Task[];
          setTasks(tasksFromDB);
          await getTasks();
        }catch(error){
          console.log(error);
        }
    }

    const markTaskAsDone = async (event : React.MouseEvent<HTMLButtonElement>, key : number) => {
      try{
        if(csrfToken === ''){
          await getCsrfToken();
        }
        const config = {
          headers : {
            'X-CSRFToken' : csrfToken, 
          }, 
        };

        const statusUpdate = {
          status : 'Done'
        };

        await axios.patch(`http://localhost:8000/tasks/${key}/update/`, statusUpdate, config);
        const tasksFromDB = (await axios.get('http://localhost:8000/tasks/', config)).data as Task[];
        setTasks(tasksFromDB);
      }catch(error){
        console.log(error);
      }
    }

    const removeTask = async (event : React.MouseEvent<HTMLButtonElement>, key : number) => {
      try{
        if(csrfToken === ''){
          await getCsrfToken();
        }
        const config = {
          headers : {
            'X-CSRFToken' : csrfToken, 
          }, 
        };
        console.log(config);
        const response = await axios.delete(`http://localhost:8000/tasks/${key}/delete/`, config);
        console.log(response);
        const tasksFromDB = (await axios.get('http://localhost:8000/tasks/', config)).data as Task[];
        setTasks(tasksFromDB);
      }catch(error){
        console.log(error);
      }
    }

    const changeViewToBoard = async () => {
      try{
        setViewChoice('board');
        await getTasks();
      }catch(error){
        console.log(error);
      } 
    }

    const changeViewToList = async () => {
      try{ 
        setViewChoice('list');
        setSelectedStatusFilter('All'); 
        await getTasks();
      }catch(error){
        console.log(error);
      }
    }

    const toggleShowForm = () => {
        setShowForm(!showForm);
    }

    const handleTaskTitleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      setIsTitleOfValidLength(true);  
    }
    
    const handleDescriptionChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
        setIsDescriptionOfValidLength(true);
    }

    const nextId = () => {
        let max_id = 0;
        console.log(tasks);
        for(let taskItem = 0; taskItem < tasks.length; taskItem++){
            if(tasks[taskItem].id > max_id)
                max_id = tasks[taskItem].id;
        }
        console.log(max_id + 1);
        return max_id + 1;
    }

    const isFormInvalid = () => {
      // Validation of Task Title
      if(title === '' || title.length >= 30 ) {
        setIsTitleOfValidLength(false);
        return false;
      }

      // Validation of Description 
      if(description === '' || description.length >= 50){
        setIsDescriptionOfValidLength(false);
        return false;
      }

      // Validation of Status
      if(status === ''){
        setIsStatusProvided(false);
        return false;
      }

      return true;
    }

    const handleSubmitForm = async (event : React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        if(isFormInvalid()){
          try{
            if(csrfToken === ''){
              await getCsrfToken();
            }
            const config = {
              headers : {
                'X-CSRFToken' : csrfToken, 
              }, 
            };
            let newTask = {
                id : nextId(), 
                title : title,
                description : description,
                status : status
            } as Task;
            console.log(newTask);
            const responseFromPost = await axios.post('http://localhost:8000/create/', newTask, config);
            console.log(responseFromPost);
            const tasksFromDB = (await axios.get('http://localhost:8000/tasks/', config)).data as Task[];
            setTasks([...tasksFromDB])
            setTitle("");
            setDescription("");
            setStatus("");
            setShowForm(false);
          }catch(error){
            console.log(error);
          }
          return;
        }  
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
        <p className = 'welcomeMessage'> What are we trying to get done today?</p>
        <div className = 'tasksContainer'>
            { 
                viewChoice == 'list'
                    && 
                <div className = 'filterDropDown'>
                        Filter by Status:
                        <select
                            value={selectedStatusFilter}
                            onChange={(e) => setSelectedStatusFilter(e.target.value)}
                            className = 'statusDropDownFilter'
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
                          {
                            tasks.length == 0 
                            ?
                            <AddItemMessage/>
                            :
                            <>
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
                            </>
                          }
                        </div>
                    :
                        <div className = 'listLayout'>
                          {
                            tasks.length === 0 
                            ?
                            <AddItemMessage/>
                            :
                            <>
                              <div className = 'listLabelRow'>
                                  <div className = 'listSerialNo'>#</div>
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
                            </>
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
                <p className = 'formMessage'>
                  Fill the form below to create a Task
                </p>
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
                            { !isTitleOfValidLength && <ErrorMessage text='Please keep the title to be withing 1 to 30 characters.'/>}
                        </label>
                        <label className = 'formInputField'>
                            Description
                            <input 
                                type='text'
                                placeholder='what are we doing?'
                                value = {description}
                                onChange={handleDescriptionChange}>
                            </input> 
                            { !isDescriptionOfValidLength && <ErrorMessage text='Please keep the Description to be withing 1 to 50 characters.'/>}

                        </label>
                        <div className = 'formInputField'>
                            Status
                            { !isStatusProvided && <ErrorMessage text='Please provide the current status of the task.'/>}
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
