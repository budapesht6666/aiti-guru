import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
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
          className="transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
          {...register('title', { required: 'Обязательное поле' })}
        />
        <AnimatePresence>
          {errors.title && (
            <motion.p
              className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {errors.title.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-price">Цена, ₽</Label>
        <Input
          id="product-price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
          {...register('price', {
            required: 'Обязательное поле',
            min: { value: 0, message: 'Цена не может быть отрицательной' },
          })}
        />
        <AnimatePresence>
          {errors.price && (
            <motion.p
              className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {errors.price.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-brand">Вендор</Label>
        <Input
          id="product-brand"
          placeholder="Производитель"
          className="transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
          {...register('brand', { required: 'Обязательное поле' })}
        />
        <AnimatePresence>
          {errors.brand && (
            <motion.p
              className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {errors.brand.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex flex-col gap-1.5 pb-4">
        <Label htmlFor="product-sku">Артикул</Label>
        <Input
          id="product-sku"
          placeholder="SKU"
          className="transition-shadow duration-200 focus:shadow-md focus:shadow-primary/10"
          {...register('sku', { required: 'Обязательное поле' })}
        />
        <AnimatePresence>
          {errors.sku && (
            <motion.p
              className="absolute bottom-[-0.1rem] left-0 text-xs text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {errors.sku.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
