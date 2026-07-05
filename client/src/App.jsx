import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskName, setNewTaskName] = useState('')

  // Fetch all tasks on page load
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Fetch error:', err))
  }, [])

  // Add a new task
  const addTask = () => {
    if (!newTaskName.trim()) return

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTaskName })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask])
        setNewTaskName('')
      })
      .catch(err => console.error('Add task error:', err))
  }

  // Mark a task as done (or undo)
  const markDone = (id) => {
  fetch(`http://localhost:3000/tasks/${id}/done`, {
    method: 'PUT'
  })
    .then(res => res.json())
    .then(updatedTask => {
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ))
    })
    .catch(err => console.error('Mark done error:', err))
}

  // Delete a task
  const deleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id))
      })
      .catch(err => console.error('Delete error:', err))
  }

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Add Task Form */}
      <input
        type="text"
        placeholder="Enter a new task..."
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.name}
            </span>
            <button onClick={() => markDone(task.id)}>
              {task.done ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App