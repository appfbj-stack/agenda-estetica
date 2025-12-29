
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { getAppointmentsByDate, saveAppointment, deleteAppointment, getClients } from '../services/storageService';
import { Appointment, Client, PaymentStatus } from '../types';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '../components/Button';
import { AppointmentModal } from '../components/AppointmentModal';

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  const loadData = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    setAppointments(getAppointmentsByDate(dateStr));
    setClients(getClients());
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  
  const getClient = (id: string) => clients.find(c => c.id === id);
  const getClientName = (id: string) => getClient(id)?.name || 'Cliente Desconhecido';

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteAppointment(id);
      loadData();
    }
  };

  const handleWhatsApp = (apt: Appointment) => {
    const client = getClient(apt.clientId);
    if (!client) return;

    const phone = client.phone.replace(/\D/g, ''); 
    if (!phone) {
        alert("Este cliente não possui um telefone válido cadastrado.");
        return;
    }

    const dateObj = parseISO(apt.date);
    const dateFormatted = format(dateObj, "dd/MM (EEEE)", { locale: ptBR });
    
    const message = `Olá *${client.name.split(' ')[0]}*! ✨\n\nConfirmando seu agendamento:\n\n📅 *Data:* ${dateFormatted}\n⏰ *Horário:* ${apt.time}\n💆‍♀️ *Procedimento:* ${apt.service}\n\nLocal: EstéticaAgenda Pro\n_Aguardamos você!_`;
    
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: PaymentStatus) => {
      if (status === PaymentStatus.PAID) return 'border-green-300 bg-green-50/30';
      if (status === PaymentStatus.PARTIAL) return 'border-yellow-300 bg-yellow-50/30';
      return 'border-gray-200 dark:border-zinc-600';
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
        <div className="flex items-center justify-between w-full md:w-auto bg-gray-50 dark:bg-zinc-900 rounded-xl p-1">
          <button onClick={handlePrevDay} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 shadow-sm transition-all">
            <ICONS.Prev size={20} />
          </button>
          <div className="text-center px-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize leading-tight">
              {format(currentDate, "EEEE", { locale: ptBR })}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <button onClick={handleNextDay} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 shadow-sm transition-all">
            <ICONS.Next size={20} />
          </button>
        </div>
        
        <Button onClick={() => { setEditingApt(null); setIsModalOpen(true); }} icon={ICONS.Plus} className="w-full md:w-auto">
          Novo Agendamento
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600 p-10 h-64 bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-full mb-4">
                 <ICONS.Calendar size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-300">Agenda Livre</p>
            <p className="text-sm">Nenhum agendamento para este dia.</p>
            <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4"
                onClick={() => { setEditingApt(null); setIsModalOpen(true); }}
            >
                Adicionar agora
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div 
                key={apt.id} 
                className={`group bg-white dark:bg-zinc-800 rounded-xl p-4 border shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center cursor-pointer border-l-4 ${getStatusColor(apt.status)} dark:border-t-zinc-700 dark:border-r-zinc-700 dark:border-b-zinc-700`}
                onClick={() => { setEditingApt(apt); setIsModalOpen(true); }}
              >
                 <div className="flex md:flex-col items-center md:items-start gap-3 md:w-24 md:border-r border-gray-100 dark:border-zinc-700 md:pr-4">
                    <div className="flex flex-col items-center md:items-start w-full">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1 tracking-wider">
                            {format(parseISO(apt.date), 'dd/MM')} <span className="text-brand-300">•</span> {format(parseISO(apt.date), 'EEE', { locale: ptBR })}
                        </span>
                        <div className="bg-brand-50 dark:bg-zinc-700 text-brand-600 dark:text-brand-300 px-3 py-1.5 rounded-lg text-lg font-bold font-mono tracking-tight w-full text-center md:text-left">
                            {apt.time}
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 dark:text-zinc-500">
                        <ICONS.Clock size={12} className="mr-1" />
                        {apt.duration} min
                    </div>
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{getClientName(apt.clientId)}</h3>
                        {apt.aiSummary && (
                            <span title="Resumo IA disponível">
                                <ICONS.AI size={14} className="text-purple-400 animate-pulse" />
                            </span>
                        )}
                    </div>
                    <p className="text-brand-500 dark:text-brand-400 font-medium text-sm">{apt.service}</p>
                    {apt.procedureNotes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1 italic pl-2 border-l-2 border-gray-200 dark:border-zinc-600">
                        "{apt.procedureNotes}"
                      </p>
                    )}
                 </div>

                 <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-zinc-700">
                    <div className="text-right">
                       <div className="text-lg font-bold text-gray-900 dark:text-white">R$ {apt.price.toFixed(2)}</div>
                       <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                         apt.status === 'Pago' 
                            ? 'bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-400' 
                            : apt.status === 'Parcial' 
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400' 
                                : 'bg-gray-50 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                       }`}>
                           {apt.status}
                       </span>
                    </div>
                    
                    <div className="flex items-center gap-1 pl-4 md:border-l border-gray-100 dark:border-zinc-700">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleWhatsApp(apt); }}
                        className="p-2.5 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-100 dark:border-green-900/50"
                        title="Compartilhar no WhatsApp"
                       >
                         <ICONS.Whatsapp size={20} />
                       </button>

                       <button 
                        onClick={(e) => { e.stopPropagation(); setEditingApt(apt); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 dark:text-zinc-500 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg transition-colors"
                       >
                         <ICONS.Edit size={18} />
                       </button>
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(apt.id); }}
                        className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                       >
                         <ICONS.Trash size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(apt) => {
          saveAppointment(apt);
          loadData();
        }}
        initialData={editingApt}
        selectedDate={format(currentDate, 'yyyy-MM-dd')}
      />
    </div>
  );
};

export default Agenda;
