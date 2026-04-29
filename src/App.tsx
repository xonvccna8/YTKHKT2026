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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Lightbulb className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">KHKT Idea Champion</span>
              </Link>
            </div>
            <nav className="flex items-center gap-1 sm:gap-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Lightbulb className="w-4 h-4" /> <span className="hidden sm:inline">Tạo Ý Tưởng</span>
              </Link>
              <Link to="/history" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${location.pathname === '/history' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <History className="w-4 h-4" /> <span className="hidden sm:inline">Lịch Sử</span>
              </Link>
              <Link to="/favorites" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${location.pathname === '/favorites' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Heart className="w-4 h-4" /> <span className="hidden sm:inline">Yêu Thích</span>
              </Link>
              <button onClick={handleLogout} className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
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
