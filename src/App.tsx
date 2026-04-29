import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Lightbulb, History, Heart, LogOut } from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/storage';

import LoginPage from '@/pages/LoginPage';
import IdeaFormPage from '@/pages/IdeaFormPage';
import ResultPage from '@/pages/ResultPage';
import HistoryPage from '@/pages/HistoryPage';
import FavoritesPage from '@/pages/FavoritesPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans flex flex-col relative">
      <header className="glass-panel sticky top-0 z-50 border-b border-teal-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-400 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <Lightbulb className="h-8 w-8 text-teal-300 relative z-10" />
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent hidden sm:block">
                  KHKT Idea Champion
                </span>
              </Link>
            </div>
            <nav className="flex items-center gap-1 sm:gap-4">
              <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${location.pathname === '/' ? 'bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'text-slate-400 hover:text-teal-200 hover:bg-slate-800/50'}`}>
                <Lightbulb className="w-4 h-4" /> <span className="hidden sm:inline">Tạo Ý Tưởng</span>
              </Link>
              <Link to="/history" className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${location.pathname === '/history' ? 'bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'text-slate-400 hover:text-teal-200 hover:bg-slate-800/50'}`}>
                <History className="w-4 h-4" /> <span className="hidden sm:inline">Lịch Sử</span>
              </Link>
              <Link to="/favorites" className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${location.pathname === '/favorites' ? 'bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'text-slate-400 hover:text-teal-200 hover:bg-slate-800/50'}`}>
                <Heart className="w-4 h-4" /> <span className="hidden sm:inline">Yêu Thích</span>
              </Link>
              <button onClick={handleLogout} className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-all">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      <footer className="glass-panel border-t border-teal-500/20 py-6 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© 2026 KHKT Idea Champion - Hỗ trợ học sinh nghiên cứu khoa học kỹ thuật</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><Layout><IdeaFormPage /></Layout></RequireAuth>} />
        <Route path="/result" element={<RequireAuth><Layout><ResultPage /></Layout></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><Layout><HistoryPage /></Layout></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><Layout><FavoritesPage /></Layout></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
