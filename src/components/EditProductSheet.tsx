import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 px-8">
          <ProductFormFields register={register} errors={errors} />

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
