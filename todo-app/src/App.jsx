import React, { useState } from 'react';
import Todo from './components/Todo.jsx';
import './App.css';
import dayjs from 'dayjs';

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleToggleComplete = (index) => {
    const newTasks = tasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed, completedAt: task.completed ? null : dayjs() } : task
    );
    setTasks(newTasks);
  };

  return (
    <div className="App">
      <Todo
        tasks={tasks}
        setTasks={setTasks}
        addTask={handleAddTask}
        toggleComplete={handleToggleComplete}
      />
    </div>
  );
}

export default App;
