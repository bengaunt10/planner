//Copilot assisted file. All code was reviewed, tested, and modified by me 


import { describe, it, expect, vi,beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TaskOperationForm from '../components/TaskOperationForm';
import DeleteEvent from '../components/DeleteEvent';
import GratitudeForm from '../components/GratitudeForm';
vi.mock('../services/TaskServices', () => ({
  default: {
    addTask: vi.fn(),
    editTask: vi.fn(),
    deleteTask: vi.fn(),
    fetchTasks: vi.fn()
  }
}));

describe('Task Operations Tests', () => {
  const mockToken = 'test-token';
  beforeEach(() => {
    localStorage.setItem('access', mockToken);
  });

  it('Task Creation Test', async () => {
    const onSubmit = vi.fn();
    render(
      <MemoryRouter>
        <TaskOperationForm onSubmit={onSubmit} />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/Task Name/i), 'Test Task');
    await user.type(screen.getByLabelText(/Description/i), 'Test Description');
    await user.type(screen.getByLabelText(/duration/i), '2');
    await user.type(screen.getByLabelText(/Start Time/i), '2025-04-22T14:00');
    
    await user.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test Task',
        description: 'Test Description',
        duration: '2',
        start_time: '2025-04-22T14:00',
        repeat: 'none',
        schedule: false,
        due_date: null
      });
    });
  });

  it('Task Edit Test', async () => {
    const onSubmit = vi.fn();
    const existingTask = {
      id: 1,
      name: 'Original Task',
      description: 'Original Description',
      duration: 1,
      start_time: '2025-04-22T14:00',
      repeat: 'none'
    };

    render(
      <MemoryRouter>
        <TaskOperationForm onSubmit={onSubmit} passedData={existingTask} editForm={true} />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    
    await user.clear(screen.getByLabelText(/Task Name/i));
    await user.type(screen.getByLabelText(/Task Name/i), 'Updated Task');
    
    await user.click(screen.getByRole('button', { name: /Update Task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Task'
      }));
    });
  });

  it('Create Repeating Task Test', async () => {
    const onSubmit = vi.fn();
    render(
      <MemoryRouter>
        <TaskOperationForm onSubmit={onSubmit} />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/Task Name/i), 'Repeating Task');
    await user.type(screen.getByLabelText(/Description/i), 'Daily Task');
    await user.type(screen.getByLabelText(/duration/i), '1');
    await user.type(screen.getByLabelText(/Start Time/i), '2025-04-22T09:00');
    await user.selectOptions(screen.getByLabelText(/Repeat/i), 'daily');
    
    await user.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        repeat: 'daily'
      }));

    });
  });

  it('Decision Assist Algorithm Test', async () => {
    const onSubmit = vi.fn();
    render(
      <MemoryRouter>
        <TaskOperationForm onSubmit={onSubmit} />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/Task Name/i), 'Scheduled Task');
    await user.type(screen.getByLabelText(/Description/i), 'Auto-scheduled');
    await user.type(screen.getByLabelText(/duration/i), '2');
    
    await user.click(screen.getByLabelText(/Schedule for me/i));
    await user.type(screen.getByLabelText(/Date Due/i), '2025-04-25T17:00');
    
    await user.click(screen.getByRole('button', { name: /Add Task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        schedule: true,
        due_date: '2025-04-25T17:00'
      }));
    });
  });

  it('Task Delete Test', async () => {
    const deleteTask = vi.fn();
    const taskToDelete = {
      id: 1,
      name: 'Task to Delete'
    };

    render(
      <MemoryRouter>
        <DeleteEvent 
          deleteTask={deleteTask}
          taskSelected={taskToDelete}
          deleteRepeat={false}
          setDeleteRepeat={vi.fn()}
          setOpenDeleteModal={vi.fn()}
        />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Yes/i }));

    expect(deleteTask).toHaveBeenCalled();
  });

  
});

describe('Gratitude Operations Tests', () => {
  const mockToken = 'test-token';
  beforeEach(() => {
    localStorage.setItem('access', mockToken);
  });

  it('Gratitude Creation Test', async () => {
    const onSubmit = vi.fn();
    render(
      <MemoryRouter>
        <GratitudeForm onSubmit={onSubmit} />
      </MemoryRouter>
    );
    
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/What are your gratitudes/i), 'Test Gratitude');
    await user.type(screen.getByLabelText(/What have you completed/i), 'Test Completion');
    await user.type(screen.getByLabelText(/Reflect on the best parts/i), 'Test Reflection');
    
    await user.click(screen.getByRole('button', { name: /Add Entry/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        gratitudes: 'Test Gratitude',
        doneToday: 'Test Completion',
        bestPartToday: 'Test Reflection'
      });
    });
  });

  it('Gratitude Edit Test', async () => {
    const onSubmit = vi.fn();
    const existingGratitude = {
      id: 1,
      gratitudes: 'Original Gratitude',
      doneToday: 'Original Done',
      bestPartToday: 'Original Best Part'
    };

    render(
      <MemoryRouter>
        <GratitudeForm onSubmit={onSubmit} passedData={existingGratitude} editForm={true} />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    
    await user.clear(screen.getByLabelText(/What are your gratitudes/i));
    await user.type(screen.getByLabelText(/What are your gratitudes/i), 'Updated Gratitude');
    
    await user.click(screen.getByRole('button', { name: /Update Entry/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        gratitudes: 'Updated Gratitude'
      }));
    });
  });
});