import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskName, setNewTaskName] = useState('')
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Fetch error:', err))
  }, [token])

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.token) {
      setToken(data.token)
      setMessage('')
    } else {
      setMessage('Login failed!')
    }
  }

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
  }

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
  }

  const deleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id))
      })
  }

  if (!token) {
    return (
      <div>
        <h1>Task Manager</h1>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <button onClick={() => setToken(null)}>Logout</button>
      <input
        type="text"
        placeholder="Enter a new task..."
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
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