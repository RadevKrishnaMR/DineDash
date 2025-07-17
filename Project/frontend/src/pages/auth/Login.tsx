import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate,} from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { Button } from '../../components/ui/Button'
// import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/branding/Logo'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '../../utils/motion'
import { Toaster, toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Required'),
  password: z.string().min(6, 'Must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  // const location = useLocation()
  // const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
  try {
    await toast.promise(
      login({
        email: data.email,
        password: data.password,
      }).then((res) => {
        const user = res.user; // This assumes your `login` returns { user, token }

        // Role-based redirection
        switch (user.role) {
          case 'Admin':
            navigate('/dashboard/admin', { replace: true })
            break
          case 'Cashier':
            navigate('/dashboard/cashier', { replace: true })
            break
          case 'Waiter':
            navigate('/dashboard/waiter', { replace: true })
            break
          case 'Kitchen':
            navigate('//dashboard/kitchen', { replace: true })
            break
          default:
            navigate('/dashboard', { replace: true })
            break
        }

        return 'Login successful!'
      }),
      {
        loading: 'Authenticating...',
        success: () => '', // handled in .then()
        error: (error) => {
          console.error('Login failed:', error)
          return error.message || 'Invalid credentials'
        },
      }
    )
  } catch (error) {
    console.error('Login failed:', error)
  }
}


  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer()}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <Toaster position="top-center" richColors />
      
      <motion.div 
        variants={fadeIn('up', 'tween', 0.1, 0.5)}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <Logo className="h-20 w-auto text-indigo-600" />
        </div>
        <h2 className="mt-8 text-center text-4xl font-bold text-gray-900 font-sans">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your DineDash account
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn('up', 'tween', 0.2, 0.5)}
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm py-10 px-8 shadow-xl rounded-2xl border border-white/20 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
  <motion.div variants={fadeIn('up', 'tween', 0.3, 0.5)}>
    <div className="space-y-1">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        {...register('email')}
        className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
      )}
    </div>
  </motion.div>

  <motion.div variants={fadeIn('up', 'tween', 0.4, 0.5)}>
    <div className="space-y-1">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        {...register('password')}
        className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
      />
      {errors.password && (
        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
      )}
    </div>
  </motion.div>

            <motion.div 
              variants={fadeIn('up', 'tween', 0.5, 0.5)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeIn('up', 'tween', 0.6, 0.5)}>
              <Button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-indigo-500/20 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            variants={fadeIn('up', 'tween', 0.7, 0.5)}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300/50 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300/50 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Sign in with Apple</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeIn('up', 'tween', 0.8, 0.5)}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Register here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}