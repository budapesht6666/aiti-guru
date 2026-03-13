import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ProductFormData {
  title: string;
  price: number;
  brand: string;
  sku: string;
}

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductFormFields({ register, errors }: ProductFormFieldsProps) {
  return (
    <>
      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-title">Наименование</Label>
        <Input
          id="product-title"
          placeholder="Название товара"
          {...register('title', { required: 'Обязательное поле' })}
        />
        {errors.title && (
          <p className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-price">Цена, ₽</Label>
        <Input
          id="product-price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('price', {
            required: 'Обязательное поле',
            min: { value: 0, message: 'Цена не может быть отрицательной' },
          })}
        />
        {errors.price && (
          <p className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive">
            {errors.price.message}
          </p>
        )}
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-brand">Вендор</Label>
        <Input
          id="product-brand"
          placeholder="Производитель"
          {...register('brand', { required: 'Обязательное поле' })}
        />
        {errors.brand && (
          <p className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive">
            {errors.brand.message}
          </p>
        )}
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-sku">Артикул</Label>
        <Input
          id="product-sku"
          placeholder="SKU"
          {...register('sku', { required: 'Обязательное поле' })}
        />
        {errors.sku && (
          <p className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive">
            {errors.sku.message}
          </p>
        )}
      </div>
    </>
  );
}
