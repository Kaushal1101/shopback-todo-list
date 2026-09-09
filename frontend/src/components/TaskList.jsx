import TaskItem from './TaskItem'

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}

export default TaskList
