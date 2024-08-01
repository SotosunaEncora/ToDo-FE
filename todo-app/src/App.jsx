import React, { useState } from 'react';
import Todo from './components/Todo.jsx';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleToggleComplete = (index) => {
    const newTasks = tasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  return (
    <div className="App">
      <Todo tasks={tasks} addTask={handleAddTask} toggleComplete={handleToggleComplete} />
    </div>
  );
}

export default App;