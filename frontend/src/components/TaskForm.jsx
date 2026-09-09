import { useState, useEffect } from 'react'

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')

  // When editingTask changes, populate the form with its values.
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDeadline(editingTask.deadline ?? '')
    } else {
      setTitle('')
      setDeadline('')
    }
  }, [editingTask])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      deadline: deadline || null,
    })
    setTitle('')
    setDeadline('')
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
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
