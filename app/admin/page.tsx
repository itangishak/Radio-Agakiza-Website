"use client";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "../../components/Skeleton";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin"|"manager"|"journalist"|null>(null);
  const [counts, setCounts] = useState({ programs: 0, news: 0, podcasts: 0, testimonials: 0 });
  const [recent, setRecent] = useState<Array<{ type: string; title: string; status?: string; timestamp: number; href: string; icon: string; color: string }>>([]);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) { setLoading(false); return; }
      try {
        const verifyRes = await fetch("/api/v1/admin/verify", { headers: { Authorization: `Bearer ${token}` } });
        if (!verifyRes.ok) throw new Error("verify failed");
        const { user } = await verifyRes.json();
        setRole(user.role);
        const headers = { Authorization: `Bearer ${token}` } as Record<string,string>;
        const fetchJson = async (url: string) => {
          const r = await fetch(url, { headers });
          if (!r.ok) return [] as any[];
          return r.json();
        };
        let programs = 0, news = 0, podcasts = 0, testimonials = 0;
        let recentItems: Array<{ type: string; title: string; status?: string; timestamp: number; href: string; icon: string; color: string }> = [];
        if (user.role === 'admin') {
          const [p, n, pe, t] = await Promise.all([
            fetchJson("/api/v1/admin/programs"),
            fetchJson("/api/v1/admin/news"),
            fetchJson("/api/v1/admin/podcasts"),
            fetchJson("/api/v1/admin/testimonials"),
          ]);
          programs = Array.isArray(p) ? p.length : (p?.length ?? 0);
          news = Array.isArray(n) ? n.length : (n?.length ?? 0);
          podcasts = Array.isArray(pe) ? pe.length : (pe?.length ?? 0);
          testimonials = Array.isArray(t) ? t.length : (t?.length ?? 0);

          const mapPrograms = (p as any[]).map(it => ({
            type: 'program',
            title: it.name ?? 'Program',
            status: it.is_active ? 'active' : 'inactive',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : (it.updated_at ? new Date(it.updated_at).getTime() : 0),
            href: '/admin/programs',
            icon: '📻',
            color: 'blue'
          }));
          const mapNews = (n as any[]).map(it => ({
            type: 'news',
            title: it.title ?? 'Article',
            status: it.status,
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/news',
            icon: '📰',
            color: 'green'
          }));
          const mapPods = (pe as any[]).map(it => ({
            type: 'podcast',
            title: it.title ?? 'Episode',
            status: it.status ?? 'published',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/podcasts',
            icon: '🎧',
            color: 'purple'
          }));
          const mapTests = (t as any[]).map(it => ({
            type: 'testimonial',
            title: it.author_name ?? 'Testimonial',
            status: it.is_published ? 'published' : 'draft',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/testimonials',
            icon: '💬',
            color: 'orange'
          }));
          recentItems = [...mapNews, ...mapPods, ...mapPrograms, ...mapTests];
        } else if (user.role === 'manager') {
          const [p, t] = await Promise.all([
            fetchJson("/api/v1/admin/programs"),
            fetchJson("/api/v1/admin/testimonials"),
          ]);
          programs = Array.isArray(p) ? p.length : (p?.length ?? 0);
          testimonials = Array.isArray(t) ? t.length : (t?.length ?? 0);

          const mapPrograms = (p as any[]).map(it => ({
            type: 'program',
            title: it.name ?? 'Program',
            status: it.is_active ? 'active' : 'inactive',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : (it.updated_at ? new Date(it.updated_at).getTime() : 0),
            href: '/admin/programs',
            icon: '📻',
            color: 'blue'
          }));
          const mapTests = (t as any[]).map(it => ({
            type: 'testimonial',
            title: it.author_name ?? 'Testimonial',
            status: it.is_published ? 'published' : 'draft',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/testimonials',
            icon: '💬',
            color: 'orange'
          }));
          recentItems = [...mapPrograms, ...mapTests];
        } else if (user.role === 'journalist') {
          const [n, pe] = await Promise.all([
            fetchJson("/api/v1/admin/news"),
            fetchJson("/api/v1/admin/podcasts"),
          ]);
          news = Array.isArray(n) ? n.length : (n?.length ?? 0);
          podcasts = Array.isArray(pe) ? pe.length : (pe?.length ?? 0);

          const mapNews = (n as any[]).map(it => ({
            type: 'news',
            title: it.title ?? 'Article',
            status: it.status,
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/news',
            icon: '📰',
            color: 'green'
          }));
          const mapPods = (pe as any[]).map(it => ({
            type: 'podcast',
            title: it.title ?? 'Episode',
            status: it.status ?? 'published',
            timestamp: it.created_at ? new Date(it.created_at).getTime() : 0,
            href: '/admin/podcasts',
            icon: '🎧',
            color: 'purple'
          }));
          recentItems = [...mapNews, ...mapPods];
        }
        setCounts({ programs, news, podcasts, testimonials });
        recentItems.sort((a, b) => b.timestamp - a.timestamp);
        setRecent(recentItems.slice(0, 6));
      } catch {
        // ignore
      }
      setLoading(false);
    };
    run();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with Radio Agakiza.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(role === 'admin' || role === 'manager') && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Programs</h3>
                <p className="text-3xl font-bold">{counts.programs}</p>
                <p className="text-blue-100 text-sm">{counts.programs === 0 ? 'No programs yet' : `${counts.programs} total`}</p>
              </div>
              <div className="text-4xl opacity-80">📻</div>
            </div>
          </div>
        )}
        {(role === 'admin' || role === 'journalist') && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">News Articles</h3>
                <p className="text-3xl font-bold">{counts.news}</p>
                <p className="text-green-100 text-sm">{role === 'journalist' ? `${counts.news} of your articles` : `${counts.news} total articles`}</p>
              </div>
              <div className="text-4xl opacity-80">📰</div>
            </div>
          </div>
        )}
        {(role === 'admin' || role === 'journalist') && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Podcast Episodes</h3>
                <p className="text-3xl font-bold">{counts.podcasts}</p>
                <p className="text-purple-100 text-sm">{role === 'journalist' ? `${counts.podcasts} of your episodes` : `${counts.podcasts} total`}</p>
              </div>
              <div className="text-4xl opacity-80">🎧</div>
            </div>
          </div>
        )}
        {(role === 'admin' || role === 'manager') && (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Testimonials</h3>
                <p className="text-3xl font-bold">{counts.testimonials}</p>
                <p className="text-orange-100 text-sm">{counts.testimonials === 0 ? 'No testimonials yet' : `${counts.testimonials} total`}</p>
              </div>
              <div className="text-4xl opacity-80">💬</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {(role === 'admin' || role === 'manager') && (
              <a href="/admin/programs" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <span className="text-2xl">📻</span>
                <div>
                  <div className="font-medium text-blue-900 group-hover:text-blue-700">Manage Programs</div>
                  <div className="text-sm text-blue-600">{counts.programs === 0 ? 'Create your first program' : `${counts.programs} programs available`}</div>
                </div>
              </a>
            )}
            {(role === 'admin' || role === 'journalist') && (
              <a href="/admin/news" className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <span className="text-2xl">📰</span>
                <div>
                  <div className="font-medium text-green-900 group-hover:text-green-700">Add News</div>
                  <div className="text-sm text-green-600">{role === 'journalist' ? `${counts.news} existing articles` : `${counts.news} total articles`}</div>
                </div>
              </a>
            )}
            {(role === 'admin' || role === 'journalist') && (
              <a href="/admin/podcasts" className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                <span className="text-2xl">🎧</span>
                <div>
                  <div className="font-medium text-purple-900 group-hover:text-purple-700">Upload Podcast</div>
                  <div className="text-sm text-purple-600">{counts.podcasts === 0 ? 'No episodes yet' : `${counts.podcasts} episodes available`}</div>
                </div>
              </a>
            )}
            {role === 'admin' && (
              <a href="/admin/streaming" className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group">
                <span className="text-2xl">🔴</span>
                <div>
                  <div className="font-medium text-red-900 group-hover:text-red-700">Stream Settings</div>
                  <div className="text-sm text-red-600">Configure live stream</div>
                </div>
              </a>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>📈</span> Recent Activity
          </h2>
          <div className="space-y-3">
            {recent.length === 0 && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">No recent activity.</div>
            )}
            {recent.map((item, idx) => (
              <a key={idx} href={item.href} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-lg">{item.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {item.type === 'news' && 'Article'}
                    {item.type === 'program' && 'Program'}
                    {item.type === 'podcast' && 'Podcast'}
                    {item.type === 'testimonial' && 'Testimonial'}
                    {": "}{item.title}
                  </div>
                  <div className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}{item.status ? ` • ${item.status}` : ''}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(ts: number) {
  if (!ts || Number.isNaN(ts)) return '';
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.floor(mo / 12);
  return `${yr}y ago`;
}
