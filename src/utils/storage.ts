export const storageKeys = {
  tasks: 'm4.tasks',
  user: 'm4.user',
}

export function readStoredTasks() {
  const raw = localStorage.getItem(storageKeys.tasks)
  return raw ? (JSON.parse(raw) as unknown[]) : []
}

export function saveStoredTasks(tasks: unknown[]) {
  localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks))
}

export function readStoredUser() {
  const raw = localStorage.getItem(storageKeys.user)
  return raw ? JSON.parse(raw) : null
}

export function saveStoredUser(user: unknown) {
  localStorage.setItem(storageKeys.user, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(storageKeys.user)
}
