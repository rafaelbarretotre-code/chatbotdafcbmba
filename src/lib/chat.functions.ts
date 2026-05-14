import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import subelementosData from "./subelementos.json";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

type Sub = { code: string; name: string; desc: string; items: string[] };
const SUBELEMENTOS = subelementosData as Sub[];

// ============================================================
// FAQ — única fonte de informação consultada pelo assistente.
// Cada entrada é uma pergunta + resposta + palavras-chave.
// ============================================================
type FAQ = { q: string; a: string; keywords: string[] };

const FAQ_NORMATIVO: FAQ[] = [
  // ---------- CONCESSÃO ----------
  {
    q: "Quais documentos compõem o processo de Concessão do Adiantamento?",
    keywords: [
      "concessao", "concessão", "documentos concessão", "abertura", "iniciar processo",
      "sei concessão", "pad", "ped", "empenho", "liquidacao", "liquidação", "nob",
      "ofício", "oficio", "art. 39 i", "art 39 i",
    ],
    a: `### Concessão do Adiantamento (Art. 39, §2º, I — IN SAF 21/2017)

Iniciar processo no SEI tipo **"Adiantamento: Concessão e Prestação de Contas"** contendo:

1. **Solicitação de Adiantamento** (modelo SEI)
2. **Pedido de Adiantamento (PAD)** — assinado pelo Ordenador de Despesa e responsável pela aplicação
3. **Pedido de Empenho (PED)** — assinado pelo Ordenador
4. **Empenho (EMP)** — assinado pelo Ordenador
5. **Liquidação (LIQ)**
6. **Nota de Ordem Bancária (NOB)**
7. **Ofício da Unidade Gestora** encaminhando o processo com orientações ao responsável pela aplicação`,
  },
  {
    q: "O que é o PAD (Pedido de Adiantamento) e quem assina?",
    keywords: ["pad", "pedido de adiantamento", "quem assina pad", "ordenador"],
    a: `O **PAD (Pedido de Adiantamento)** é o documento SEI que formaliza o pedido de concessão. Deve ser assinado pelo **Ordenador de Despesa** e pelo **responsável pela aplicação** do recurso.`,
  },
  {
    q: "Qual é o tipo de processo SEI usado para Adiantamento?",
    keywords: ["tipo processo sei", "sei tipo", "qual processo sei"],
    a: `O processo SEI deve ser do tipo **"Adiantamento: Concessão e Prestação de Contas"**. O processo de Comprovação é aberto **relacionado** ao processo de Concessão.`,
  },

  // ---------- COMPROVAÇÃO ----------
  {
    q: "Quais documentos são exigidos na Comprovação (prestação de contas) do Adiantamento?",
    keywords: [
      "comprovacao", "comprovação", "prestacao de contas", "prestação de contas",
      "documentos prestação", "documentos comprovação", "art. 39 ii", "art 39 ii",
      "nf-e", "nota fiscal", "cupom", "recibo", "almoxarifado",
      "declaração de recebimento", "extrato", "certidão de regularidade",
    ],
    a: `### Comprovação do Adiantamento (Art. 39, §2º, II — IN SAF 21/2017)

Iniciar processo SEI **relacionado ao da Concessão**, contendo:

1. **Pedido de Material** com declaração do Almoxarifado autorizando a aquisição
2. **Documentos hábeis** (NF-e, cupons fiscais, recibos) — **um documento SEI por documento hábil**
3. **Declaração de recebimento** do material/serviço (datada e assinada)
4. Para **serviços (alínea "h")**: **3 orçamentos** + autorização do Ordenador
5. Em **contratação de PJ**: comprovantes de retenção de tributos quando necessário
   - Calcular retenções (ex.: ISS) e pagar o **valor líquido** ao prestador
   - Recolher o valor retido com o próprio cartão de Adiantamento
   - Inserir DAM e comprovante de pagamento
6. **Saque em espécie**: justificativa assinada pelo Ordenador
7. **Devolução de recurso**: DAE + comprovante
8. **Comprovação de Adiantamento** (modelo SEI)
9. **Extrato bancário** com **TODOS** os lançamentos
10. **Justificativa de inconsistências** (assinada pelo Ordenador)
11. **Certidão de Regularidade** (confeccionada e assinada na Unidade Gestora)

**Observações:**
- Documentos externos: 1 arquivo = 1 documento
- Evitar contratação de Pessoa Física (complexidade tributária)
- Assinaturas preferencialmente eletrônicas
- Documentos Nato-digitais: anexar "Atesto de documentos externos"
- Documentos Digitalizados: devem ser autenticados`,
  },
  {
    q: "Como devo inserir as notas fiscais no SEI?",
    keywords: ["nota fiscal sei", "como inserir nf", "documento por documento", "1 documento"],
    a: `Cada documento hábil (NF-e, cupom fiscal, recibo) deve ser inserido **como um documento SEI separado** — regra de **1 arquivo = 1 documento**. Documentos **Nato-digitais** exigem o "Atesto de documentos externos"; documentos **digitalizados** devem ser **autenticados**.`,
  },
  {
    q: "O que é o atesto e quem deve assiná-lo?",
    keywords: ["atesto", "art. 27", "art 27", "superior hierárquico", "atestar"],
    a: `Conforme **Art. 27 da IN SAF 21/2017**, o **atesto** do documento hábil deve ser feito pelo **superior hierárquico imediato** ao responsável pela aplicação do Adiantamento.`,
  },
  {
    q: "Como deve ser o documento hábil (nota fiscal/recibo)?",
    keywords: ["documento hábil", "documento habil", "art. 26", "art 26", "rasura", "legível"],
    a: `Conforme **Art. 26 da IN SAF 21/2017**, o documento hábil deve ser:

- **Original**
- Emitido em nome da **Secretaria/Órgão e da Unidade Gestora**
- **Legível**, sem rasuras ou emendas
- Conter discriminação clara dos itens, quantidades, valores e data`,
  },

  // ---------- LIMITES ----------
  {
    q: "Quais os limites de concessão e aplicação válidos a partir de 01/01/2026?",
    keywords: [
      "limite", "limites", "anexo vii", "anexo 7", "2026", "valor concessão",
      "valor aplicação", "miúda", "miuda", "alínea a", "alinea a", "alínea h", "alinea h",
      "3929", "491", "982", "decreto 12807", "decreto 22595",
    ],
    a: `### Limites — Anexo VII (válidos a partir de 01/01/2026)

**Concessão:**
- Despesas Miúdas (alínea **"a"**): **R$ 3.929,00**
- Reparos / Adaptação / Recuperação de Bens Móveis e Imóveis (alínea **"h"**): **R$ 3.929,00**

**Aplicação:**
- Despesas das alíneas **"a"** e **"e"** sem documento hábil (mediante declaração): **R$ 491,00**
- Item de gasto (alínea **"a"**): **R$ 982,00**

Base legal: **Decreto Federal nº 12.807/2025** e **Decreto Estadual nº 22.595/2024**.`,
  },
  {
    q: "Qual o valor máximo por item de gasto na alínea 'a'?",
    keywords: ["valor máximo item", "item de gasto", "982", "limite item"],
    a: `O limite por **item de gasto** na alínea **"a"** é de **R$ 982,00** (válido a partir de 01/01/2026).`,
  },
  {
    q: "Quando posso usar declaração no lugar de documento hábil?",
    keywords: ["sem documento hábil", "declaração", "491", "alínea e", "alinea e"],
    a: `Para despesas das alíneas **"a"** e **"e"** **sem documento hábil**, é admitido o uso de **declaração**, limitada a **R$ 491,00** (a partir de 01/01/2026).`,
  },

  // ---------- PRAZOS ----------
  {
    q: "Qual o prazo para apresentar a comprovação do Adiantamento?",
    keywords: [
      "prazo", "30 dias", "comprovação prazo", "art. 18", "art 18",
      "5 dias úteis", "antecedência", "fim do prazo",
    ],
    a: `### Prazo para Comprovação (Art. 18, IV — IN SAF 21/2017)

- **Até 30 dias consecutivos** após o término do período de aplicação.
- A documentação deve ser apresentada com **no mínimo 5 dias úteis de antecedência** ao fim do prazo (Art. 18, parágrafo único, IV c/c Art. 39, §1º).`,
  },
  {
    q: "O que acontece em caso de devolução de recurso fora do prazo?",
    keywords: ["devolução fora do prazo", "art. 37", "art 37", "atualização monetária", "cute", "dae"],
    a: `Conforme **Art. 37 da IN SAF 21/2017**, a devolução fora do prazo exige:

- **Atualização monetária** do valor a ser devolvido
- **Recolhimento à CUTE via DAE** em **guias separadas** (principal e atualização)`,
  },

  // ---------- HIPÓTESES (ART. 5º) ----------
  {
    q: "Quais são as hipóteses de uso do Adiantamento previstas no Art. 5º?",
    keywords: [
      "hipóteses", "hipoteses", "art. 5", "art 5", "quando usar", "miúda",
      "pronto pagamento", "secreto", "viagens", "leilão", "leilao",
      "refeições", "refeicoes",
    ],
    a: `### Hipóteses de uso do Adiantamento (Art. 5º — IN SAF 21/2017)

a) Despesas **miúdas e de pronto pagamento**
b) Despesas de **caráter secreto**
c) Aquisição de **livros, peças e objetos de coleção**
d) **Viagens**
e) Pagamento de **pessoal/salários** em local específico
f) **Refeições**
g) (conforme normativa específica)
h) **Reparos, adaptação e recuperação de bens móveis e imóveis**
i) **Leilão e aquisição de animais**`,
  },
  {
    q: "Quando é obrigatório apresentar 3 cotações de preço?",
    keywords: ["3 cotações", "três cotações", "cotação", "cotacao", "art. 9", "art 9"],
    a: `Conforme **Art. 9º da IN SAF 21/2017**, é obrigatório apresentar **3 cotações** sempre que o valor da aquisição/serviço **ultrapassar o limite definido no Anexo VII**. **Não se aplica à alínea "a"** (despesas miúdas e de pronto pagamento).`,
  },

  // ---------- INSS ----------
  {
    q: "Como funciona o recolhimento do INSS patronal (20%) para prestador PF ou MEI?",
    keywords: [
      "inss", "patronal", "20%", "pessoa física", "pessoa fisica", "pf",
      "mei", "hidráulica", "hidraulica", "elétrica", "eletrica", "alvenaria",
      "carpintaria", "manutenção veículo", "manutencao veiculo", "darf", "cota patronal",
      "00052495231", "2022.0002525",
    ],
    a: `### Recolhimento de INSS Patronal (PF e MEI)

Para serviços tomados de **pessoa física ou MEI** (hidráulica, elétrica, alvenaria, carpintaria, manutenção/reparo de veículos):

- O Estado contribui com a **cota patronal de 20%**
- **Não há retenção do INSS** do fornecedor — paga-se à parte com o limite do cartão de Adiantamento
- O militar deve manter limite no cartão para o INSS patronal
- Preencher a planilha do documento SEI nº **00052495231** com dados do fornecedor **até o último dia do mês indicado na NF**
- Encaminhar à Unidade Gestora; depois recebe o **DARF** para pagamento com o cartão corporativo
- Referência: Processo SEI nº **089.3200.2022.0002525-11**

📞 **Contato DAF:** (71) 99948-6873`,
  },

  // ---------- ISS / SIMPLES NACIONAL ----------
  {
    q: "Quando NÃO devo reter ISS de empresa optante pelo Simples Nacional?",
    keywords: [
      "não reter iss", "nao reter iss", "valores fixos", "simples nacional", "lc 123 iv",
      "iss simples", "tributado fixo",
    ],
    a: `Conforme **LC 123/06, art. 21, §4º, IV**: **NÃO HÁ RETENÇÃO** de ISS quando a empresa for ME/EPP optante pelo Simples Nacional **e** o ISS estiver sendo tributado por **valores fixos mensais** no regime do Simples.`,
  },
  {
    q: "Qual alíquota de ISS aplicar quando a empresa não informa no documento fiscal?",
    keywords: ["alíquota", "aliquota", "5%", "não informou", "nao informou", "iss padrão", "lc 123 v"],
    a: `Conforme **LC 123/06, art. 21, §4º, V**: quando a empresa optante pelo Simples Nacional **não informar** a alíquota efetiva no documento fiscal, deve-se aplicar a alíquota padrão de **5%** sobre o valor do serviço.`,
  },
  {
    q: "Como calcular a alíquota de retenção de ISS para optante do Simples Nacional?",
    keywords: ["alíquota retenção iss", "calcular iss", "lc 123 i", "lc 123 ii", "mês anterior"],
    a: `### Retenção de ISS — ME/EPP Simples Nacional (LC 123/06, art. 21, §4º)

- **I** — Alíquota informada no documento fiscal = **alíquota efetiva do mês anterior**
- **II** — No **mês de início de atividades**, aplicar **2%**
- **IV** — Se ISS for tributado por **valores fixos mensais** → **NÃO retém**
- **V** — Se a empresa **não informar** alíquota → aplicar **5%**
- **VII** — O valor retido é **definitivo** e não compõe partilha do Simples

**Procedimento:**
1. Verificar se é optante: https://www8.receita.fazenda.gov.br/simplesnacional/
2. Verificar enquadramento ME/EPP: consulta CNPJ na Receita Federal`,
  },

  // ---------- CONTRIBUINTE INDIVIDUAL ----------
  {
    q: "Quais são as obrigações do responsável quando contrata Contribuinte Individual?",
    keywords: [
      "contribuinte individual", "anexo v", "gps", "elemento 36", "elemento 47",
      "gfip", "previdenciária", "previdenciaria", "inscrever inss",
    ],
    a: `### Contribuinte Individual (Anexo V — IN SAF 21/2017)

**Responsável pelo Adiantamento:**
- **Inscrever** o prestador PF no INSS, se necessário
- **Calcular** retenção previdenciária e pagar **valor líquido** ao prestador
- **Fornecer recibo** conforme legislação INSS
- Enviar **mensalmente CI** à Unidade Gestora com lista (CPF, inscrição INSS, PAD, valor retido)
- Anexar cópia da CI ao processo de comprovação

**Unidade Gestora:**
- Recolher mensalmente por **GPS** (elemento **36**)
- Empenhar **cota patronal** mensalmente (elemento **47**), separada das demais despesas
- Emitir **GFIP** mensalmente (www.mpas.gov.br)`,
  },

  // ---------- CONTATO ----------
  {
    q: "Qual o contato do DAF para dúvidas sobre Adiantamento?",
    keywords: ["contato", "telefone", "daf", "dúvidas", "duvidas", "99948"],
    a: `📞 **Coordenação de Finanças e Normatização do DAF/CBMBA: (71) 99948-6873**`,
  },
];

