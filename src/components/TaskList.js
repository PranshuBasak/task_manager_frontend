import { useEffect, useState } from 'react';
import Task from './Task'
import TaskForm from './TaskForm'
import { toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../App';
import loadingImg from "../assets/loader.gif";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    completed: false
  })
  const [isEdit, setIsEdit] = useState(false)
  const [taskID, setTaskID] = useState([])

  const {name} = formData;
  const handleInputChange = (e) =>{
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value})
  }

  const createTask = async (e) =>{
    e.preventDefault();
    if(name === ""){
      return toast.error("Input form cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData)
      toast.success("Task added succesfully")
      setFormData({ ...formData, name: ""})
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getTasks = async() =>{
    setIsLoading(true);
    try {
      const {data} = await axios.get(`${URL}/api/tasks`)
      setTasks(data)
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
    
  }

  useEffect(() =>{
    getTasks();
  }, [])

  const deleteTask = async (id) =>{
    try {
      await axios.delete(`${URL}/api/tasks/${id}`)
      toast.success("Task deleted")
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const editTask = async (task) =>{
    setFormData({name: task.name, completed: false})
    setTaskID(task._id)
    setIsEdit(true)
  }

  const updateTask = async (e) =>{
    e.preventDefault();
    if(name === ""){
      return toast.error("Empty Task cannot be added")
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData)
      toast.info("Task Edited")
      setFormData({...formData,name: ""})
      setIsEdit(false);
      getTasks()
    } catch (error) {
      toast.error(error.message);
    }
  }

  const setComplete = async (task) =>{
    const newData = {
      name: task.name,
      completed: true
    }
    
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newData)
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  } 

  useEffect(() =>{
    const cTask = tasks.filter((tasks) =>{
      return tasks.completed === true
    })
    setCompletedTask(cTask)
  }, [tasks])

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm 
      name={name} 
      handleInputChange={handleInputChange} 
      createTask={createTask}
      isEditing={isEdit}
      updateTask={updateTask}
      />
      {tasks.length > 0 && (<div className='--flex-between --pb'>
        <p>
          <b>Total Tasks: </b> {tasks.length}
        </p>
        <p>
          <b>Completed Task: </b> {completedTask.length}
        </p>
      </div>)}
      <hr />
      {
        isLoading && (
          <div className='.--flex-center'>
              <img src={loadingImg} alt="loading"/>
          </div>
        )
      }
      {
        !isLoading && tasks.length === 0 ? (
          <p className='--py'>No Task Found, Add a Task</p>
        ) : (
          <>
            {tasks.map((task,index) =>{
              return (
                <Task 
                  key={task._id} 
                  task={task} 
                  index={index} 
                  deleteTask={deleteTask} 
                  editTask={editTask}
                  setComplete={setComplete}
                  />
              )
            })}
          </>
        )
      }
    </div>
  )
}

export default TaskList