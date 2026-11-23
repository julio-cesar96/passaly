import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const buttonVariants = cva(
  "inline-flex min-h-alvo-toque min-w-alvo-toque items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-base font-semibold select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:not-data-disabled:translate-y-px data-disabled:pointer-events-none data-disabled:bg-muted data-disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline:
          'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        default: 'px-4 py-2',
        icon: 'size-alvo-toque',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: Omit<ButtonPrimitive.Props, 'className'> & { className?: string | undefined } & VariantProps<
    typeof buttonVariants
  >) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button };
