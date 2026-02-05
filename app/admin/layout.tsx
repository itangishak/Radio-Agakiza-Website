"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; photo_url?: string; role: 'admin'|'manager'|'journalist' } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith("/admin/login");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    
    // If no token and not on login page, redirect to login
    if (!token && !isLoginPage) {
      router.replace("/admin/login");
      setLoading(false);
      return;
    }
    
    // If on login page, don't verify token
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    
    // If we have a token, verify it
    if (token) {
      fetch("/api/v1/admin/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Invalid token');
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        if (!isLoginPage) router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [pathname, router, isLoginPage]);

  useEffect(() => {
    if (!user || isLoginPage) return;
    const role = user.role;
    if (role === 'admin') return;
    const defaultByRole = role === 'manager' ? '/admin/programs' : '/admin/news';
    const allowedPrefixes = role === 'manager'
      ? ['/admin', '/admin/programs', '/admin/testimonials', '/admin/profile']
      : ['/admin', '/admin/news', '/admin/podcasts', '/admin/profile'];
    const isAllowed = allowedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
    if (!isAllowed) {
      router.replace(defaultByRole);
    }
  }, [user, pathname, router, isLoginPage]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
  if (isLoginPage) return children;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">RA</span>
          </div>
          <span className="font-bold text-lg text-gray-800">Radio Agakiza Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user.photo_url ? (
                <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-700 font-medium">{user.email}</span>
          </div>
          <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen p-6">
          <ul className="space-y-1">
            <li><a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
              <span>📊</span> Dashboard
            </a></li>
            {user.role === 'admin' && (
              <li><a href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>👥</span> Users
              </a></li>
            )}
            {(user.role === 'admin' || user.role === 'manager') && (
              <li><a href="/admin/programs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>📻</span> Programs
              </a></li>
            )}
            {(user.role === 'admin' || user.role === 'journalist') && (
              <li><a href="/admin/news" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>📰</span> News
              </a></li>
            )}
            {(user.role === 'admin' || user.role === 'journalist') && (
              <li><a href="/admin/podcasts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>🎧</span> Podcasts
              </a></li>
            )}
            {(user.role === 'admin' || user.role === 'manager') && (
              <li><a href="/admin/testimonials" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>💬</span> Testimonials
              </a></li>
            )}
            {user.role === 'admin' && (
              <li><a href="/admin/streaming" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span>🔴</span> Streaming
              </a></li>
            )}
            <li className="pt-4 border-t mt-4">
              <a href="/admin/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors">
                <span>👤</span> Profile
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
