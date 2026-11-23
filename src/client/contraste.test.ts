import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

type Tokens = Record<string, string>;

/** Lê o tema como texto: um `:root` claro e um `:root` dentro de `prefers-color-scheme: dark`. */
function lerTema(): { claro: Tokens; escuro: Tokens } {
  const css = readFileSync(new URL('./tema.css', import.meta.url), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
  const blocoEscuro = /@media \(prefers-color-scheme: dark\)\s*\{\s*:root\s*\{([^}]*)\}\s*\}/g;
  const escuros = [...css.matchAll(blocoEscuro)];
  const claros = [...css.replace(blocoEscuro, '').matchAll(/:root\s*\{([^}]*)\}/g)];
  expect(claros, 'um único :root claro').toHaveLength(1);
  expect(escuros, 'um único :root escuro').toHaveLength(1);
  const tokens = (bloco: string): Tokens =>
    Object.fromEntries(
      [...bloco.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, nome = '', valor = '']) => [
        nome,
        valor.trim(),
      ]),
    );
  return { claro: tokens(claros[0]?.[1] ?? ''), escuro: tokens(escuros[0]?.[1] ?? '') };
}

// WCAG 2.2, "relative luminance" e "contrast ratio".
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((inicio) => {
    const canal = Number.parseInt(hex.slice(inicio, inicio + 2), 16) / 255;
    return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razao(a: string, b: string): number {
  const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (clara + 0.05) / (escura + 0.05);
}

test('a razão de contraste entre preto e branco é 21:1', () => {
  expect(razao('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  expect(razao('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
});

test('a razão confere com um valor conhecido no meio da escala', () => {
  expect(razao('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
});

test('os dois temas têm os mesmos tokens, todos em hex', () => {
  const { claro, escuro } = lerTema();
  expect(Object.keys(claro)).not.toHaveLength(0);
  expect(Object.keys(escuro).sort()).toEqual(Object.keys(claro).sort());
  for (const [nome, valor] of [...Object.entries(claro), ...Object.entries(escuro)]) {
    expect(valor, nome).toMatch(/^#[0-9A-F]{6}$/i);
  }
});

// Pares que as telas usam, pelos papéis do docs/guia-de-ui.md. Par novo entra aqui antes da tela.
const MINIMOS = { texto: 4.5, grande: 3, componente: 3 };
const PARES: [frente: string, fundo: string, tipo: keyof typeof MINIMOS][] = [
  ['foreground', 'background', 'texto'],
  ['card-foreground', 'card', 'texto'],
  ['popover-foreground', 'popover', 'texto'],
  ['muted-foreground', 'background', 'texto'],
  ['muted-foreground', 'card', 'texto'],
  ['muted-foreground', 'muted', 'texto'],
  ['foreground', 'muted', 'texto'],
  ['primary-foreground', 'primary', 'texto'],
  ['secondary-foreground', 'secondary', 'texto'],
  ['accent-foreground', 'accent', 'texto'],
  ['destructive-foreground', 'destructive', 'texto'],
  ['destructive', 'background', 'texto'],
  ['primary', 'background', 'texto'],
  ['primary', 'card', 'texto'],
  ['primary', 'accent', 'grande'],
  ['input', 'background', 'componente'],
  ['input', 'card', 'componente'],
  ['input', 'accent', 'componente'],
  ['border', 'background', 'componente'],
  ['border', 'card', 'componente'],
  ['primary', 'background', 'componente'],
  ['primary', 'card', 'componente'],
  ['ring', 'background', 'componente'],
  ['ring', 'card', 'componente'],
  ['destructive', 'background', 'componente'],
  ['destructive', 'card', 'componente'],
];

test.each(
  (['claro', 'escuro'] as const).flatMap((tema) =>
    PARES.map(([frente, fundo, tipo]) => ({ tema, frente, fundo, tipo })),
  ),
)('$tema: $frente sobre $fundo ($tipo)', ({ tema, frente, fundo, tipo }) => {
  const tokens = lerTema()[tema];
  expect(Object.keys(tokens)).toEqual(expect.arrayContaining([frente, fundo]));
  expect(razao(tokens[frente] ?? '', tokens[fundo] ?? '')).toBeGreaterThanOrEqual(MINIMOS[tipo]);
});
