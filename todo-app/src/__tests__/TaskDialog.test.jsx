import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskDialog from '../components/TaskDialog';
import '@testing-library/jest-dom';

describe('TaskDialog Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetTask = jest.fn();
  
  const defaultTask = {
    id: null,
    name: '',
    priority: 'Low',
    dueDate: null,
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: mockOnClose,
      onSave: mockOnSave,
      task: defaultTask,
      setTask: mockSetTask,
    };
    return render(<TaskDialog {...defaultProps} {...props} />);
  };

  it('should render the dialog with the correct title', () => {
    renderComponent();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('should render the task input field', () => {
    renderComponent();
    expect(screen.getByLabelText('Task')).toBeInTheDocument();
  });

  it('should handle input change correctly', () => {
    renderComponent();
    const taskInput = screen.getByLabelText('Task');
    fireEvent.change(taskInput, { target: { value: 'New Task' } });
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Task' }));
  });

  it('should handle date change correctly', () => {
    renderComponent();
    const dateInput = screen.getByLabelText('Due Date');
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });
    expect(mockSetTask).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '2024-12-31' }));
  });

  it('should call onSave and onClose when saving the task', () => {
    renderComponent();
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith(defaultTask);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
