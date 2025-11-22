import React, { useEffect, useState } from 'react';
import { ICONS } from '../constants';
import { getAppointments, getClients } from '../services/storageService';
import { Appointment, PaymentStatus, Client } from '../types';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  
  useEffect(() => {
    setAppointments(getAppointments());
    setClients(getClients());
  }, []);

  const todayAppointments = appointments
    .filter(a => isToday(new Date(a.date)))
    .sort((a, b) => a.time.localeCompare(b.time));

  const stats = {
    todayCount: todayAppointments.length,
    pendingValue: todayAppointments.reduce((acc, curr) => 
      curr.status !== PaymentStatus.PAID ? acc + (curr.price - curr.deposit) : acc, 0),
    monthCount: appointments.length // Simplified for MVP
  };

  const handleWhatsApp = (apt: Appointment) => {
      const client = clients.find(c => c.id === apt.clientId);
      if (!client) return;
  
      const phone = client.phone.replace(/\D/g, '');
      if (!phone) {
          alert("Telefone inválido.");
          return;
      }
  
      const message = `Olá ${client.name.split(' ')[0]}! ✨ Lembrando do seu horário hoje para *${apt.service}* às ${apt.time}. Até já!`;
      const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 capitalize">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, Esteticista! ✨</h2>
        </div>
        <Link to="/agenda">
          <button className="bg-brand-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-200 dark:shadow-brand-900/20 text-sm font-medium hover:bg-brand-600 transition-colors flex items-center">
             <ICONS.Plus className="w-4 h-4 mr-2" />
             Novo Agendamento
          </button>
        </Link>
      </div>

      {/* Quick Stats - Pastel Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card 1: Today - Soft Pastel Pink */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/40 dark:to-pink-900/10 p-4 rounded-2xl shadow-sm border border-pink-100 dark:border-pink-800 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 opacity-10 dark:opacity-5 text-pink-400 group-hover:scale-110 transition-transform duration-500">
             <ICONS.Calendar size={120} />
          </div>
          <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-white/60 dark:bg-pink-950/50 text-pink-400 dark:text-pink-300 rounded-lg backdrop-blur-sm shadow-sm">
              <ICONS.Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-pink-600 dark:text-pink-200 bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">Hoje</span>
          </div>
          <div className="z-10">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">{stats.todayCount}</span>
            <p className="text-xs text-pink-700 dark:text-pink-200 mt-1 font-medium">Atendimentos</p>
          </div>
        </div>

        {/* Card 2: Income - Soft Pastel Teal/Mint */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-900/10 p-4 rounded-2xl shadow-sm border border-teal-100 dark:border-teal-800 flex flex-col justify-between h-32 relative overflow-hidden group">
           <div className="absolute -right-6 -top-6 opacity-10 dark:opacity-5 text-teal-400 group-hover:scale-110 transition-transform duration-500">
             <ICONS.Money size={120} />
          </div>
           <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-white/60 dark:bg-teal-950/50 text-teal-400 dark:text-teal-300 rounded-lg backdrop-blur-sm shadow-sm">
              <ICONS.Money size={20} />
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-200 bg-white/50 dark:bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">A Receber</span>
          </div>
          <div className="z-10">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">R$ {stats.pendingValue.toFixed(2)}</span>
            <p className="text-xs text-teal-700 dark:text-teal-200 mt-1 font-medium">Previsão hoje</p>
          </div>
        </div>
        
        {/* Card 3: Total - Soft Brand Gradient */}
         <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-brand-300 to-brand-400 dark:from-brand-800 dark:to-brand-900 p-4 rounded-2xl shadow-sm text-white relative overflow-hidden group">
           <div className="absolute -right-6 -top-6 opacity-20 text-white group-hover:scale-110 transition-transform duration-500">
             <ICONS.Users size={120} />
          </div>
           <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10">
              <ICONS.Users size={20} />
            </div>
          </div>
          <div className="z-10">
            <span className="text-3xl font-bold text-white">{stats.monthCount}</span>
            <p className="text-xs text-white/90 mt-1 font-medium">Total Agendamentos</p>
          </div>
        </div>
      </div>

      {/* Today's Agenda Preview */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <ICONS.Clock className="w-5 h-5 mr-2 text-brand-400" />
            Agenda de Hoje
          </h3>
          <Link to="/agenda" className="text-sm text-brand-500 dark:text-brand-400 font-medium hover:underline">Ver completa</Link>
        </div>
        
        <div className="divide-y divide-gray-50 dark:divide-zinc-700">
          {todayAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <p>Nenhum atendimento hoje.</p>
              <p className="text-sm mt-1">Aproveite para organizar seus materiais! 💅</p>
            </div>
          ) : (
            todayAppointments.map(apt => (
              <div key={apt.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center gap-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="block text-[10px] text-gray-400 dark:text-zinc-500 font-bold mb-0.5">
                    {format(new Date(apt.date), 'dd/MM')}
                  </span>
                  <div className="bg-brand-50 dark:bg-zinc-700 rounded-lg p-2 border border-brand-100 dark:border-zinc-600">
                    <span className="block text-sm font-bold text-brand-600 dark:text-brand-300">{apt.time}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                     {clients.find(c => c.id === apt.clientId)?.name || `Cliente ID: ${apt.clientId.substring(0, 8)}...`}
                   </p>
                   <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{apt.service}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                   <button
                      onClick={() => handleWhatsApp(apt)}
                      className="text-green-500 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      title="Avisar no WhatsApp"
                   >
                      <ICONS.Whatsapp size={18} />
                   </button>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                     apt.status === PaymentStatus.PAID 
                      ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                      : 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                   }`}>
                     {apt.status === PaymentStatus.PAID ? 'Pago' : `R$ ${apt.price}`}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;