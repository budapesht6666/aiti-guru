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

interface AddForm {
  title: string
  price: number
  brand: string
  sku: string
}

interface AddProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductSheet({ open, onOpenChange }: AddProductSheetProps) {
  const addProduct = useProductStore((s) => s.addProduct)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddForm>()

  const onSubmit = (data: AddForm) => {
    addProduct({ ...data, price: Number(data.price) })
    toast.success('Товар успешно добавлен')
    reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Добавить товар</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6 px-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-title">Наименование</Label>
            <Input
              id="add-title"
              placeholder="Название товара"
              {...register('title', { required: 'Обязательное поле' })}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-price">Цена, ₽</Label>
            <Input
              id="add-price"
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
            <Label htmlFor="add-brand">Вендор</Label>
            <Input
              id="add-brand"
              placeholder="Производитель"
              {...register('brand', { required: 'Обязательное поле' })}
            />
            {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-sku">Артикул</Label>
            <Input
              id="add-sku"
              placeholder="SKU"
              {...register('sku', { required: 'Обязательное поле' })}
            />
            {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
          </div>

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
