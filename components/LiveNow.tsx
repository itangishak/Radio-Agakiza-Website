import { apiGet, type LiveNowNext } from "../lib/api";

export default async function LiveNow() {
  const live = await apiGet<LiveNowNext>("/programs/live");
  return (
    <section className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 blur-3xl" />
      <div className="relative rounded-3xl bg-white/80 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
            Ikibiriraho / Ibikurikira
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Program */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-6 ring-1 ring-brand-200">
            {live?.live ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-brand-600">Ubu:</div>
                <div className="text-xl font-bold text-brand-900">{live.live.name}</div>
                <div className="text-sm text-brand-700">
                  {live.live.start_time}–{live.live.end_time} ({live.live.timezone})
                </div>
              </div>
            ) : (
              <div className="text-center text-brand-600">
                Nta kiganiro kiri kuri mur'iki kanya.
              </div>
            )}
          </div>

          {/* Next Program */}
          <div className="rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-6 ring-1 ring-accent-200">
            {live?.next ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-accent-600">Ibikurikira:</div>
                <div className="text-xl font-bold text-accent-900">{live.next.name}</div>
                <div className="text-sm text-accent-700">
                  {live.next.start_time}–{live.next.end_time} ({live.next.timezone})
                </div>
              </div>
            ) : (
              <div className="text-center text-accent-600">
                Nta kiganiro gikurikira categekanijwe vuba.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
