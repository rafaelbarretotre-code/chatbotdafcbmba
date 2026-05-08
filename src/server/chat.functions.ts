import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import itensAdiantamento from "./itens-adiantamento.md?raw";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

// ============================================================
// BASE DE CONHECIMENTO — pesquisada localmente, sem IA
// ============================================================
const KB: { title: string; keywords: string[]; body: string }[] = [
  {
    title: "Concessão do Adiantamento (Art. 39, §2º, I)",
    keywords: [
      "concessao", "concessão", "iniciar", "abrir processo", "sei", "pad",
      "ped", "empenho", "liquidacao", "liquidação", "nob", "ofício", "oficio",
      "documentos concessão", "abertura",
    ],
    body: `### Concessão do Adiantamento (Art. 39, §2º, I da IN SAF 21/2017)
Iniciar processo no SEI tipo **"Adiantamento: Concessão e Prestação de Contas"** contendo:

1. Solicitação de Adiantamento (modelo SEI)
2. Pedido de Adiantamento (PAD) — assinado pelo Ordenador de Despesa e responsável pela aplicação
3. Pedido de Empenho (PED) — assinado pelo Ordenador
4. Empenho (EMP) — assinado pelo Ordenador
5. Liquidação (LIQ)
6. Nota de Ordem Bancária (NOB)
7. Ofício da Unidade Gestora encaminhando o processo com orientações ao responsável`,
  },
  {
    title: "Comprovação / Prestação de Contas (Art. 39, §2º, II)",
    keywords: [
      "comprovacao", "comprovação", "prestacao", "prestação", "contas",
      "documentos prestação", "nf-e", "nota fiscal", "cupom", "recibo",
      "almoxarifado", "declaração de recebimento", "extrato", "certidão",
      "três orçamentos", "3 orçamentos", "orçamento",
    ],
    body: `### Comprovação do Adiantamento (Art. 39, §2º, II da IN SAF 21/2017)
Iniciar processo SEI relacionado ao da Concessão, contendo:

1. Pedido de Material com declaração do Almoxarifado autorizando a aquisição
2. Documentos hábeis (NF-e, cupons fiscais, recibos) — **um documento SEI por documento hábil**
3. Declaração de recebimento do material/serviço (datada e assinada)
4. Para serviços (alínea "h"): **3 orçamentos** + autorização do Ordenador
5. Em contratação de PJ: comprovantes de retenção de tributos quando necessário
   - Calcular retenções (ex.: ISS) e pagar o **valor líquido** ao prestador
   - Recolher o valor retido com o próprio cartão
   - Inserir DAM e comprovante de pagamento
6. Saque em espécie: justificativa assinada pelo Ordenador
7. Devolução de recurso: DAE + comprovante
8. Comprovação de Adiantamento (modelo SEI)
9. Extrato bancário com **TODOS** os lançamentos
10. Justificativa de inconsistências (assinada pelo Ordenador)
11. Certidão de Regularidade (confeccionada e assinada na Unidade Gestora)

**Observações:**
- Documentos externos: 1 arquivo = 1 documento
- Evitar contratação de Pessoa Física (complexidade tributária)
- Assinaturas preferencialmente eletrônicas
- Documentos Nato-digitais: anexar "Atesto de documentos externos"
- Documentos Digitalizados: devem ser autenticados`,
  },
  {
    title: "Limites de Concessão e Aplicação (Anexo VII — 01/01/2026)",
    keywords: [
      "limite", "limites", "valor", "valores", "anexo vii", "anexo 7",
      "2026", "concessão valor", "aplicação valor", "miúda", "miuda",
      "reparo", "alínea a", "alinea a", "alínea h", "alinea h",
    ],
    body: `### Limites — Anexo VII (válidos a partir de 01/01/2026)

**Concessão:**
- Despesas Miúdas (alínea "a"): **R$ 3.929,00**
- Reparos / Adaptação / Recuperação de Bens Móveis e Imóveis (alínea "h"): **R$ 3.929,00**

**Aplicação:**
- Despesas das alíneas "a" e "e" sem documento hábil (mediante declaração): **R$ 491,00**
- Item de gasto (alínea "a"): **R$ 982,00**

Base legal: Decreto Federal nº 12.807/2025 e Decreto Estadual nº 22.595/2024.`,
  },
  {
    title: "Prazo de Comprovação",
    keywords: [
      "prazo", "30 dias", "comprovação prazo", "art. 18", "art 18",
      "5 dias úteis", "antecedência", "fim do prazo",
    ],
    body: `### Prazo para Comprovação (Art. 18, IV da IN SAF 21/2017)

- **Até 30 dias consecutivos** após o término da aplicação.
- A documentação de comprovação deve ser apresentada no mínimo **5 dias úteis antes do fim do prazo** (Art. 18, § único, IV c/c Art. 39, §1º).
- **Devolução fora do prazo (Art. 37):** atualização monetária + recolhimento à CUTE via DAE em guias separadas.`,
  },
  {
    title: "INSS Patronal (PF e MEI)",
    keywords: [
      "inss", "patronal", "20%", "pessoa física", "pessoa fisica", "pf",
      "mei", "hidráulica", "elétrica", "alvenaria", "carpintaria",
      "manutenção veículo", "manutencao veiculo", "darf", "cota patronal",
    ],
    body: `### Recolhimento de INSS Patronal (PF e MEI)

Para serviços tomados de **pessoa física ou MEI** (hidráulica, elétrica, alvenaria, carpintaria, manutenção/reparo de veículos):

- O Estado contribui com a **cota patronal de 20%**
- **Não há retenção do INSS do fornecedor** — paga-se à parte com o limite do cartão de Adiantamento
- O militar deve manter limite no cartão para o INSS patronal
- Preencher a planilha do documento SEI nº **00052495231** com dados do fornecedor **até o último dia do mês indicado na NF**
- Encaminhar à Unidade Gestora; depois recebe o **DARF** para pagamento com o cartão corporativo
- Referência: Processo SEI nº **089.3200.2022.0002525-11**

📞 **Contato DAF:** (71) 99948-6873`,
  },
  {
    title: "Retenção de ISS — Simples Nacional (ME/EPP)",
    keywords: [
      "iss", "retenção", "retencao", "simples nacional", "me", "epp",
      "alíquota", "aliquota", "lc 123", "lei complementar 123",
      "valores fixos", "5%", "2%",
    ],
    body: `### Retenção de ISS — ME/EPP optantes pelo Simples Nacional
Base legal: **Lei Complementar 123/06, art. 21, §4º**.

**Regras:**
- **I** — Alíquota de retenção informada no documento fiscal = alíquota efetiva do mês anterior
- **II** — Mês de início de atividades: alíquota efetiva de **2%**
- **IV** — Se o ISS for tributado por **valores fixos mensais** no Simples → **NÃO HÁ RETENÇÃO**
- **V** — Se a empresa não informar a alíquota: aplicar **5%**
- **VII** — O valor retido é definitivo e não compõe partilha do Simples

**Procedimento:**
1. Verificar se é optante: https://www8.receita.fazenda.gov.br/simplesnacional/
2. Verificar enquadramento ME/EPP: consulta CNPJ na Receita Federal`,
  },
  {
    title: "Contribuinte Individual (Anexo V)",
    keywords: [
      "contribuinte individual", "anexo v", "gps", "elemento 36",
      "elemento 47", "gfip", "previdenciária", "previdenciaria",
      "inscrever inss",
    ],
    body: `### Contribuinte Individual (Anexo V da IN SAF 21/2017)

**Responsável pelo Adiantamento:**
- Inscrever prestador PF no INSS, se necessário
- Calcular retenção previdenciária e pagar valor líquido ao prestador
- Fornecer recibo conforme legislação INSS
- Enviar mensalmente CI à Unidade Gestora com lista (CPF, inscrição INSS, PAD, valor retido)
- Anexar cópia da CI ao processo de comprovação

**Unidade Gestora:**
- Recolher mensalmente por **GPS** (elemento 36)
- Empenhar cota patronal mensalmente (elemento 47), separada das demais despesas
- Emitir **GFIP** mensalmente (www.mpas.gov.br)`,
  },
  {
    title: "Hipóteses de uso do Adiantamento (Art. 5º)",
    keywords: [
      "hipóteses", "hipoteses", "art. 5", "art 5", "quando usar",
      "miúda", "pronto pagamento", "secreto", "viagens", "leilão", "leilao",
      "refeições", "refeicoes",
    ],
    body: `### Hipóteses de uso do Adiantamento (Art. 5º da IN SAF 21/2017)

a) Despesas miúdas e de pronto pagamento
b) Despesas de caráter secreto
c) Aquisição de livros, peças e objetos de coleção
d) Viagens
e) Pagamento de pessoal/salários em local específico
f) Refeições
g) (conforme normativa)
h) Reparos, adaptação e recuperação de bens móveis e imóveis
i) Leilão e aquisição de animais

**Cotação (Art. 9º):** acima do limite, exigir **3 cotações** (não se aplica à alínea "a").
**Documento hábil (Art. 26):** original, em nome da Secretaria/órgão e UG, legível, sem rasuras.
**Atesto (Art. 27):** pelo superior hierárquico imediato.`,
  },
  {
    title: "Itens de despesa por subelemento (3.3.90.30)",
    keywords: [
      "subelemento", "rubrica", "3.3.90.30", "30.01", "30.02", "30.03",
      "30.04", "30.05", "30.06", "30.07", "30.16", "30.17", "30.21",
      "30.22", "30.23", "30.24", "30.25", "30.26", "30.27", "30.28",
      "30.29", "30.30", "30.39", "30.42", "30.44", "30.45", "30.46",
      "30.47", "30.48", "30.50", "30.96",
      "material de escritório", "material de escritorio", "limpeza",
      "expediente", "informática", "informatica", "alimentação", "alimentacao",
      "combustível", "combustivel", "lubrificante", "uniforme", "ferramenta",
      "elétrico", "eletrico", "hidráulico", "hidraulico", "gênero", "genero",
      "copa", "cozinha", "elemento", "código", "codigo",
    ],
    body: `### Itens de despesa por subelemento — 3.3.90.30 (Material de Consumo)

Use a tabela abaixo para identificar **em qual subelemento** um item se enquadra. Quando perguntar "posso comprar X?" ou "em qual rubrica entra Y?", localize o item na lista e informe o **código (ex.: 30.02)** e a **categoria**.

${itensAdiantamento}`,
  },
];

