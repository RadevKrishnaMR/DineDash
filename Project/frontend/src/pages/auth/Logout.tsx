import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { LoadingScreen } from '../../components/ui/LoadingScreen'

export default function Logout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const performLogout = async () => {
      await logout()
      navigate('/login', { replace: true })
    }
    performLogout()
  }, [logout, navigate])

  return <LoadingScreen message="Signing out..." />
}