// FAQ gerada automaticamente para cada subelemento de despesa
const FAQ_SUBELEMENTOS: FAQ[] = SUBELEMENTOS.map((sub) => {
  const examples = sub.items.slice(0, 12).join(", ");
  const more = sub.items.length > 12 ? ` … (+${sub.items.length - 12} itens)` : "";
  return {
    q: `Em qual subelemento entram itens de "${sub.name}"?`,
    keywords: [
      sub.code,
      sub.code.replace(".", ""),
      `subelemento ${sub.code}`,
      `rubrica ${sub.code}`,
      `elemento ${sub.code}`,
      sub.name.toLowerCase(),
      ...sub.items.map((i) => i.toLowerCase()),
    ],
    a: `### ${sub.code} — ${sub.name}

${sub.desc || ""}

**Exemplos de itens enquadrados nesta rubrica:**
${examples}${more}

> Rubrica orçamentária: **3.3.90.30.${sub.code.split(".")[1]}**`,
  };
});

const FAQ: FAQ[] = [...FAQ_NORMATIVO, ...FAQ_SUBELEMENTOS];

// ----- Normalização e busca por palavras-chave -----
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set([
  "a", "o", "as", "os", "um", "uma", "de", "da", "do", "das", "dos", "e",
  "que", "em", "no", "na", "nos", "nas", "para", "por", "com", "sem", "se",
  "ao", "aos", "como", "qual", "quais", "ser", "sao", "tem", "ha", "ou",
  "mais", "meu", "minha", "voce", "voces", "isso", "isto", "esse", "essa",
  "este", "esta", "ja", "nao", "sim", "pelo", "pela", "sobre", "quando",
  "onde", "porque", "fazer", "posso", "devo", "deve", "entra", "entram",
  "qual", "quais",
]);

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function searchFAQ(query: string): { entry: FAQ; score: number }[] {
  const qNorm = normalize(query);
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  return FAQ.map((entry) => {
    const haystack = normalize(
      entry.q + " " + entry.keywords.join(" ") + " " + entry.a,
    );
    const qHay = normalize(entry.q);
    const kwSet = entry.keywords.map(normalize);

    let score = 0;
    // Pergunta inteira muito similar
    if (qNorm && qHay.includes(qNorm)) score += 20;

    // Keyword exata aparece na pergunta do usuário
    for (const kw of kwSet) {
      if (kw && qNorm.includes(kw)) score += 6;
    }

    // Tokens individuais
    for (const t of qTokens) {
      if (qHay.includes(t)) score += 3; // peso maior se está na pergunta da FAQ
      else if (haystack.includes(t)) score += 1;
    }

    return { entry, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

const FALLBACK = `Não encontrei essa informação na **base de FAQ** carregada.

Tente reformular a pergunta usando termos como:
*concessão, comprovação, INSS, ISS, Simples Nacional, limites, prazo, subelemento (30.xx), Art. 5º, cotações, devolução*.

Para casos específicos, contate a **Coordenação de Finanças e Normatização do DAF/CBMBA**:

📞 **(71) 99948-6873**`;

export const chatWithDAF = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return { content: "Olá! Faça sua pergunta sobre Verba de Adiantamento." };
    }

    const results = searchFAQ(lastUser.content);
    if (results.length === 0) {
      return { content: FALLBACK };
    }

    const top = results.slice(0, 2);
    const content =
      top
        .map((r) => `**❓ ${r.entry.q}**\n\n${r.entry.a}`)
        .join("\n\n---\n\n") +
      "\n\n---\n*Fonte: FAQ da IN SAF nº 21/2017 — DAF/CBMBA · (71) 99948-6873*";

    return { content };
  });
