import { apiGet } from "../../lib/api";
import { formatRangeWithTz, toLocalTimeLabel } from "../../lib/time";

type Host = { id: number; full_name: string };

type ProgramDetail = {
  id: number;
  name: string;
  slug: string;
  hosts: Host[];
  schedule: { id: number; day_of_week: number; start_time: string; end_time: string; timezone: string }[];
};

type Program = { id: number; name: string; slug: string };

type ScheduleEntry = {
  dow: number;
  start: string;
  end: string;
  tz: string;
  program: string;
  hosts: string;
};

export const metadata = {
  title: "Programs — Radio Agakiza",
};

function dayLabel(dow0to6: number) {
  const labels = ["Ku w'Imana", "Ku wa mbere", "Ku wa kabiri", "Ku wa gatatu", "Ku wa kane", "Ku wa gatanu", "Ku wa gatandatu"];
  return labels[dow0to6] ?? "";
}

function sanitizeDay(day: string | undefined) {
  const n = Number(day);
  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : new Date().getDay();
}

function normalizeClock(time: string) {
  const [hour = "00", minute = "00"] = time.split(":");
  return { hour: Number(hour), minute: Number(minute) };
}

function toGoogleCalendarDate(dow: number, time: string) {
  const now = new Date();
  const date = new Date(now);
  const distance = (dow - now.getDay() + 7) % 7;
  date.setDate(now.getDate() + distance);

  const { hour, minute } = normalizeClock(time);
  date.setHours(hour, minute, 0, 0);

  if (distance === 0 && date <= now) {
    date.setDate(date.getDate() + 7);
  }

  const iso = date.toISOString().replace(/[-:]/g, "").split(".")[0];
  return `${iso}Z`;
}

function reminderLink(entry: ScheduleEntry) {
  const title = encodeURIComponent(`${entry.program} - Radio Agakiza`);
  const details = encodeURIComponent(
    `${entry.program} hamwe na ${entry.hosts || "abakozi ba Radio Agakiza"}. Bikurikire ${dayLabel(entry.dow)} kuva ${formatRangeWithTz(entry.start, entry.end, entry.tz)} (isaha y'i Bujumbura).`,
  );
  const dates = `${toGoogleCalendarDate(entry.dow, entry.start)}/${toGoogleCalendarDate(entry.dow, entry.end)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
}

function shareLink(entry: ScheduleEntry) {
  const message = encodeURIComponent(
    `Ndagutumiye gukurikira ${entry.program} kuri Radio Agakiza, ${dayLabel(entry.dow)} ${formatRangeWithTz(entry.start, entry.end, entry.tz)} (isaha y'i Bujumbura).`,
  );
  return `https://wa.me/?text=${message}`;
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams?: Promise<{ day?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const selectedDay = sanitizeDay(params?.day);
  const programs = (await apiGet<Program[]>("/programs")) ?? [];
  const details = (await Promise.all(programs.map(p => apiGet<ProgramDetail>(`/programs/${p.id}`)))).filter(Boolean) as ProgramDetail[];

  const entries: ScheduleEntry[] = [];
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
  entries.sort((a, b) => a.dow - b.dow || a.start.localeCompare(b.start));

  const grouped: Record<number, typeof entries> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  for (const e of entries) grouped[e.dow].push(e);
  const selectedEntries = grouped[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,182,64,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,182,64,0.15),transparent_50%)]" />

        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-accent-500/20 blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 h-16 w-16 rounded-full bg-accent-400/30 blur-lg animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">Ibiganiro</span>
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">Vyacu</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90">
            Raba ibiganiro vyo kuri uno musi, hanyuma ushobora no kuraba ivyo indwi yose hepfo.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-brand-100">
          {Array.from({ length: 7 }, (_, d) => (
            <a
              key={d}
              href={`/programs?day=${d}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedDay === d ? "bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {dayLabel(d)}
            </a>
          ))}
        </div>

        <section className="group relative overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-100 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5" />
          <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Ikiganiro c'uno musi</p>
              <h2 className="bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-3xl font-bold text-transparent">{dayLabel(selectedDay)}</h2>
            </div>
            <div className="rounded-full bg-accent-100 px-4 py-2 text-sm font-semibold text-accent-700">{selectedEntries.length} ibiganiro</div>
          </div>

          <div className="relative space-y-4">
            {selectedEntries.length === 0 ? (
              <div className="py-8 text-center text-brand-500">
                <span className="mb-2 block text-3xl">📻</span>
                Nta kiganiro gitegekanijwe kuri uno musi.
              </div>
            ) : (
              selectedEntries.map((e, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-50 to-accent-50/50 p-5 ring-1 ring-brand-200/50 transition-all hover:shadow-lg hover:ring-brand-300"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-brand-900">{e.program}</h3>
                      {e.hosts && <p className="text-sm text-brand-600">🎙️ {e.hosts}</p>}
                    </div>
                    <div className="rounded-lg bg-white/90 px-3 py-2 text-right shadow-sm">
                      <p className="text-sm font-semibold text-brand-700">{formatRangeWithTz(e.start, e.end, e.tz)}</p>
                      <p className="text-xs text-brand-500">I Bujumbura: {toLocalTimeLabel(e.start, e.tz)}–{toLocalTimeLabel(e.end, e.tz)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={reminderLink(e)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      ⏰ Nyibutse
                    </a>
                    <a
                      href={shareLink(e)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
                    >
                      🔗 Sangiza
                    </a>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-200">✨ Bika iki kiganiro, uheze ugisangize n'abandi</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="weekly-schedule" className="mt-10 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-brand-100">
          <details>
            <summary className="list-none cursor-pointer text-lg font-bold text-brand-700">🗓️ Raba ibiganiro vy'indwi yose</summary>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {Object.entries(grouped).map(([kd, list]) => (
                <div key={kd} className="rounded-2xl bg-brand-50/60 p-4 ring-1 ring-brand-100">
                  <h3 className="mb-2 font-semibold text-brand-700">{dayLabel(Number(kd))}</h3>
                  {list.length === 0 ? (
                    <p className="text-sm text-brand-500">Nta kiganiro.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-brand-600">
                      {list.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{item.program}</span> · {formatRangeWithTz(item.start, item.end, item.tz)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </details>
        </section>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-500/10 to-brand-500/10 px-6 py-3 ring-1 ring-accent-200">
            <span className="text-2xl">📻</span>
            <span className="font-medium text-brand-700">Tegera Radio Agakiza, kandi urungikire n'abagenzi bawe.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
