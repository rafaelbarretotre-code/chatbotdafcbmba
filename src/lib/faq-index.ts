// Lista de categorias e perguntas do FAQ — usada pela UI para navegação.
// Mantenha em sincronia com FAQ_NORMATIVO em chat.functions.ts.

export type FAQCategory =
  | "Concessão"
  | "Comprovação"
  | "Limites"
  | "Prazos"
  | "Hipóteses"
  | "INSS"
  | "ISS / Simples"
  | "Contribuinte Individual"
  | "Contato";

export const FAQ_INDEX: { category: FAQCategory; question: string }[] = [
  // Concessão
  { category: "Concessão", question: "Quais documentos compõem o processo de Concessão do Adiantamento?" },
  { category: "Concessão", question: "O que é o PAD (Pedido de Adiantamento) e quem assina?" },
  { category: "Concessão", question: "Qual é o tipo de processo SEI usado para Adiantamento?" },

  // Comprovação
  { category: "Comprovação", question: "Quais documentos são exigidos na Comprovação (prestação de contas) do Adiantamento?" },
  { category: "Comprovação", question: "Como devo inserir as notas fiscais no SEI?" },
  { category: "Comprovação", question: "O que é o atesto e quem deve assiná-lo?" },
  { category: "Comprovação", question: "Como deve ser o documento hábil (nota fiscal/recibo)?" },

  // Limites
  { category: "Limites", question: "Quais os limites de concessão e aplicação válidos a partir de 01/01/2026?" },
  { category: "Limites", question: "Qual o valor máximo por item de gasto na alínea 'a'?" },
  { category: "Limites", question: "Quando posso usar declaração no lugar de documento hábil?" },

  // Prazos
  { category: "Prazos", question: "Qual o prazo para apresentar a comprovação do Adiantamento?" },
  { category: "Prazos", question: "O que acontece em caso de devolução de recurso fora do prazo?" },

  // Hipóteses
  { category: "Hipóteses", question: "Quais são as hipóteses de uso do Adiantamento previstas no Art. 5º?" },
  { category: "Hipóteses", question: "Quando é obrigatório apresentar 3 cotações de preço?" },

  // INSS
  { category: "INSS", question: "Como funciona o recolhimento do INSS patronal (20%) para prestador PF ou MEI?" },

  // ISS / Simples
  { category: "ISS / Simples", question: "Quando NÃO devo reter ISS de empresa optante pelo Simples Nacional?" },
  { category: "ISS / Simples", question: "Qual alíquota de ISS aplicar quando a empresa não informa no documento fiscal?" },
  { category: "ISS / Simples", question: "Como calcular a alíquota de retenção de ISS para optante do Simples Nacional?" },

  // Contribuinte Individual
  { category: "Contribuinte Individual", question: "Quais são as obrigações do responsável quando contrata Contribuinte Individual?" },

  // Contato
  { category: "Contato", question: "Qual o contato do DAF para dúvidas sobre Adiantamento?" },
];

export const FAQ_CATEGORIES: FAQCategory[] = [
  "Concessão",
  "Comprovação",
  "Limites",
  "Prazos",
  "Hipóteses",
  "INSS",
  "ISS / Simples",
  "Contribuinte Individual",
  "Contato",
];
