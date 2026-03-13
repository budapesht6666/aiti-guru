import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAddProductMutation } from '@/api/products';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ProductFormFields, type ProductFormData } from '@/components/ProductFormFields';

interface AddProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductSheet({ open, onOpenChange }: AddProductSheetProps) {
  const isMobile = useIsMobile();
  const mutation = useAddProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    await mutation.mutateAsync({ ...data, price: Number(data.price) });
    toast.success('Товар успешно добавлен');
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="w-full sm:max-w-md data-[side=bottom]:max-h-[90vh] data-[side=bottom]:overflow-y-auto"
      >
        <SheetHeader className="p-8">
          <SheetTitle>Добавить товар</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 px-8">
          <ProductFormFields register={register} errors={errors} />

          <SheetFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={mutation.isPending || isSubmitting}>
              {mutation.isPending ? 'Добавление...' : 'Добавить'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
