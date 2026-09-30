const KEY = 'usuario'

const USER = 'admin'
const PASSWORD = '1234'

export function login(user: string, password: string) {
  if (user === USER && password === PASSWORD) {
    localStorage.setItem(KEY, user)
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function getUser() {
  return localStorage.getItem(KEY)
}
