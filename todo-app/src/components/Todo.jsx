import React, { useState, useEffect, useCallback } from 'react';
import axios from '../axios';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from '@mui/material';
import dayjs from 'dayjs';
import TaskDialog from './TaskDialog';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortAscendingPriority, setSortAscendingPriority] = useState(false);
  const [sortAscendingDueDate, setSortAscendingDueDate] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(4);
  const [averageTime, setAverageTime] = useState('N/A');
  const [averageTimeByPriority, setAverageTimeByPriority] = useState({
    high: 'N/A',
    medium: 'N/A',
    low: 'N/A',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({ text: '', priority: 'low', dueDate: null });

  const fetchTodos = useCallback(async () => {
    try {
      console.log('fetching')
      const response = await axios.get('/todos', {
        params: {
          text: filterText,
          priority: filterPriority,
          status: filterStatus,
          ascendingPriority: sortAscendingPriority,
          ascendingDueDate: sortAscendingDueDate
        }
      });
      setTasks(response.data);
      
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  }, [filterText, filterPriority, filterStatus, sortAscendingPriority, sortAscendingDueDate]);

  const calculateAverageTimes = useCallback(() => {
    let totalTime = 0; // in seconds
    let totalTasks = 0;
    const timeByPriority = {
      high: { totalTime: 0, count: 0 },
      medium: { totalTime: 0, count: 0 },
      low: { totalTime: 0, count: 0 },
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
      high: timeByPriority.high.count > 0 ? (timeByPriority.high.totalTime / timeByPriority.high.count / 60).toFixed(2) + ' minutes' : 'N/A',
      medium: timeByPriority.medium.count > 0 ? (timeByPriority.medium.totalTime / timeByPriority.medium.count / 60).toFixed(2) + ' minutes' : 'N/A',
      low: timeByPriority.low.count > 0 ? (timeByPriority.low.totalTime / timeByPriority.low.count / 60).toFixed(2) + ' minutes' : 'N/A',
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

  const openDialog = (task = { text: '', priority: 'low', dueDate: null }) => {
    if (task.dueDate) {
      task.dueDate = dayjs(task.dueDate);
    }
    setCurrentTask(task);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterPriorityChange = (event) => {
    setFilterPriority(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
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
      <Box component={Paper} padding={2} marginBottom={2}>
        <Box marginBottom={2}>
          <TextField
            label="Filter by Name"
            variant="outlined"
            fullWidth
            value={filterText}
            onChange={handleFilterTextChange}
          />
        </Box>
        <Box marginBottom={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={filterPriority}
              onChange={handleFilterPriorityChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box marginBottom={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filterStatus}
              onChange={handleFilterStatusChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="not_done">Not Done</MenuItem>
            </Select>
          </FormControl>
        </Box> 
      </Box>
      <Box display="flex" justifyContent="flex-start" style={{marginBottom:'10px'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openDialog()}
          >
            Add Task
          </Button>
        </Box>
      <TableContainer component={Paper} style={{ maxHeight: '50vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Completed</TableCell>
              <TableCell>Task</TableCell>
              <TableCell><Button onClick={handleSortPriorityChange}>Priority</Button></TableCell>
              <TableCell><Button onClick={handleSortDueDateChange}>Due Date</Button></TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <TableRow key={task.id} style={{ cursor: 'pointer' }}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': task.id }}
                    onClick={() => handleToggleComplete(task.id, task.completed)}
                  />
                </TableCell>
                <TableCell>
                  {task.text}
                </TableCell>
                <TableCell>
                  {task.priority}
                </TableCell>
                <TableCell>
                  {task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : ''}
                </TableCell>
                <TableCell>
                  <Button onClick={() => openDialog(task)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          <Typography variant="subtitle1">Average time to complete each task:</Typography>
          <Typography variant="h6">{averageTime}</Typography>
        </div>
        <div>
          <Typography variant="subtitle1">Average time by priority:</Typography>
          <Typography variant="body1">High: {averageTimeByPriority.high}</Typography>
          <Typography variant="body1">Medium: {averageTimeByPriority.medium}</Typography>
          <Typography variant="body1">Low: {averageTimeByPriority.low}</Typography>
        </div>
      </div>
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
