const skeletonCards = ["Pilotos", "Equipes", "Corridas", "Calendario"];

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#161616]">
      <section className="bg-[#151515] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded bg-[#e10600] font-black italic">
                F1
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
                Stats Center
              </span>
            </div>
            <div className="h-10 w-36 rounded border border-white/15 bg-white/10" />
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="h-4 w-44 rounded bg-[#ffcc00]/70" />
              <div className="mt-6 h-16 max-w-3xl rounded bg-white/12 sm:h-20" />
              <div className="mt-4 h-16 max-w-2xl rounded bg-white/8" />
            </div>

            <div className="rounded border border-white/12 bg-white/[0.06] p-5">
              <div className="h-4 w-28 rounded bg-white/15" />
              <div className="mt-4 h-12 rounded bg-white/12" />
              <div className="mt-4 h-10 w-32 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
        {skeletonCards.map((label) => (
          <div
            className="rounded border border-black/10 bg-white p-5"
            key={label}
          >
            <div className="h-4 w-24 rounded bg-black/10" />
            <div className="mt-4 h-10 rounded bg-black/10" />
            <div className="mt-3 h-4 w-32 rounded bg-black/10" />
          </div>
        ))}
      </section>
    </main>
  );
}
