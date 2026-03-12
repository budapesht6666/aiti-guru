import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export function LoginPage() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { remember: false } })

  const rememberValue = watch('remember')

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login({ username: data.username, password: data.password })
      setToken(res.accessToken, data.remember)
      navigate('/')
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Ошибка авторизации',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm bg-background rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-1">Добро пожаловать!</h1>
          <p className="text-sm text-muted-foreground text-center">Пожалуйста, авторизируйтесь</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Логин</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <Input
                id="username"
                className="pl-9"
                placeholder="Введите логин"
                autoComplete="username"
                {...register('username', { required: 'Обязательное поле' })}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <Input
                id="password"
                type="password"
                className="pl-9"
                placeholder="Введите пароль"
                autoComplete="current-password"
                {...register('password', { required: 'Обязательное поле' })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberValue}
              onCheckedChange={(checked) => setValue('remember', checked === true)}
            />
            <Label htmlFor="remember" className="font-normal cursor-pointer">
              Запомнить данные
            </Label>
          </div>

          {/* Root error */}
          {errors.root && (
            <p className="text-sm text-destructive text-center">{errors.root.message}</p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Загрузка...' : 'Войти'}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register link */}
          <p className="text-sm text-center text-muted-foreground">
            Нет аккаунта?{' '}
            <span className="text-primary font-medium cursor-not-allowed opacity-60">Создать</span>
          </p>
        </form>
      </div>
    </div>
  )
}
