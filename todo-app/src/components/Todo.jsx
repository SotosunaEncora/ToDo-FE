import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  TablePagination,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Todo = ({ tasks, addTask, toggleComplete }) => {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleAddTask = () => {
    const defaultTask = {
      text: input.trim() || '',
      priority: priority || 'low',
      dueDate: dueDate || dayjs(),
      completed: false,
    };

    addTask(defaultTask);
    setInput('');
    setPriority('');
    setDueDate(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="md" style={{ width: '85%' }}>
      <Typography variant="h4" gutterBottom>
        To-Do List
      </Typography>
      <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'center', gap: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <TextField
          label="Task"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            label="Priority"
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <TableContainer component={Paper} style={{ maxHeight: '50vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Completed</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task, index) => (
              <TableRow key={index} onClick={() => toggleComplete(index)} style={{ cursor: 'pointer' }}>
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': index }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(index);
                    }}
                  />
                </TableCell>
                <TableCell>
                  {task.text}
                </TableCell>
                <TableCell>
                  {task.priority}
                </TableCell>
                <TableCell>
                  {task.dueDate ? task.dueDate.format('MM/DD/YYYY') : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default Todo;