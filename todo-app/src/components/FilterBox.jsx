import React from 'react';
import {
    TextField,
    Select, 
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Paper,
} from '@mui/material';

const FilterBox = ({
    textFilter,
    handleTextFilterChange,
    priorityFilter,
    handlePriorityFilterChange,
    statusFilter,
    handleStatusFilterChange,
}) => {

    return (
        <Box component={Paper} padding={2} marginBottom={2}>
        <Box marginBottom={2}>
          <TextField
            label="Filter by Name"
            variant="outlined"
            fullWidth
            value={textFilter}
            onChange={handleTextFilterChange}
          />
        </Box>
        <Box marginBottom={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel label="Priority">Priority</InputLabel>
            <Select
              label="Priority"
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
            >
              <MenuItem value="">Show All</MenuItem>
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
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">Show All</MenuItem>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="not_done">Not Done</MenuItem>
            </Select>
          </FormControl>
        </Box> 
      </Box>
    );
};

export default FilterBox