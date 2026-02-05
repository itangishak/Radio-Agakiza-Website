import { apiGet } from "../../lib/api";
import { dowLabel, formatRangeWithTz, toLocalTimeLabel } from "../../lib/time";

type Host = { id: number; full_name: string };

type ProgramDetail = {
  id: number;
  name: string;
  slug: string;
  hosts: Host[];
  schedule: { id: number; day_of_week: number; start_time: string; end_time: string; timezone: string }[];
};

type Program = { id: number; name: string; slug: string };

export const metadata = {
  title: "Programs — Radio Agakiza",
};

export default async function ProgramsPage() {
  const programs = (await apiGet<Program[]>("/programs")) ?? [];
  const details = (await Promise.all(programs.map(p => apiGet<ProgramDetail>(`/programs/${p.id}`))))
    .filter(Boolean) as ProgramDetail[];

  // Build weekly schedule entries
  const entries: { dow: number; start: string; end: string; tz: string; program: string; hosts: string }[] = [];
  for (const d of details) {
    const hostNames = d.hosts?.map(h => h.full_name).join(", ") || "";
    for (const s of d.schedule ?? []) {
      entries.push({
        dow: s.day_of_week,
        start: s.start_time,
        end: s.end_time,
        tz: s.timezone,
        program: d.name,
        hosts: hostNames,
      });
    }
  }
  entries.sort((a,b) => (a.dow - b.dow) || a.start.localeCompare(b.start));

  const grouped: Record<number, typeof entries> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
  for (const e of entries) grouped[e.dow].push(e);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.15),transparent_50%)]" />
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-accent-400/30 blur-lg animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Ibiganiro
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Byacu
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            Gahunda zacu z'ibiganiro zitandukanye zikugezaho ubutumwa bwiza buri munsi
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Info Card */}
        <div className="mb-12 rounded-2xl bg-white/80 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⏰</span>
            <h2 className="text-lg font-semibold text-brand-700">Amakuru y'ibihe</h2>
          </div>
          <p className="text-brand-600">
            Ibihe byose bigaragara harimo igihe cy'ikiganiro n'igihe cyawe cyo mu karere.
          </p>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {Object.entries(grouped).map(([kd, list], dayIndex) => (
            <section 
              key={kd} 
              className="group relative overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
              style={{animationDelay: `${dayIndex * 100}ms`}}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Day header */}
              <div className="relative mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold">
                  {dowLabel(Number(kd)).charAt(0)}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">
                  {dowLabel(Number(kd))}
                </h2>
              </div>

              {/* Programs list */}
              <div className="relative space-y-4">
                {list.length === 0 ? (
                  <div className="text-center py-8 text-brand-500">
                    <span className="text-3xl mb-2 block">📻</span>
                    Nta biganiro byateganyijwe.
                  </div>
                ) : (
                  list.map((e, idx) => (
                    <div 
                      key={idx} 
                      className="group/item relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-50 to-accent-50/50 p-4 ring-1 ring-brand-200/50 transition-all hover:shadow-lg hover:ring-brand-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-brand-500/5 opacity-0 transition-opacity group-hover/item:opacity-100" />
                      
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-brand-900 mb-1 group-hover/item:text-brand-700 transition-colors">
                            {e.program}
                          </h3>
                          {e.hosts && (
                            <div className="flex items-center gap-2 text-sm text-brand-600">
                              <span className="text-accent-500">👤</span>
                              {e.hosts}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="rounded-lg bg-white/80 px-3 py-2 shadow-sm">
                            <div className="text-sm font-semibold text-brand-700">
                              {formatRangeWithTz(e.start, e.end, e.tz)}
                            </div>
                            <div className="text-xs text-brand-500">
                              Mu karere: {toLocalTimeLabel(e.start, e.tz)}–{toLocalTimeLabel(e.end, e.tz)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-brand-500/10 px-6 py-3 ring-1 ring-accent-200">
            <span className="text-2xl">📻</span>
            <span className="text-brand-700 font-medium">
              Tegura amatwi kandi utumenyeshe ibiganiro byacu!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
