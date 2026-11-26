import { Field } from '@base-ui/react/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp.js';

const POSICOES = [0, 1, 2, 3, 4, 5];

/** O código num campo só (guia de UI), ligado ao rótulo e ao erro do Field. */
export function CampoDoCodigo({
  value,
  onValueChange,
  pattern,
}: {
  value: string;
  onValueChange: (codigo: string) => void;
  pattern: string;
}) {
  return (
    <Field.Control
      value={value}
      // A etapa abre neste campo: é onde o teclado do celular sugere o código do SMS.
      autoFocus
      render={(atributos) => (
        <InputOTP
          {...(atributos as object)}
          value={value}
          // Troca o onChange do Field, que espera evento. Função nova a cada render de propósito: o
          // input-otp memoriza o <input> e só reaplica aria-* quando o onChange muda.
          onChange={(codigo) => onValueChange(codigo)}
          maxLength={POSICOES.length}
          pattern={pattern}
          pasteTransformer={(colado) => colado.replace(/\D/g, '')}
          inputMode="numeric"
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            {POSICOES.map((posicao) => (
              <InputOTPSlot key={posicao} index={posicao} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}
    />
  );
}
