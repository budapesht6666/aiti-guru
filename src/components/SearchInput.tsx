import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useProductStore } from '@/store/useProductStore';

export function SearchInput() {
  const { search, setSearch } = useProductStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setInputValue('');
    setSearch('');
    if (timerRef.current) clearTimeout(timerRef.current);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-lg">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
          />
        </svg>
      </span>
      <Input
        ref={inputRef}
        className="pl-9 pr-9 border-0 search-input-bg"
        placeholder="Найти"
        value={inputValue}
        onChange={handleChange}
        aria-label="Поиск товаров"
      />
      {inputValue && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={handleClear}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
