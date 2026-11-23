import { cn } from 'cn';
import { OTPInput, OTPInputContext } from 'input-otp';
import { type ComponentProps, useContext } from 'react';

function InputOTP({ className, containerClassName, ...props }: ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'group/otp flex items-center has-disabled:opacity-50',
        containerClassName,
      )}
      spellCheck={false}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<'div'> & {
  index: number;
}) {
  const { slots } = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex size-alvo-toque items-center justify-center border-y border-r border-input text-base first:rounded-l-lg first:border-l last:rounded-r-lg group-has-[[aria-invalid=true]]/otp:border-destructive data-[active=true]:z-10 data-[active=true]:outline-2 data-[active=true]:outline-ring',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground motion-reduce:animate-none" />
        </div>
      )}
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
