import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError('Something went wrong loading tasks.'))
  }, [])

  async function handleCreate(fields) {
    try {
      const newTask = await createTask(fields)
      setTasks(prev => [...prev, newTask])
      setError(null)
    } catch {
      setError('Something went wrong.')
    }
  }

  async function handleUpdate(fields) {
    try {
      const updated = await updateTask(editingTask.id, fields)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setEditingTask(null)
      setError(null)
    } catch {
      setError('Something went wrong.')
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await updateTask(task.id, { completed: !task.completed })
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setError(null)
    } catch {
      setError('Something went wrong.')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      setError(null)
    } catch {
      setError('Something went wrong.')
    }
  }

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <TaskForm
        onSubmit={editingTask ? handleUpdate : handleCreate}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
      />

      {error && <p className="error">{error}</p>}

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={setEditingTask}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App
