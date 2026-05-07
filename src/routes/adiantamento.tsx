import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import brasao from "@/assets/cbmba-brasao.png";
import { chatWithDAF } from "@/server/chat.functions";

export const Route = createFileRoute("/adiantamento")({
  head: () => ({
    meta: [
      { title: "Assistente DAF — Verba de Adiantamento | CBMBA" },
      {
        name: "description",
        content:
          "Chatbot oficial do DAF/CBMBA para esclarecer dúvidas sobre Verba de Adiantamento, prestação de contas e tributos.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGESTOES = [
  "Quais documentos compõem o processo de Concessão do Adiantamento no SEI?",
  "Quais documentos são exigidos na Comprovação (prestação de contas)?",
  "Quais os limites de concessão e aplicação válidos a partir de 01/01/2026?",
  "Qual o prazo para apresentar a comprovação do Adiantamento?",
  "Como funciona o recolhimento do INSS patronal (20%) para prestador PF ou MEI?",
  "Quando NÃO devo reter ISS de empresa optante pelo Simples Nacional?",
  "Qual alíquota de ISS aplicar quando a empresa não informar no documento fiscal?",
  "Em qual subelemento de despesa (30.xx) entra a compra de material de escritório?",
  "Posso adquirir material de limpeza com Verba de Adiantamento? Em qual rubrica?",
  "Quais são as hipóteses de uso do Adiantamento previstas no Art. 5º da IN SAF 21/2017?",
  "Quando é obrigatório apresentar 3 cotações de preço?",
  "O que fazer em caso de devolução de recurso fora do prazo?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o **Assistente DAF** do CBMBA. Posso esclarecer dúvidas sobre **Verba de Adiantamento**.\n\nComo posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chatWithDAF({
        data: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.content },
      ]);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Erro ao consultar o assistente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-secondary text-secondary-foreground shadow-[var(--shadow-card)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <img
              src={brasao}
              alt="Brasão CBMBA"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Assistente DAF
              </div>
              <div className="text-sm font-semibold text-white">
                Verba de Adiantamento · CBMBA
              </div>
            </div>
          </Link>
          <Link
            to="/"
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10"
          >
            ← Capa
          </Link>
        </div>
      </header>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <Bubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                Consultando a base normativa…
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {messages.length === 1 && (
            <div className="mt-8">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sugestões
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGESTOES.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-md border border-border bg-card p-3 text-left text-sm text-card-foreground shadow-[var(--shadow-card)] transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <footer className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto flex max-w-4xl items-end gap-2 px-4 py-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Digite sua pergunta sobre Adiantamento…"
            className="max-h-40 min-h-[48px] flex-1 resize-none rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: "var(--gradient-primary)" }}
          >
            Enviar
          </button>
        </form>
        <div className="pb-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          DAF · CBMBA · (71) 99948-6873
        </div>
      </footer>
    </main>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isUser ? "EU" : "DAF"}
      </div>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-[var(--shadow-card)] ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "border border-border bg-card text-card-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-headings:text-foreground prose-p:my-1.5 prose-p:leading-relaxed prose-strong:text-primary prose-ul:my-1.5 prose-li:my-0.5 prose-a:text-primary">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
