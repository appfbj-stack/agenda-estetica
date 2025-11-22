import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { getClients, saveClient, deleteClient, getClientHistory } from '../services/storageService';
import { Client, Appointment } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ClientModal } from '../components/ClientModal';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // History View State
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<Client | null>(null);
  const [history, setHistory] = useState<Appointment[]>([]);

  const loadClients = () => {
    setClients(getClients().sort((a, b) => a.name.localeCompare(b.name)));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza? Isso não apaga o histórico de agendamentos.')) {
      deleteClient(id);
      loadClients();
    }
  };

  const handleViewHistory = (client: Client) => {
      setSelectedClientForHistory(client);
      setHistory(getClientHistory(client.id));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm transition-colors">
        <div className="relative w-full md:w-96">
          <ICONS.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditingClient(null); setIsModalOpen(true); }} icon={ICONS.Plus} className="w-full md:w-auto">
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
        {/* Client List - Converted to Cards Grid inside Scroll Area */}
        <div className={`rounded-2xl overflow-hidden flex flex-col transition-colors ${selectedClientForHistory ? 'hidden lg:flex col-span-1 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800' : 'flex col-span-3'}`}>
           {!selectedClientForHistory && filteredClients.length > 0 && (
              <h3 className="mb-4 ml-1 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                {filteredClients.length} Clientes Cadastrados
              </h3>
           )}
           
           <div className={`${selectedClientForHistory ? 'divide-y divide-gray-100 dark:divide-zinc-700 overflow-y-auto' : 'overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20'}`}>
             {filteredClients.map(client => (
               <div 
                 key={client.id} 
                 onClick={() => handleViewHistory(client)}
                 className={`
                    cursor-pointer transition-all group
                    ${selectedClientForHistory 
                        ? `p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 ${selectedClientForHistory.id === client.id ? 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500' : ''}` 
                        : 'bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 flex flex-col justify-between h-32'
                    }
                 `}
               >
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedClientForHistory?.id === client.id ? 'bg-brand-200 text-brand-800' : 'bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-gray-300'}`}>
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className={`font-bold ${selectedClientForHistory?.id === client.id ? 'text-brand-900 dark:text-brand-100' : 'text-gray-900 dark:text-white'}`}>{client.name}</p>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <ICONS.Phone size={10} className="mr-1" />
                                {client.phone}
                            </div>
                        </div>
                    </div>
                    {/* Actions only visible on hover or always visible on mobile */}
                    <div className={`flex items-center gap-1 ${selectedClientForHistory ? '' : 'opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                        <button 
                        onClick={(e) => { e.stopPropagation(); setEditingClient(client); setIsModalOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-md"
                        >
                        <ICONS.Edit size={16} />
                        </button>
                        <button 
                        onClick={(e) => handleDelete(client.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"
                        >
                        <ICONS.Trash size={16} />
                        </button>
                    </div>
                 </div>
                 
                 {!selectedClientForHistory && (
                     <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50 dark:border-zinc-700/50">
                        <span className="text-xs text-gray-400 dark:text-zinc-500 truncate max-w-[150px]">
                            {client.email || 'Sem e-mail'}
                        </span>
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400 flex items-center">
                            Ver histórico <ICONS.Next size={12} className="ml-1" />
                        </span>
                     </div>
                 )}
               </div>
             ))}
             
             {filteredClients.length === 0 && (
                <div className="col-span-3 p-10 text-center text-gray-400 dark:text-zinc-600 bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
                   <ICONS.Users size={48} className="mx-auto mb-3 opacity-20" />
                   <p>Nenhum cliente encontrado.</p>
                   <p className="text-xs mt-1">Cadastre seu primeiro cliente acima!</p>
                </div>
             )}
           </div>
        </div>

        {/* History View (Side panel) */}
        {selectedClientForHistory && (
           <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 flex flex-col h-full animate-in slide-in-from-right duration-300 fixed inset-0 z-30 lg:static lg:z-0 transition-colors">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50 rounded-t-2xl">
                 <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedClientForHistory(null)} className="lg:hidden p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-zinc-700 rounded-full">
                       <ICONS.Prev />
                    </button>
                    <div>
                       <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           {selectedClientForHistory.name}
                           <span className="text-xs font-normal px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">Cliente</span>
                       </h2>
                       <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center"><ICONS.Phone size={12} className="mr-1"/> {selectedClientForHistory.phone}</span>
                            {selectedClientForHistory.email && <span className="hidden sm:flex items-center"><ICONS.Cloud size={12} className="mr-1"/> {selectedClientForHistory.email}</span>}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedClientForHistory(null)} className="lg:hidden p-2 bg-gray-200 dark:bg-zinc-700 rounded-full text-gray-600">
                   <ICONS.Close size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-zinc-900/30">
                {/* Notes Section */}
                {(selectedClientForHistory.notes) && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
                        <h4 className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2 flex items-center">
                            <ICONS.Edit size={12} className="mr-2" /> Observações Importantes
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{selectedClientForHistory.notes}"</p>
                    </div>
                )}

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center">
                            <ICONS.Clock size={14} className="mr-2" /> Linha do Tempo
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-zinc-500">{history.length} atendimentos</span>
                   </div>
                   
                   {history.length === 0 ? (
                      <div className="text-center text-gray-400 dark:text-zinc-600 py-12 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                          <p>Nenhum atendimento registrado para este cliente.</p>
                      </div>
                   ) : (
                      <div className="relative border-l-2 border-gray-200 dark:border-zinc-700 ml-3 space-y-6">
                        {history.map(apt => (
                            <div key={apt.id} className="relative pl-8">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-zinc-800 border-4 border-brand-300 dark:border-brand-700 rounded-full"></div>
                                
                                <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h5 className="font-bold text-lg text-gray-900 dark:text-white">{apt.service}</h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                {new Date(apt.date + 'T' + apt.time).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-bold text-gray-900 dark:text-white">R$ {apt.price.toFixed(2)}</span>
                                            <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase">{apt.status}</span>
                                        </div>
                                    </div>
                                    
                                    {apt.procedureNotes && (
                                        <div className="bg-gray-50 dark:bg-zinc-700/30 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-3 border border-gray-100 dark:border-zinc-700/50">
                                        <span className="font-bold text-xs uppercase text-gray-400 dark:text-zinc-500 block mb-1">Notas da Profissional:</span>
                                        {apt.procedureNotes}
                                        </div>
                                    )}

                                    {apt.aiSummary && (
                                        <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-800 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                            <div className="flex items-center mb-1.5">
                                                <ICONS.AI size={12} className="text-purple-600 dark:text-purple-400 mr-1.5" />
                                                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Resumo Inteligente</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{apt.aiSummary}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                      </div>
                   )}
                </div>
              </div>
           </div>
        )}
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(c) => {
          saveClient(c);
          loadClients();
        }}
        initialData={editingClient}
      />
    </div>
  );
};

export default Clients;