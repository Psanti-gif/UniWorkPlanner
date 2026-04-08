import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Hola, Santiago 👋</h2>
        <p className="text-slate-500 mt-2">Aquí tienes un resumen de tus pendientes de hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
            <p className="text-slate-500 text-sm font-medium">Tareas Pendientes</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">5</h3>
            <p className="text-slate-500 text-sm font-medium">Completadas Hoy</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">3</h3>
            <p className="text-slate-500 text-sm font-medium">Vencen Pronto</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center mt-12">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Listo para arrancar</h3>
        <p className="text-slate-500 mb-6 max-w-lg mx-auto">
          El cascarón del frontend está configurado. Cuando entreguen las historias de usuario y definan bien el CRUD, empezaremos a crear las vistas reales.
        </p>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm shadow-primary-600/20 transition-all active:scale-95">
          Crear Nueva Tarea
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
