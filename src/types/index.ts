export type TaskStatus = 'pending' | 'in-progress' | 'done'

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  dueDate?: string
  userId?: string
}

export type UserProfile = {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}
