import { Link, Outlet } from 'react-router-dom';
import { Home, CheckSquare, Calendar, LayoutDashboard, Settings, User } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            UniWorkPlanner
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium">
            <Home size={20} />
            <span>Inicio</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CheckSquare size={20} />
            <span>Mis Tareas</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LayoutDashboard size={20} />
            <span>Tablero Kanban</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Calendar size={20} />
            <span>Calendario</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings size={20} />
            <span>Configuración</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="text-slate-500 md:hidden">
            <Home size={24} />
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 font-medium mr-2">Santiago Pineda</div>
            <div className="h-10 w-10 bg-primary-100 text-primary-700 flex items-center justify-center rounded-full font-bold shadow-sm border border-primary-200">
              SP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
