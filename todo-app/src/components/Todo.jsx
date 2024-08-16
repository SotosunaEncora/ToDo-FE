import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import {
  Container,
  Button,
  Typography,
  Box,
} from '@mui/material';
import dayjs from 'dayjs';
import TaskDialog from './TaskDialog';
import FilterBox from './FilterBox';
import MetricsBox from './MetricsBox';
import TasksBox from './TasksBox';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [textFilter, setTextFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortAscendingPriority, setSortAscendingPriority] = useState(false);
  const [sortAscendingDueDate, setSortAscendingDueDate] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [averageTime, setAverageTime] = useState('N/A');
  const [averageTimeByPriority, setAverageTimeByPriority] = useState({
    high: 'N/A',
    medium: 'N/A',
    low: 'N/A',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ text: '', priority: 'Low', dueDate: null });

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get('/todos', {
        params: {
          text: textFilter,
          priority: priorityFilter,
          status: statusFilter,
          ascendingPriority: sortAscendingPriority,
          ascendingDueDate: sortAscendingDueDate
        }
      });
      setTasks(response.data);
      
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  }, [textFilter, priorityFilter, statusFilter, sortAscendingPriority, sortAscendingDueDate]);

  const calculateAverageTimes = useCallback(() => {
    let totalTime = 0; // in seconds
    let totalTasks = 0;
    const timeByPriority = {
      High: { totalTime: 0, count: 0 },
      Medium: { totalTime: 0, count: 0 },
      Low: { totalTime: 0, count: 0 },
    };

    tasks.forEach((task) => {
      if (task.completed && task.completedAt && task.createdAt) {
        const completedAt = dayjs(task.completedAt);
        const createdAt = dayjs(task.createdAt);
        if (completedAt.isValid() && createdAt.isValid()) {
          const timeTaken = completedAt.diff(createdAt, 'second');
          totalTime += timeTaken;
          totalTasks += 1;
          timeByPriority[task.priority].totalTime += timeTaken;
          timeByPriority[task.priority].count += 1;
        }
      }
    });

    const avgTime = totalTasks > 0 ? (totalTime / totalTasks / 60).toFixed(2) + ' minutes' : 'N/A';
    setAverageTime(avgTime);

    const avgTimeByPriority = {
      High: timeByPriority.High.count > 0 ? (timeByPriority.High.totalTime / timeByPriority.High.count / 60).toFixed(2) + ' minutes' : 'N/A',
      Medium: timeByPriority.Medium.count > 0 ? (timeByPriority.Medium.totalTime / timeByPriority.Medium.count / 60).toFixed(2) + ' minutes' : 'N/A',
      Low: timeByPriority.Low.count > 0 ? (timeByPriority.Low.totalTime / timeByPriority.Low.count / 60).toFixed(2) + ' minutes' : 'N/A',
    };
    setAverageTimeByPriority(avgTimeByPriority);
  }, [tasks]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    calculateAverageTimes();
  }, [tasks, calculateAverageTimes]);

  const handleAddTask = async (task) => {
    const newTask = {
      ...task,
      dueDate: task.dueDate ? task.dueDate.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      completed: false,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      completedAt: null,
    };

    try {
      await axios.post('/todos', newTask);
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo', error);
    }
  };

  const handleEditTask = async (task) => {
    const updatedTask = {
      ...task,
      dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    };

    try {
      await axios.put(`/todos/${task.id}`, updatedTask);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const endpoint = completed ? `/todos/${id}/not-done` : `/todos/${id}/done`;
      await axios.put(endpoint);
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo status', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const openDialog = (task = { text: '', priority: 'Low', dueDate: null }) => {
    if (task.dueDate) {
      task.dueDate = dayjs(task.dueDate);
    }
    setCurrentTask(task);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleTextFilterChange = (event) => {
    setTextFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSortPriorityChange = () => {
    console.log(sortAscendingPriority);
    console.log(sortAscendingDueDate);
    setSortAscendingPriority(!sortAscendingPriority);
  };

  const handleSortDueDateChange = () => {
    console.log(sortAscendingPriority);
    console.log(sortAscendingDueDate);
    setSortAscendingDueDate(!sortAscendingDueDate);
  };

  return (
    <Container maxWidth="md" style={{ width: '85%' }}>
      <Typography variant="h4" gutterBottom>
        To-Do List
      </Typography>
      <FilterBox 
        textFilter = {textFilter}
        priorityFilter = {priorityFilter}
        statusFilter = {statusFilter}
        handleTextFilterChange = {handleTextFilterChange}
        handlePriorityFilterChange = {handlePriorityFilterChange}
        handleStatusFilterChange = {handleStatusFilterChange}
      />
      <Box display="flex" justifyContent="flex-start" style={{marginBottom:'10px'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openDialog()}
          >
            Add Task
          </Button>
        </Box>
      <TasksBox
        handleSortPriorityChange = {handleSortPriorityChange}
        handleSortDueDateChange = {handleSortDueDateChange}
        tasks = {tasks}
        page = {page}
        rowsPerPage = {rowsPerPage}
        handleToggleComplete= {handleToggleComplete}
        openDialog = {openDialog}
        handleDeleteTask = {handleDeleteTask}
        handleChangePage = {handleChangePage}
      />
      
      <MetricsBox 
        averageTime = {averageTime}
        averageTimeByPriority = {averageTimeByPriority}
      />

      <TaskDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={currentTask.id ? handleEditTask : handleAddTask}
        task={currentTask}
        setTask={setCurrentTask}
      />
    </Container>
  );
};

export default Todo;
