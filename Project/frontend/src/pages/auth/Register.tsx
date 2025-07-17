import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/branding/Logo'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '../../utils/motion'
import { Toaster, toast } from 'sonner'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email').min(1, 'Required'),
  role: z.enum(['Admin', 'Cashier', 'Waiter', 'Kitchen']),
  password: z.string().min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Admin' // Default role
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await toast.promise(
        registerUser({
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
          // confirmPassword: data.confirmPassword
        }),
        {
          loading: 'Creating account...',
          success: () => {
            navigate(from, { replace: true })
            return 'Account created successfully!'
          },
          error: (error) => {
            console.error('Registration failed:', error)
            return error.message || 'Registration failed'
          },
        }
      )
    } catch (error) {
      console.error('Registration failed:', error)
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
          Join DineDash
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account to get started
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name')}
                  className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeIn('up', 'tween', 0.4, 0.5)}>
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

            <motion.div variants={fadeIn('up', 'tween', 0.5, 0.5)}>
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Kitchen">Kitchen Staff</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeIn('up', 'tween', 0.6, 0.5)}>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeIn('up', 'tween', 0.7, 0.5)}>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full rounded-xl h-12 text-lg px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </motion.div>

            {/* Rest of your form remains the same */}
            <motion.div 
              variants={fadeIn('up', 'tween', 0.8, 0.5)}
              className="flex items-center"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </label>
            </motion.div>

            <motion.div variants={fadeIn('up', 'tween', 0.9, 0.5)}>
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
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
            </motion.div>
          </form>
                 <motion.div 
            variants={fadeIn('up', 'tween', 1.0, 0.5)}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
          {/* Social login and existing account sections remain the same */}
        </div>
      </motion.div>
    </motion.div>
  )
}