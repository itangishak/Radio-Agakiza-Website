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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Programs Schedule</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">All times shown include station timezone and your local time.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([kd, list]) => (
          <section key={kd} className="rounded border p-4">
            <h2 className="mb-3 text-lg font-medium">{dowLabel(Number(kd))}</h2>
            {list.length === 0 && (
              <div className="text-sm text-zinc-500">No scheduled programs.</div>
            )}
            <ul className="space-y-3">
              {list.map((e, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{e.program}</div>
                    {e.hosts && <div className="text-xs text-zinc-500">{e.hosts}</div>}
                  </div>
                  <div className="text-right text-sm">
                    <div>{formatRangeWithTz(e.start, e.end, e.tz)}</div>
                    <div className="text-xs text-zinc-500">Local: {toLocalTimeLabel(e.start, e.tz)}–{toLocalTimeLabel(e.end, e.tz)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