// ----- Normalização e busca por palavras-chave -----
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
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
  "onde", "porque",
]);

function tokenize(s: string): string[] {
  return normalize(s)
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function searchKB(query: string): { entry: typeof KB[number]; score: number }[] {
  const qNorm = normalize(query);
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  return KB.map((entry) => {
    const haystack = normalize(
      entry.title + " " + entry.keywords.join(" ") + " " + entry.body,
    );
    const kwSet = entry.keywords.map(normalize);

    let score = 0;
    // pontua keyword exata (frase) na pergunta
    for (const kw of kwSet) {
      if (kw && qNorm.includes(kw)) score += 5;
    }
    // pontua tokens
    for (const t of qTokens) {
      if (haystack.includes(` ${t} `) || haystack.startsWith(`${t} `) || haystack.endsWith(` ${t}`)) {
        score += 2;
      } else if (haystack.includes(t)) {
        score += 1;
      }
    }
    return { entry, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

const FALLBACK = `Não encontrei essa informação na base normativa carregada.

Para casos específicos, entre em contato com a **Coordenação de Finanças e Normatização do DAF/CBMBA**:

📞 **(71) 99948-6873**

Você também pode tentar reformular a pergunta usando termos como: *concessão, comprovação, INSS, ISS, limites, prazo, subelemento, Art. 5º*.`;

export const chatWithDAF = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return { content: "Olá! Faça sua pergunta sobre Verba de Adiantamento." };
    }

    const results = searchKB(lastUser.content);
    if (results.length === 0) {
      return { content: FALLBACK };
    }

    const top = results.slice(0, 2);
    const content =
      top.map((r) => r.entry.body).join("\n\n---\n\n") +
      "\n\n---\n*Fonte: IN SAF nº 21/2017 — DAF/CBMBA · (71) 99948-6873*";

    return { content };
  });
