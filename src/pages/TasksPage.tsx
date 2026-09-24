import { useEffect, useMemo, useState } from 'react'
import type { Task, TaskStatus } from '../types'
import { readStoredTasks, saveStoredTasks } from '../utils/storage'
import { useAuth } from '../context/AuthContext'
import { hasFirebaseConfig } from '../services/firebase'
import { addTaskForUser, deleteTask, getTasksForUser, updateTask } from '../services/firestore'

const initialTasks: Task[] = [
  { id: '1', title: 'Diseñar dashboard', description: 'Crear la vista inicial', status: 'pending', priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Preparar entrega', description: 'Validar sprint final', status: 'in-progress', priority: 'medium', createdAt: new Date().toISOString() },
]

type Filter = 'all' | 'active' | 'completed'

export function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    async function loadTasks() {
      if (hasFirebaseConfig && user) {
        const remoteTasks = await getTasksForUser(user.uid)
        setTasks(remoteTasks as Task[])
        return
      }

      const stored = readStoredTasks()
      setTasks(stored.length ? (stored as Task[]) : initialTasks)
    }

    void loadTasks()
  }, [user])

  useEffect(() => {
    if (!hasFirebaseConfig) saveStoredTasks(tasks)
  }, [tasks])

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === 'active') return task.status !== 'done'
    if (filter === 'completed') return task.status === 'done'
    return true
  }), [filter, tasks])

  async function addTask() {
    if (!title.trim() || !user) return

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: 'pending' as const,
      priority,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    }
    const newTask = hasFirebaseConfig
      ? await addTaskForUser(taskData)
      : { id: crypto.randomUUID(), ...taskData }

    setTasks((current) => [newTask as Task, ...current])
    setTitle('')
    setDescription('')
    setPriority('medium')
  }

  async function changeStatus(taskId: string, status: TaskStatus) {
    if (hasFirebaseConfig) await updateTask(taskId, { status })
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  async function removeTask(taskId: string) {
    if (hasFirebaseConfig) await deleteTask(taskId)
    setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  async function sendSummary() {
    setNotice('Enviando resumen...')
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user?.email,
        subject: 'Resumen de tus tareas',
        html: `<h1>Resumen de tareas</h1><p>Total: ${tasks.length}</p><p>Completadas: ${tasks.filter((task) => task.status === 'done').length}</p>`,
      }),
    })
    setNotice(response.ok ? 'Resumen enviado.' : 'No se pudo enviar el resumen.')
  }

  return (
    <section className="page-card">
      <h2>Gestión de tareas</h2>
      <div className="task-form">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título de la tarea" />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descripción" />
        <select value={priority} onChange={(event) => setPriority(event.target.value as Task['priority'])}>
          <option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option>
        </select>
        <button onClick={() => void addTask()}>Agregar tarea</button>
      </div>

      <div className="task-actions">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('active')}>Activas</button>
        <button onClick={() => setFilter('completed')}>Completadas</button>
        <button onClick={() => void sendSummary()}>Enviar resumen</button>
      </div>
      {notice && <p className="muted">{notice}</p>}

      <div className="task-list">
        {visibleTasks.map((task) => (
          <article key={task.id} className="task-item">
            <div><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}</div>
            <div className="task-actions">
              <span className={`badge priority-${task.priority}`}>{task.priority}</span>
              <select value={task.status} onChange={(event) => void changeStatus(task.id, event.target.value as TaskStatus)}>
                <option value="pending">Pendiente</option><option value="in-progress">En progreso</option><option value="done">Hecha</option>
              </select>
              <button onClick={() => void removeTask(task.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
