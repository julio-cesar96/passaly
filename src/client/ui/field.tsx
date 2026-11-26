import { Field as FieldPrimitive } from '@base-ui/react/field';
import { WarningCircleIcon } from '@phosphor-icons/react/dist/csr/WarningCircle';
import { cn } from 'cn';
import type { ReactNode } from 'react';

/** Rótulo, ajuda e erro ligados ao campo pelo Base UI: nada de `id` nem `aria-*` à mão. */
function Field({ className, ...props }: Comum<FieldPrimitive.Root.Props>) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: Comum<FieldPrimitive.Label.Props>) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn('font-semibold', className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: Comum<FieldPrimitive.Description.Props>) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

/** A mensagem vem de `errors` do Form, pelo `name` do Field. */
function FieldError({ className, ...props }: Comum<FieldPrimitive.Error.Props>) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn('text-sm text-destructive', className)}
      render={(atributos) => (
        <div {...atributos}>
          <ComIcone>{atributos.children}</ComIcone>
        </div>
      )}
      {...props}
    />
  );
}

/** Erro leva sempre ícone e texto: a cor sozinha não marca (guia de UI). */
function ComIcone({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-start gap-2">
      <WarningCircleIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <span>{children}</span>
    </span>
  );
}

const CAMPO =
  'min-h-alvo-toque w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-invalid:border-destructive';

function Input({ className, ...props }: Comum<FieldPrimitive.Control.Props>) {
  return <FieldPrimitive.Control data-slot="input" className={cn(CAMPO, className)} {...props} />;
}

/** `<select>` nativo (guia de UI: Bairro). */
function NativeSelect({ className, children, ...props }: Comum<FieldPrimitive.Control.Props>) {
  return (
    <FieldPrimitive.Control
      data-slot="native-select"
      className={cn(CAMPO, className)}
      render={<select>{children}</select>}
      {...props}
    />
  );
}

/** Caixa de marcar nativa; o rótulo inteiro é o alvo de toque. */
function CheckboxField({ children, name }: { children: ReactNode; name: string }) {
  return (
    <Field name={name}>
      <FieldLabel className="flex min-h-alvo-toque items-center gap-3 font-normal">
        <FieldPrimitive.Control
          type="checkbox"
          className="size-6 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
        <span>{children}</span>
      </FieldLabel>
      <FieldError />
    </Field>
  );
}

type Comum<P> = Omit<P, 'className'> & { className?: string | undefined };

export {
  CheckboxField,
  ComIcone,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  NativeSelect,
};
