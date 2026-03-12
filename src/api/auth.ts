import type { LoginRequest, LoginResponse } from '@/types/auth'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, expiresInMins: 60 }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Ошибка авторизации')
  }
  return res.json() as Promise<LoginResponse>
}
