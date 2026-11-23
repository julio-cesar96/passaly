// PROTÓTIPO DESCARTÁVEL. Dados das 3 paletas e dos pares de contraste. Ver README.md.
//
// Tokens no formato do shadcn/ui, em hex sRGB. Na hora de virar CSS de verdade,
// cada chave vira `--<chave>` em `:root` (claro) e em `.dark` / prefers-color-scheme (escuro).
// Script clássico (sem módulo) para abrir com dois cliques via file://.

// eslint-disable-next-line no-unused-vars
var PALETAS = {
  A: {
    nome: 'Sálvia',
    ideia: 'Verde de folha com neutros de papel. Calmo, lembra cuidado e reaproveitamento.',
    claro: {
      background: '#FAF9F5',
      foreground: '#1B2420',
      card: '#FFFFFF',
      'card-foreground': '#1B2420',
      popover: '#FFFFFF',
      'popover-foreground': '#1B2420',
      primary: '#2D6A4E',
      'primary-foreground': '#FFFFFF',
      secondary: '#E5EFE8',
      'secondary-foreground': '#1E3D2D',
      muted: '#EFEDE6',
      'muted-foreground': '#545C57',
      accent: '#DAEBE0',
      'accent-foreground': '#1E3D2D',
      destructive: '#B42318',
      'destructive-foreground': '#FFFFFF',
      border: '#878F8A',
      input: '#727B76',
      ring: '#2D6A4E',
    },
    escuro: {
      background: '#111714',
      foreground: '#E6EDE8',
      card: '#18201C',
      'card-foreground': '#E6EDE8',
      popover: '#18201C',
      'popover-foreground': '#E6EDE8',
      primary: '#7CC3A0',
      'primary-foreground': '#0C1D15',
      secondary: '#23302A',
      'secondary-foreground': '#DCE8E0',
      muted: '#1E2722',
      'muted-foreground': '#A2AFA7',
      accent: '#25382D',
      'accent-foreground': '#D9EEE1',
      destructive: '#F4877B',
      'destructive-foreground': '#2A0805',
      border: '#66736B',
      input: '#76847C',
      ring: '#7CC3A0',
    },
  },

  B: {
    nome: 'Barro',
    ideia: 'Terracota com creme. Quente e caseiro, cara de feira de bairro.',
    claro: {
      background: '#FCF8F3',
      foreground: '#2A1E19',
      card: '#FFFFFF',
      'card-foreground': '#2A1E19',
      popover: '#FFFFFF',
      'popover-foreground': '#2A1E19',
      primary: '#A33E23',
      'primary-foreground': '#FFFFFF',
      secondary: '#F4E5DA',
      'secondary-foreground': '#58291A',
      muted: '#F3ECE5',
      'muted-foreground': '#64554D',
      accent: '#F6DCCB',
      'accent-foreground': '#58291A',
      destructive: '#9B1C31',
      'destructive-foreground': '#FFFFFF',
      border: '#958780',
      input: '#7E6F68',
      ring: '#A33E23',
    },
    escuro: {
      background: '#191311',
      foreground: '#F1E7E0',
      card: '#221A16',
      'card-foreground': '#F1E7E0',
      popover: '#221A16',
      'popover-foreground': '#F1E7E0',
      primary: '#EF8E6D',
      'primary-foreground': '#2A0F06',
      secondary: '#33261F',
      'secondary-foreground': '#F1E0D5',
      muted: '#2A201B',
      'muted-foreground': '#BBA79B',
      accent: '#3D2A20',
      'accent-foreground': '#F7DDCD',
      destructive: '#FF8FA0',
      'destructive-foreground': '#2B0509',
      border: '#7A675E',
      input: '#8A766D',
      ring: '#EF8E6D',
    },
  },

  C: {
    nome: 'Ameixa',
    ideia: 'Berinjela com toque de damasco. Mais marcante, foge do verde de "eco".',
    claro: {
      background: '#FAF8FA',
      foreground: '#231A26',
      card: '#FFFFFF',
      'card-foreground': '#231A26',
      popover: '#FFFFFF',
      'popover-foreground': '#231A26',
      primary: '#6A2E6D',
      'primary-foreground': '#FFFFFF',
      secondary: '#EEE5EF',
      'secondary-foreground': '#46204A',
      muted: '#F2EEF2',
      'muted-foreground': '#5E5463',
      accent: '#F8E2C4',
      'accent-foreground': '#4A2C08',
      destructive: '#B42318',
      'destructive-foreground': '#FFFFFF',
      border: '#918895',
      input: '#7C7280',
      ring: '#6A2E6D',
    },
    escuro: {
      background: '#161218',
      foreground: '#EEE6F0',
      card: '#1F1A22',
      'card-foreground': '#EEE6F0',
      popover: '#1F1A22',
      'popover-foreground': '#EEE6F0',
      primary: '#CDA6DE',
      'primary-foreground': '#26102A',
      secondary: '#2E2431',
      'secondary-foreground': '#EADCEB',
      muted: '#251F28',
      'muted-foreground': '#B3A6B6',
      accent: '#3E2F1C',
      'accent-foreground': '#F6D9AE',
      destructive: '#F4877B',
      'destructive-foreground': '#2A0805',
      border: '#706575',
      input: '#817686',
      ring: '#CDA6DE',
    },
  },

  D: {
    nome: 'Barro neutro',
    ideia: 'A B com fundo, muted e bordas em cinza neutro. O barro fica só no que é ação, selo e destaque.',
    claro: {
      background: '#FAFAFA',
      foreground: '#1F1C1B',
      card: '#FFFFFF',
      'card-foreground': '#1F1C1B',
      popover: '#FFFFFF',
      'popover-foreground': '#1F1C1B',
      primary: '#A33E23',
      'primary-foreground': '#FFFFFF',
      secondary: '#F4E5DA',
      'secondary-foreground': '#58291A',
      muted: '#F0F0F0',
      'muted-foreground': '#5A5A5A',
      accent: '#F6DCCB',
      'accent-foreground': '#58291A',
      destructive: '#9B1C31',
      'destructive-foreground': '#FFFFFF',
      border: '#8A8A8A',
      input: '#737373',
      ring: '#A33E23',
    },
    escuro: {
      background: '#151515',
      foreground: '#EDEBEA',
      card: '#1D1D1D',
      'card-foreground': '#EDEBEA',
      popover: '#1D1D1D',
      'popover-foreground': '#EDEBEA',
      primary: '#EF8E6D',
      'primary-foreground': '#2A0F06',
      secondary: '#33261F',
      'secondary-foreground': '#F1E0D5',
      muted: '#262626',
      'muted-foreground': '#ADADAD',
      accent: '#3D2A20',
      'accent-foreground': '#F7DDCD',
      destructive: '#FF8FA0',
      'destructive-foreground': '#2B0509',
      border: '#6E6E6E',
      input: '#7D7D7D',
      ring: '#EF8E6D',
    },
  },
};

