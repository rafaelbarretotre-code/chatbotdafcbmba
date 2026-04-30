import { createFileRoute, Link } from "@tanstack/react-router";
import brasao from "@/assets/cbmba-brasao.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda DAF — 3º BBM | CBMBA" },
      {
        name: "description",
        content:
          "Central de Ajuda do Departamento de Auditoria e Finanças do 3º Batalhão de Bombeiros Militar da Bahia. Tire dúvidas sobre Verba de Adiantamento.",
      },
    ],
  }),
  component: Capa,
});

function Capa() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-secondary text-secondary-foreground">
      {/* Fundo dramático */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.62_0.24_32_/_0.25),_transparent_60%)]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={brasao}
              alt="Brasão CBMBA"
              className="h-10 w-10 object-contain drop-shadow-lg"
            />
            <div className="text-xs uppercase tracking-widest text-accent">
              CBMBA · 3º BBM
            </div>
          </div>
          <div className="text-xs uppercase tracking-widest text-white/60">
            Departamento de Auditoria e Finanças
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-16 text-center md:pt-24">
        <div className="relative mb-10">
          <div
            className="absolute inset-0 -z-10 blur-3xl"
            style={{ background: "var(--gradient-primary)", opacity: 0.5 }}
          />
          <img
            src={brasao}
            alt="Brasão do Corpo de Bombeiros Militar da Bahia"
            className="h-44 w-44 object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:h-56 md:w-56"
          />
        </div>

        <span className="mb-4 inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Central de Ajuda
        </span>

        <h1 className="max-w-3xl text-balance text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
          Departamento de{" "}
          <span className="bg-gradient-to-r from-accent via-amber-300 to-accent bg-clip-text text-transparent">
            Auditoria e Finanças
          </span>
        </h1>

        <p className="mt-4 text-lg font-semibold uppercase tracking-widest text-white/80">
          3º Batalhão de Bombeiros Militar
        </p>

        <p className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-white/70 md:text-lg">
          Tire suas dúvidas sobre <strong className="text-white">Verba de
          Adiantamento</strong>, prestação de contas, retenção de tributos e a
          Instrução Normativa SAF nº 21/2017 com nosso assistente virtual.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/adiantamento"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="relative z-10">Iniciar atendimento</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <a
            href="tel:+5571999486873"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white/90 backdrop-blur transition-colors hover:bg-white/10"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            (71) 99948-6873
          </a>
        </div>

        {/* Cards de tópicos */}
        <div className="mt-20 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Concessão & Prestação",
              desc: "Composição do processo SEI, documentos exigidos e fluxo completo.",
            },
            {
              title: "Limites & Valores",
              desc: "Anexo VII atualizado: limites de concessão e aplicação para 2026.",
            },
            {
              title: "INSS & ISS",
              desc: "Recolhimentos, retenções e regras para optantes do Simples Nacional.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-white/10"
            >
              <div className="mb-2 h-1 w-10 rounded-full bg-accent" />
              <h3 className="text-base font-bold uppercase tracking-wide text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs uppercase tracking-widest text-white/40">
        Corpo de Bombeiros Militar da Bahia · DAF / 3º BBM
      </footer>
    </main>
  );
}
