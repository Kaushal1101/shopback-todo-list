import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, beforeEach, describe, test, expect } from 'vitest'
import App from './App'
import * as api from './api'

// Mock the entire api module so tests never hit the real backend.
vi.mock('./api')

// Two reusable sample tasks used across multiple tests.
const mockTasks = [
  { id: 1, title: 'Buy milk',  completed: false, deadline: null },
  { id: 2, title: 'Walk dog',  completed: true,  deadline: '2026-09-15' },
]

beforeEach(() => {
  vi.clearAllMocks()
  // Default: backend returns an empty list unless a test overrides this.
  api.getTasks.mockResolvedValue([])
})


// --- 1. Rendering ---

describe('Rendering', () => {
  test('shows an empty state message when there are no tasks', async () => {
    render(<App />)
    expect(await screen.findByText(/no tasks/i)).toBeInTheDocument()
  })

  test('displays all tasks returned by the backend on load', async () => {
    api.getTasks.mockResolvedValue(mockTasks)
    render(<App />)
    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
    expect(await screen.findByText('Walk dog')).toBeInTheDocument()
  })

  test('displays the deadline when a task has one', async () => {
    api.getTasks.mockResolvedValue([mockTasks[1]])
    render(<App />)
    expect(await screen.findByText(/2026-09-15/)).toBeInTheDocument()
  })

  test('does not show a deadline when a task has none', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    render(<App />)
    await screen.findByText('Buy milk')
    // Check for "Due:" which only appears in TaskItem when a deadline is set.
    // Cannot check for "Deadline" since the form always shows that label.
    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument()
  })
})


// --- 2. Add task ---

describe('Add task', () => {
  test('creates a task and shows it in the list', async () => {
    const newTask = { id: 3, title: 'New task', completed: false, deadline: null }
    api.createTask.mockResolvedValue(newTask)

    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/task title/i), 'New task')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(api.createTask).toHaveBeenCalledWith({ title: 'New task', deadline: null })
    expect(await screen.findByText('New task')).toBeInTheDocument()
  })

  test('creates a task with a deadline', async () => {
    const newTask = { id: 3, title: 'Deadline task', completed: false, deadline: '2026-12-01' }
    api.createTask.mockResolvedValue(newTask)

    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/task title/i), 'Deadline task')
    await userEvent.type(screen.getByLabelText(/deadline/i), '2026-12-01')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(api.createTask).toHaveBeenCalledWith({ title: 'Deadline task', deadline: '2026-12-01' })
  })

  test('does not call the API when title is empty', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(api.createTask).not.toHaveBeenCalled()
  })

  test('clears the form fields after a task is successfully added', async () => {
    api.createTask.mockResolvedValue({ id: 3, title: 'Buy milk', completed: false, deadline: null })

    render(<App />)
    const titleInput = screen.getByPlaceholderText(/task title/i)
    await userEvent.type(titleInput, 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))

    await waitFor(() => expect(titleInput.value).toBe(''))
  })
})


// --- 3. Complete toggle ---

describe('Complete toggle', () => {
  test('marks an incomplete task as complete', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    api.updateTask.mockResolvedValue({ ...mockTasks[0], completed: true })

    render(<App />)
    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('checkbox'))

    expect(api.updateTask).toHaveBeenCalledWith(1, { completed: true })
  })

  test('toggles a completed task back to incomplete', async () => {
    api.getTasks.mockResolvedValue([mockTasks[1]])
    api.updateTask.mockResolvedValue({ ...mockTasks[1], completed: false })

    render(<App />)
    await screen.findByText('Walk dog')
    await userEvent.click(screen.getByRole('checkbox'))

    expect(api.updateTask).toHaveBeenCalledWith(2, { completed: false })
  })
})


// --- 4. Edit task ---

describe('Edit task', () => {
  test('populates the form with existing values when edit is clicked', async () => {
    api.getTasks.mockResolvedValue([mockTasks[1]])
    render(<App />)

    await screen.findByText('Walk dog')
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(screen.getByDisplayValue('Walk dog')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-09-15')).toBeInTheDocument()
  })

  test('saves an updated title', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    api.updateTask.mockResolvedValue({ ...mockTasks[0], title: 'Buy oat milk' })

    render(<App />)
    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const input = screen.getByDisplayValue('Buy milk')
    await userEvent.clear(input)
    await userEvent.type(input, 'Buy oat milk')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(api.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Buy oat milk' }))
  })

  test('can add a deadline to a task that had none', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    api.updateTask.mockResolvedValue({ ...mockTasks[0], deadline: '2026-12-01' })

    render(<App />)
    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await userEvent.type(screen.getByLabelText(/deadline/i), '2026-12-01')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(api.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ deadline: '2026-12-01' }))
  })

  test('can remove a deadline by clearing the field', async () => {
    api.getTasks.mockResolvedValue([mockTasks[1]])
    api.updateTask.mockResolvedValue({ ...mockTasks[1], deadline: null })

    render(<App />)
    await screen.findByText('Walk dog')
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    await userEvent.clear(screen.getByDisplayValue('2026-09-15'))
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(api.updateTask).toHaveBeenCalledWith(2, expect.objectContaining({ deadline: null }))
  })

  test('cancelling edit does not save changes', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    render(<App />)

    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    const input = screen.getByDisplayValue('Buy milk')
    await userEvent.clear(input)
    await userEvent.type(input, 'Something else')
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(api.updateTask).not.toHaveBeenCalled()
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })
})


// --- 5. Delete task ---

describe('Delete task', () => {
  test('removes a task from the list after deletion', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    api.deleteTask.mockResolvedValue({ success: true })

    render(<App />)
    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(api.deleteTask).toHaveBeenCalledWith(1)
    await waitFor(() => expect(screen.queryByText('Buy milk')).not.toBeInTheDocument())
  })

  test('other tasks remain after one is deleted', async () => {
    api.getTasks.mockResolvedValue(mockTasks)
    api.deleteTask.mockResolvedValue({ success: true })

    render(<App />)
    await screen.findByText('Buy milk')

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await userEvent.click(deleteButtons[0])

    await waitFor(() => expect(screen.queryByText('Buy milk')).not.toBeInTheDocument())
    expect(screen.getByText('Walk dog')).toBeInTheDocument()
  })
})


// --- 6. Error handling ---

describe('Error handling', () => {
  test('shows an error message when tasks fail to load', async () => {
    api.getTasks.mockRejectedValue(new Error('Network error'))
    render(<App />)
    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  test('shows an error when creating a task fails', async () => {
    api.createTask.mockRejectedValue(new Error('Network error'))

    render(<App />)
    await userEvent.type(screen.getByPlaceholderText(/task title/i), 'New task')
    await userEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  test('shows an error when deleting a task fails', async () => {
    api.getTasks.mockResolvedValue([mockTasks[0]])
    api.deleteTask.mockRejectedValue(new Error('Network error'))

    render(<App />)
    await screen.findByText('Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })
})
