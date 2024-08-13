import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Todo from '../components/Todo';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

describe('Todo Component', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onGet('/tasks').reply(200, []);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should render the Todo component', () => {
    render(<Todo />);
    expect(screen.getByText('To-Do List')).toBeInTheDocument();
  });

  it('should fetch tasks on load', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', priority: 'high', dueDate: '2024-12-31', completed: false },
      { id: 2, name: 'Task 2', priority: 'low', dueDate: '2024-11-30', completed: true },
    ];
    mock.onGet('/tasks').reply(200, tasks);
    
    render(<Todo />);

    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
  });

  it('should handle adding a new task', async () => {
    const task = { id: 3, name: 'New Task', priority: 'medium', dueDate: '2024-10-10', completed: false };
    mock.onPost('/tasks').reply(200, task);

    render(<Todo />);

    fireEvent.click(screen.getByText('Add Task'));

    const taskNameInput = screen.getByLabelText('Task');
    fireEvent.change(taskNameInput, { target: { value: 'New Task' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('should handle task deletion', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', priority: 'high', dueDate: '2024-12-31', completed: false },
    ];
    mock.onGet('/tasks').reply(200, tasks);
    mock.onDelete('/tasks/1').reply(200);

    render(<Todo />);

    fireEvent.click(await screen.findByLabelText('Delete'));

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('should filter tasks based on priority', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', priority: 'high', dueDate: '2024-12-31', completed: false },
      { id: 2, name: 'Task 2', priority: 'low', dueDate: '2024-11-30', completed: true },
    ];
    mock.onGet('/tasks').reply(200, tasks);

    render(<Todo />);

    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'high' } });

    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should sort tasks by due date', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', priority: 'high', dueDate: '2024-12-31', completed: false },
      { id: 2, name: 'Task 2', priority: 'low', dueDate: '2024-11-30', completed: true },
    ];
    mock.onGet('/tasks').reply(200, tasks);

    render(<Todo />);

    fireEvent.click(screen.getByText('Due Date'));

    const taskNames = screen.getAllByTestId('task-name').map(node => node.textContent);
    expect(taskNames).toEqual(['Task 2', 'Task 1']);
  });
});
