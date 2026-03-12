import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProductStore } from '@/store/useProductStore'
import type { TableProduct } from '@/components/ProductsTable/columns'

interface EditForm {
  title: string
  price: number
  brand: string
  sku: string
}

interface EditProductSheetProps {
  product: TableProduct | null
  onOpenChange: (open: boolean) => void
}

export function EditProductSheet({ product, onOpenChange }: EditProductSheetProps) {
  const updateProduct = useProductStore((s) => s.updateProduct)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditForm>()

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        brand: product.brand ?? '',
        sku: product.sku ?? '',
      })
    }
  }, [product, reset])

  const onSubmit = async (data: EditForm) => {
    if (!product) return
    try {
      await updateProduct(product.id, { ...data, price: Number(data.price) })
      toast.success('Товар успешно обновлён')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Не удалось обновить товар')
    }
  }

  return (
    <Sheet open={!!product} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Редактировать товар</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6 px-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">Наименование</Label>
            <Input
              id="edit-title"
              placeholder="Название товара"
              {...register('title', { required: 'Обязательное поле' })}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-price">Цена, ₽</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('price', {
                required: 'Обязательное поле',
                min: { value: 0, message: 'Цена не может быть отрицательной' },
              })}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-brand">Вендор</Label>
            <Input
              id="edit-brand"
              placeholder="Производитель"
              {...register('brand', { required: 'Обязательное поле' })}
            />
            {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-sku">Артикул</Label>
            <Input
              id="edit-sku"
              placeholder="SKU"
              {...register('sku', { required: 'Обязательное поле' })}
            />
            {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
          </div>

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