// Pares que a interface usa de verdade. `tipo` define o mínimo do WCAG 2:
//   texto  → 4,5:1 (1.4.3)   grande → 3:1 (1.4.3, ≥ 24 px ou ≥ 18,66 px em 600)
//   ui     → 3:1 (1.4.11: borda de componente, estado, foco)
// eslint-disable-next-line no-unused-vars
var PARES = [
  { frente: 'foreground', fundo: 'background', tipo: 'texto', uso: 'Texto do corpo na tela' },
  { frente: 'card-foreground', fundo: 'card', tipo: 'texto', uso: 'Texto dentro do card do Post' },
  { frente: 'popover-foreground', fundo: 'popover', tipo: 'texto', uso: 'Texto em menu e drawer' },
  { frente: 'muted-foreground', fundo: 'background', tipo: 'texto', uso: 'Texto de apoio na tela' },
  { frente: 'muted-foreground', fundo: 'card', tipo: 'texto', uso: 'Bairro e validade no card' },
  { frente: 'muted-foreground', fundo: 'muted', tipo: 'texto', uso: 'Texto na faixa de compromissos' },
  { frente: 'foreground', fundo: 'muted', tipo: 'texto', uso: 'Título na faixa de compromissos' },
  { frente: 'primary-foreground', fundo: 'primary', tipo: 'texto', uso: 'Botão principal, filtro marcado' },
  { frente: 'secondary-foreground', fundo: 'secondary', tipo: 'texto', uso: 'Selo Doação / Troca' },
  { frente: 'accent-foreground', fundo: 'accent', tipo: 'texto', uso: 'Item em hover/ativo, ícone do compromisso' },
  { frente: 'destructive-foreground', fundo: 'destructive', tipo: 'texto', uso: 'Botão destrutivo (Excluir conta)' },
  { frente: 'destructive', fundo: 'background', tipo: 'texto', uso: 'Mensagem de erro do campo' },
  { frente: 'primary', fundo: 'background', tipo: 'texto', uso: 'Link na tela ("Trocar número")' },
  { frente: 'primary', fundo: 'card', tipo: 'texto', uso: 'Link dentro de card' },
  { frente: 'primary', fundo: 'accent', tipo: 'grande', uso: 'Número do passo (24 px, 600)' },
  { frente: 'input', fundo: 'background', tipo: 'ui', uso: 'Borda do campo e do botão "Como funciona"' },
  { frente: 'input', fundo: 'card', tipo: 'ui', uso: 'Borda de campo dentro de card' },
  { frente: 'border', fundo: 'background', tipo: 'ui', uso: 'Borda do card do Post e divisórias' },
  { frente: 'border', fundo: 'card', tipo: 'ui', uso: 'Divisória dentro do card' },
  { frente: 'primary', fundo: 'background', tipo: 'ui', uso: 'Botão principal e filtro marcado contra a tela' },
  { frente: 'primary', fundo: 'card', tipo: 'ui', uso: 'Filtro marcado dentro de card' },
  { frente: 'ring', fundo: 'background', tipo: 'ui', uso: 'Anel de foco (2 px, afastado 2 px)' },
  { frente: 'ring', fundo: 'card', tipo: 'ui', uso: 'Anel de foco dentro de card' },
  { frente: 'destructive', fundo: 'background', tipo: 'ui', uso: 'Borda do campo com erro' },
  { frente: 'destructive', fundo: 'card', tipo: 'ui', uso: 'Borda de campo com erro em card' },
];

// WCAG 2: luminância relativa de cor sRGB e razão (L1 + 0,05) / (L2 + 0,05).
// Usa o limiar 0,04045 do sRGB (a WCAG 2.x cita 0,03928; não muda nenhum resultado em 8 bits).
// eslint-disable-next-line no-unused-vars
function luminancia(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  const canal = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
}

// eslint-disable-next-line no-unused-vars
function razao(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// eslint-disable-next-line no-unused-vars
var MINIMO = { texto: 4.5, grande: 3, ui: 3 };

if (typeof module !== 'undefined') module.exports = { PALETAS, PARES, razao, MINIMO };
