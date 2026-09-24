import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Task } from '../types'

const tasksRef = () => collection(db!, 'tasks')

export async function addTaskForUser(task: Partial<Task> & { userId: string }) {
  const data = { ...task, createdAt: task.createdAt ?? new Date().toISOString() }
  const ref = await addDoc(tasksRef(), data)
  return { id: ref.id, ...data }
}

export async function getTasksForUser(userId: string) {
  const q = query(tasksRef(), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function updateTask(taskId: string, changes: Partial<Task>) {
  const d = doc(db!, 'tasks', taskId)
  await updateDoc(d, changes as any)
}

export async function deleteTask(taskId: string) {
  const d = doc(db!, 'tasks', taskId)
  await deleteDoc(d)
}
