import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TaskDialog = ({
  open,
  onClose,
  onSave,
  task,
  setTask
}) => {
  const handleChange = (field) => (event) => {
    setTask({
      ...task,
      [field]: event.target.value
    });
  };

  const handleDateChange = (date) => {
    setTask({
      ...task,
      dueDate: date
    });
  };

  const handleSave = () => {
    onSave(task);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{task.id ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="16px">
          <TextField
            label="Task"
            value={task.text}
            onChange={handleChange('text')}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={task.priority}
              onChange={handleChange('priority')}
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
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
