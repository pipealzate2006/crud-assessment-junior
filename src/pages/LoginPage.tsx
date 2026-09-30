import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

function LoginPage() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!login(user, password)) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Iniciar sesión</h1>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="user">Usuario</label>
          <input
            id="user"
            type="text"
            className="task-form__input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="task-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="login__error">{error}</p>}

        <button type="submit" className="button button--primary">Entrar</button>

        <p className="login__hint">Usuario: admin · Contraseña: 1234</p>
      </form>
    </div>
  )
}

export default LoginPage
