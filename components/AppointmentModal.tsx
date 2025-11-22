import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Appointment, Client, PaymentStatus } from '../types';
import { Button } from './Button';
import { Input, Select, TextArea } from './Input';
import { generateProcedureNotes, suggestPostCare } from '../services/geminiService';
import { getClients, generateId, saveClient } from '../services/storageService';
import { ClientModal } from './ClientModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apt: Appointment) => void;
  initialData?: Appointment | null;
  selectedDate?: string;
}

export const AppointmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData, selectedDate }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  
  // Client Modal State (Quick Add)
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);

  // Form State
  const [clientId, setClientId] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState<string>('60');
  const [price, setPrice] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('0');
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [notes, setNotes] = useState('');
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClients(getClients());
      if (initialData) {
        setClientId(initialData.clientId);
        setService(initialData.service);
        setDate(initialData.date);
        setTime(initialData.time);
        setDuration(initialData.duration.toString());
        setPrice(initialData.price.toString());
        setDeposit(initialData.deposit.toString());
        setStatus(initialData.status);
        setNotes(initialData.procedureNotes || '');
        setAiResult(initialData.aiSummary || '');
      } else {
        // Reset
        setClientId('');
        setService('');
        setDate(selectedDate || new Date().toISOString().split('T')[0]);
        setTime('09:00');
        setDuration('60');
        setPrice('');
        setDeposit('0');
        setStatus(PaymentStatus.PENDING);
        setNotes('');
        setAiResult('');
      }
    }
  }, [isOpen, initialData, selectedDate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !service || !date || !time || !price) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const newApt: Appointment = {
      id: initialData?.id || generateId(),
      clientId,
      service,
      date,
      time,
      duration: parseInt(duration) || 60,
      price: parseFloat(price),
      deposit: parseFloat(deposit) || 0,
      status,
      procedureNotes: notes,
      aiSummary: aiResult,
    };

    onSave(newApt);
    onClose();
  };

  const handleAiEnhance = async () => {
    if (!service || !notes) return;
    setAiLoading(true);
    
    // Run both AI tasks
    const summary = await generateProcedureNotes(notes, service);
    const postCare = await suggestPostCare(service);
    
    setAiResult(`${summary}\n\n---\n\n💡 Dicas Pós-Procedimento:\n${postCare}`);
    setAiLoading(false);
  };

  const handleQuickClientSave = (newClient: Client) => {
    saveClient(newClient);
    setClients(getClients()); // Refresh list
    setClientId(newClient.id); // Auto-select new client
    setIsQuickClientOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200 dark:border-zinc-700">
          <div className="p-5 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? 'Editar Atendimento' : 'Novo Agendamento'}
            </h2>
            <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ICONS.Close size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                    <Select
                    label="Cliente"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    options={[
                        { value: '', label: 'Selecione um cliente...' },
                        ...clients.map(c => ({ value: c.id, label: c.name }))
                    ]}
                    required
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setIsQuickClientOpen(true)}
                    className="mb-[1px] p-2.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-lg hover:bg-brand-200 dark:hover:bg-brand-800 transition-colors"
                    title="Novo Cliente Rápido"
                >
                    <ICONS.Plus size={20} />
                </button>
              </div>
              
              <Input
                label="Serviço / Procedimento"
                placeholder="Ex: Limpeza de Pele Profunda"
                value={service}
                onChange={e => setService(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Input
                    type="date"
                    label="Data"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="time"
                    label="Horário"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                   <Input
                    type="number"
                    label="Duração (min)"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    required
                    min="5"
                    step="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Input
                  type="number"
                  label="Valor Total (R$)"
                  placeholder="0.00"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  step="0.01"
                />
                <Input
                  type="number"
                  label="Sinal / Entrada (R$)"
                  placeholder="0.00"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  step="0.01"
                />
              </div>

              <Select
                label="Status do Pagamento"
                value={status}
                onChange={e => setStatus(e.target.value as PaymentStatus)}
                options={[
                  { value: PaymentStatus.PENDING, label: 'Pendente' },
                  { value: PaymentStatus.PARTIAL, label: 'Parcial (Sinal)' },
                  { value: PaymentStatus.PAID, label: 'Pago Totalmente' },
                ]}
              />

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-700">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Anotações do Procedimento
                  </label>
                  <button
                    type="button"
                    onClick={handleAiEnhance}
                    disabled={aiLoading || !service || !notes}
                    className="text-xs flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium disabled:opacity-50"
                  >
                    <ICONS.AI size={12} className="mr-1" />
                    {aiLoading ? 'Gerando...' : 'Melhorar com IA'}
                  </button>
                </div>
                <TextArea
                  label=""
                  placeholder="Anote aqui o que foi feito (ex: esfoliação, extração difícil, máscara de argila)..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                />
                
                {aiResult && (
                  <div className="mt-3 p-3 bg-brand-50 dark:bg-brand-900/30 rounded-lg border border-brand-100 dark:border-brand-800">
                    <div className="flex items-center gap-2 mb-2">
                       <ICONS.AI className="text-brand-600 dark:text-brand-400 w-4 h-4" />
                       <h4 className="text-xs font-bold text-brand-800 dark:text-brand-300 uppercase">Registro Inteligente</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{aiResult}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-zinc-700 flex gap-3 bg-gray-50 dark:bg-zinc-800/50 rounded-b-2xl">
              <Button variant="ghost" className="w-full dark:text-gray-400 dark:hover:bg-zinc-700" onClick={onClose} type="button">Cancelar</Button>
              <Button type="submit" className="w-full">Salvar Agendamento</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Client Modal - Stacked on top */}
      <ClientModal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        onSave={handleQuickClientSave}
        zIndex={60} 
      />
    </>
  );
};