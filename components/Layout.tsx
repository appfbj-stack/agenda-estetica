import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, APP_NAME, ICONS, STORAGE_KEYS } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-300">
              <ICONS.Cloud size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Estética<span className="text-brand-600 dark:text-brand-400">Agenda</span></h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-zinc-700 space-y-4">
           <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
          >
            <span className="text-sm font-medium">Modo {isDarkMode ? 'Escuro' : 'Claro'}</span>
            {isDarkMode ? <ICONS.Moon size={16} /> : <ICONS.Sun size={16} />}
          </button>

          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4">
            <p className="text-xs font-medium text-brand-800 dark:text-brand-200 mb-1">Versão Pro</p>
            <p className="text-xs text-brand-600 dark:text-brand-400">Sua agenda está em dia!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-300">
                <ICONS.Cloud size={18} />
              </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Estética<span className="text-brand-600 dark:text-brand-400">Agenda</span></h1>
          </div>
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400">
             {isDarkMode ? <ICONS.Moon size={20} /> : <ICONS.Sun size={20} />}
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 z-20 flex justify-around items-center pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-4 w-full transition-colors ${
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-600'}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
};