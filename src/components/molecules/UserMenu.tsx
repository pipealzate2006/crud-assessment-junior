import { Button } from '../atoms'

interface Props {
  user: string
  onLogout: () => void
}

function UserMenu({ user, onLogout }: Props) {
  return (
    <div className="user-menu">
      <span className="user-menu__name">Hola, {user}</span>
      <Button variant="ghost" small onClick={onLogout}>
        Cerrar sesión
      </Button>
    </div>
  )
}

export default UserMenu
