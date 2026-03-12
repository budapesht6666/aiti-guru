import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { useProductStore } from '@/store/useProductStore'

export function SearchInput() {
  const { search, setSearch } = useProductStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSearch(value)
    }, 300)
  }

  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>
      </span>
      <Input
        className="pl-9"
        placeholder="Поиск товаров..."
        defaultValue={search}
        onChange={handleChange}
        aria-label="Поиск товаров"
      />
    </div>
  )
}
