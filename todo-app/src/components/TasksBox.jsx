import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableCell,
    Button,
    Checkbox,
    Paper,
    TableBody,
} from '@mui/material';
import dayjs from 'dayjs';

const TasksBox = ({
    handleSortPriorityChange,
    handleSortDueDateChange,
    tasks,
    page,
    rowsPerPage,
    handleToggleComplete,
    openDialog,
    handleDeleteTask,
    handleChangePage,
}) => {
    return (
        <div>
            <TableContainer component={Paper} style={{ }}>
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
                rowsPerPageOptions={[10]}
                component="div"
                count={tasks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </div>
    )
};

export default TasksBox;