import { useEffect, useState } from 'react'
import type { Task, TaskStatus } from '../types'
import { readStoredTasks, saveStoredTasks } from '../utils/storage'

const initialTasks: Task[] = [
  { id: '1', title: 'Diseñar dashboard', description: 'Crear la vista inicial', status: 'pending', priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Preparar entrega', description: 'Validar sprint final', status: 'in-progress', priority: 'medium', createdAt: new Date().toISOString() },
]

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = readStoredTasks()
    return stored.length ? (stored as Task[]) : initialTasks
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')

  useEffect(() => {
    saveStoredTasks(tasks)
  }, [tasks])

  function addTask() {
    if (!title.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      priority,
      createdAt: new Date().toISOString(),
    }

    setTasks((current) => [newTask, ...current])
    setTitle('')
    setDescription('')
    setPriority('medium')
  }

  function updateStatus(taskId: string, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task)),
    )
  }

  return (
    <section className="page-card">
      <h2>Gestión de tareas</h2>

      <div className="task-form">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título de la tarea" />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descripción" />
        <select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <button onClick={addTask}>Agregar tarea</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-item">
            <div>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
            </div>
            <div className="task-actions">
              <span className={`badge priority-${task.priority}`}>{task.priority}</span>
              <select value={task.status} onChange={(event) => updateStatus(task.id, event.target.value as TaskStatus)}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Hecha</option>
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
