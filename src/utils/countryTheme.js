// Deriva o país/seleção real de um produto a partir do texto de nome/descrição
// já carregado (mesma estratégia usada nos filtros de categoria), em vez de usar
// a posição do item na lista — isso evita vincular produtos a bandeiras erradas.
// Usado tanto na lista de produtos quanto na tela de favoritos, para manter o
// mesmo comportamento nas duas telas.

const GREEN = "#15622A";

export const COUNTRY_THEMES = [
  { bg: "#D4EDDA", accent: "#009C3B", flag: "🇧🇷" },
  { bg: "#D6E8F5", accent: "#1565C0", flag: "🇦🇷" },
  { bg: "#DDEAF7", accent: "#002395", flag: "🇫🇷" },
  { bg: "#E8E8E8", accent: "#333333", flag: "🇩🇪" },
  { bg: "#D4EDDA", accent: "#006600", flag: "🇵🇹" },
  { bg: "#F7DADA", accent: "#AA151B", flag: "🇪🇸" },
  { bg: "#E3E0F7", accent: "#3D1F94", flag: "🏴" },
];

export const COUNTRY_KEYWORDS = [
  { key: "brasil", words: ["brasil", "brazil", "canarinho", "seleção brasileira", "selecao brasileira"], theme: COUNTRY_THEMES[0] },
  { key: "argentina", words: ["argentina", "albiceleste"], theme: COUNTRY_THEMES[1] },
  { key: "franca", words: ["frança", "franca", "france", "les bleus"], theme: COUNTRY_THEMES[2] },
  { key: "alemanha", words: ["alemanha", "germany", "deutschland"], theme: COUNTRY_THEMES[3] },
  { key: "portugal", words: ["portugal", "selecao das quinas", "seleção das quinas"], theme: COUNTRY_THEMES[4] },
  { key: "espanha", words: ["espanha", "spain", "la roja"], theme: COUNTRY_THEMES[5] },
  { key: "inglaterra", words: ["inglaterra", "england", "three lions"], theme: COUNTRY_THEMES[6] },
];

export const NEUTRAL_COUNTRY_THEME = { bg: "rgba(120,120,120,0.18)", accent: GREEN, flag: null };

export function getCountryTheme(product) {
  const haystack = `${product?.name ?? ""} ${product?.description ?? ""}`.toLowerCase();
  const match = COUNTRY_KEYWORDS.find(({ words }) => words.some((w) => haystack.includes(w)));
  return match ? match.theme : NEUTRAL_COUNTRY_THEME;
}
