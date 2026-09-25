"use client";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f2ec] px-5 text-[#161616]">
      <section className="w-full max-w-2xl rounded border border-black/10 bg-white p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
          Erro
        </p>
        <h1 className="mt-3 text-4xl font-black">
          Nao deu para carregar esses dados.
        </h1>
        <p className="mt-4 text-sm font-bold leading-6 text-black/58">
          Pode ser uma falha temporaria na API externa ou na renderizacao dessa
          rota. Tente novamente para refazer a busca.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded bg-[#f5f2ec] px-3 py-2 text-xs font-bold text-black/45">
            Codigo: {error.digest}
          </p>
        ) : null}
        <button
          className="mt-6 rounded bg-[#151515] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#e10600]"
          onClick={() => retry()}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
