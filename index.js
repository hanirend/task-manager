const fs = require('fs');
const FILE_PATH = 'tasks.json';

// Load tasks from file
function loadTasks() {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
}

// Save tasks to file
function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// Add a new task
function addTask(name) {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length + 1,
        name: name,
        done: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`✅ Added: "${name}"`);
}

// List all tasks (with optional filter)
function listTasks(filter = null) {
    let tasks = loadTasks();
    
    if (filter === 'done') {
        tasks = tasks.filter(t => t.done);
    } else if (filter === 'pending') {
        tasks = tasks.filter(t => !t.done);
    }
    
    if (tasks.length === 0) {
        console.log("📭 No tasks found.");
        return;
    }
    
    console.log("\n📋 Your Tasks:");
    tasks.forEach(task => {
        const status = task.done ? "✅" : "⭕";
        console.log(`${status} ${task.id}. ${task.name}`);
    });
}

// Mark a task as done
function doneTask(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = true;
        saveTasks(tasks);
        console.log(`✅ Completed: "${task.name}"`);
    } else {
        console.log(`❌ Task with id ${id} not found`);
    }
}

// Delete a task
function deleteTask(id) {
    let tasks = loadTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        tasks = tasks.filter(t => t.id !== id);
        tasks.forEach((t, index) => t.id = index + 1);
        saveTasks(tasks);
        console.log(`🗑️ Deleted: "${task.name}"`);
    } else {
        console.log(`❌ Task with id ${id} not found`);
    }
}

// Parse command line arguments
const command = process.argv[2];
const arg = process.argv[3];

// Run the appropriate command
switch (command) {
    case 'add':
        addTask(arg);
        break;
    case 'list':
        listTasks(arg);
        break;
    case 'done':
        doneTask(parseInt(arg));
        break;
    case 'delete':
        deleteTask(parseInt(arg));
        break;
    case 'help':
    default:
        console.log(`
📋 Task Manager Commands:
  add "task name"     - Add a new task
  list                - List all tasks
  list done           - List completed tasks
  list pending        - List pending tasks
  done <id>           - Mark task as done
  delete <id>         - Delete a task
  help                - Show this help
        `);
        break;
}