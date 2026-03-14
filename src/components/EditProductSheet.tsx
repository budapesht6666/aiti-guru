import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUpdateProductMutation } from '@/api/products';
import type { TableProduct } from '@/components/ProductsTable/columns';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ProductFormFields, type ProductFormData } from '@/components/ProductFormFields';

interface EditProductSheetProps {
  product: TableProduct | null;
  onOpenChange: (open: boolean) => void;
}

export function EditProductSheet({ product, onOpenChange }: EditProductSheetProps) {
  const isMobile = useIsMobile();
  const mutation = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        brand: product.brand ?? '',
        sku: product.sku ?? '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;
    const patch = { ...data, price: Number(data.price) };

    mutation.mutate(
      { id: Number(product.id), patch },
      {
        onSuccess: () => {
          toast.success('Товар успешно обновлён');
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Не удалось обновить товар');
        },
      },
    );
  };

  return (
    <Sheet open={!!product} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="w-full sm:max-w-md data-[side=bottom]:max-h-[90vh] data-[side=bottom]:overflow-y-auto"
      >
        <SheetHeader className="p-8">
          <SheetTitle>Редактировать товар</SheetTitle>
        </SheetHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 px-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <ProductFormFields register={register} errors={errors} />

          <SheetFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-transform duration-150 active:scale-[0.97]"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="transition-transform duration-150 active:scale-[0.97]"
            >
              {isSubmitting || mutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </SheetFooter>
        </motion.form>
      </SheetContent>
    </Sheet>
  );
}
