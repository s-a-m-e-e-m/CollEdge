import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { LuPencil } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { createTaskLink, deleteTaskLink, getTasksLink, updateTaskLink } from '../utils/links';

const Home = () => {
  const [taskInputs, setTaskInputs] = useState([{ id: 1, value: '', dueDate: '' }]);
  const { user, loading, setLoading } = useContext(AuthContext);
  const [tasks, setTasks] = useState(['Add your first task!']);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingStatus, setEditingStatus] = useState('pending');

  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getTasksLink, { withCredentials: true });
      setTasks(response?.data?.tasks || ['Add your first task!']);
    } catch (error) {
      setTasks(['Add your first task!']);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    fetchTasks();
  }, [user]);

  const handleInputChange = (id, value) => {
    setTaskInputs((prev) =>
      prev.map((task) => (task.id === id ? { ...task, value } : task))
    )
  }

  const handleDueDateChange = (id, dueDate) => {
    setTaskInputs((prev) =>
      prev.map((task) => (task.id === id ? { ...task, dueDate } : task))
    )
  }

  const addInputField = () => {
    setTaskInputs((prev) => [...prev, { id: Date.now(), value: '', dueDate: '' }]);
  }

  const removeInputField = (id) => {
    setTaskInputs((prev) => {
      if (prev.length === 1) return prev

      return prev.filter((task) => task.id !== id)
    })
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${deleteTaskLink}/${taskId}`, { withCredentials: true });
      fetchTasks();
    } catch (error) {
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const cleanedTasks = taskInputs
      .map((task) => ({ title: task.value.trim(), dueDate: task.dueDate || null }))
      .filter(Boolean);
    try {
      setLoading(true);
      const response = await axios.post(createTaskLink, { tasks: cleanedTasks }, { withCredentials: true });
      fetchTasks();
    } catch (error) {
      return;
    } finally {
      setLoading(false);
      setTaskInputs([{ id: 1, value: '', dueDate: '' }]);
    }
  }

  const startEditingTask = (task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title || '');
    setEditingDescription(task.description || '');
    setEditingDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setEditingStatus(task.status || 'pending');
  }

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingDescription('');
    setEditingDueDate('');
    setEditingStatus('pending');
  }

  const updateTask = async (e, taskId) => {
    e.preventDefault(); 

    try {
      setLoading(true);
      await axios.put(
        `${updateTaskLink}/${taskId}`,
        {
          title: editingTitle,
          description: editingDescription,
          dueDate: editingDueDate || null,
          status: editingStatus,
        },
        { withCredentials: true }
      );
      fetchTasks();
    } catch (error) {
      return;
    } finally { 
      cancelEditingTask();
      setLoading(false); 
    }
  }

  if (loading) {
    return <p>Loading your tasks...</p>
  }

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[calc(100vh-2rem)] bg-slate-950 text-slate-100">

      {/* Main Content */}
      <div className="w-full md:basis-4/5 p-4 sm:p-6 lg:p-10">
        {tasks?.length === 0 ? (
          <p className="text-center text-slate-400 text-lg font-medium">
            No tasks found. Add some tasks!
          </p>
        ) : (
          <div className='w-full flex flex-col gap-4'>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Tasks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <section className="flex flex-col justify-between border border-slate-700 bg-slate-900/70 shadow-md p-5 rounded-lg hover:shadow-lg transition-shadow w-full h-full" key={index}>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full
      ${task.status === "pending" ? "bg-yellow-500 text-black" :
                        task.status === "in-progress" ? "bg-blue-500 text-white" :
                          "bg-green-500 text-white"}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Task Title */}
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="flex items-center gap-2 font-semibold text-lg">
                      <span className="font-semibold text-xl">{task.title}</span>
                      <button className="hover:text-blue-500 cursor-pointer transition" onClick={() => startEditingTask(task)}>
                        <LuPencil />
                      </button>
                    </span>

                    {editingTaskId === task._id && (
                      <form onSubmit={(e) => updateTask(e, task._id)} className="mt-2 grid gap-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-slate-700 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                          placeholder="Task title"
                          required
                        />
                        <textarea
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          className="bg-slate-700 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 min-h-24 resize-y"
                          placeholder="Task description"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={editingDueDate}
                            onChange={(e) => setEditingDueDate(e.target.value)}
                            className="bg-slate-700 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                          />
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            className="bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-md"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingTask}
                            className="bg-slate-700 hover:bg-slate-600 cursor-pointer text-white p-2 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {task.description ? (
                      <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
                    ) : null}
                  </div>

                  {/* dueDate */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-slate-300">
                      {task.dueDate ? task.dueDate.slice(0, 10) : "No dueDate"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-600 cursor-pointer text-white p-2 rounded-md font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* Add New Task */}
        <h2 className="text-xl sm:text-2xl font-bold mt-10">Add New Task</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4">
          {taskInputs.map((task, index) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="text"
                value={task.value}
                onChange={(e) => handleInputChange(task.id, e.target.value)}
                placeholder={`Task ${index + 1}`}
                className="flex-1 bg-slate-800 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
              />

              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleDueDateChange(task.id, e.target.value)}
                className="border border-slate-500 bg-slate-900 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              />

              <button
                type="button"
                onClick={() => removeInputField(task.id)}
                disabled={taskInputs.length === 1}
                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">
                Remove
              </button>
            </div>
          ))}

          <section className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={addInputField}
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-4 rounded-md">
              + Add another field
            </button>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 cursor-pointer text-white  font-bold py-2 px-4 rounded-md"
              disabled={loading}>
              Save Tasks
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default Home;