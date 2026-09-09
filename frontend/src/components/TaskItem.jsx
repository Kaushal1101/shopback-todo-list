function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="task-content">
        <span className={task.completed ? 'completed' : ''}>{task.title}</span>
        {task.deadline && (
          <span className="deadline">Due: {task.deadline}</span>
        )}
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}

export default TaskItem
