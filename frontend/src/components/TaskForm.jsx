import { useState } from 'react'

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [deadline, setDeadline] = useState(editingTask?.deadline ?? '')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await onSubmit({
        title: title.trim(),
        deadline: deadline || null,
      })
      setTitle('')
      setDeadline('')
    } catch {
      // App.jsx sets the error message; keep form values so user doesn't lose input
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label>
        Task title
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <label>
        Deadline
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="submit">{editingTask ? 'Save' : 'Add'}</button>
        {editingTask && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
