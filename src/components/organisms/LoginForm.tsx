import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Alert, Button, Input } from '../atoms'
import { FormField } from '../molecules'

function LoginForm() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const notice = useAuthStore((state) => state.notice)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(user, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-form__title">Iniciar sesión</h1>

      <FormField id="user" label="Usuario">
        <Input id="user" type="text" autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} />
      </FormField>

      <FormField id="password" label="Contraseña">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      {notice && !error && <Alert variant="info">{notice}</Alert>}
      {error && <Alert>{error}</Alert>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="login-form__hint">Usuario: admin · Contraseña: 1234</p>
    </form>
  )
}

export default LoginForm
