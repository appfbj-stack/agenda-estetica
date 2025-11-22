import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { Client } from '../types';
import { Button } from './Button';
import { Input, TextArea } from './Input';
import { generateId } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  initialData?: Client | null;
  zIndex?: number;
}

export const ClientModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData, zIndex = 50 }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setPhone(initialData.phone);
        setEmail(initialData.email || '');
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setPhone('');
        setEmail('');
        setNotes('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação Manual Extra
    if (!name.trim()) {
      alert("Por favor, preencha o nome do cliente.");
      return;
    }
    if (!phone.trim()) {
      alert("Por favor, preencha o telefone do cliente.");
      return;
    }

    onSave({
      id: initialData?.id || generateId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      createdAt: initialData?.createdAt || Date.now(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      style={{ zIndex: zIndex }}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200 dark:border-zinc-700">
        <div className="p-5 border-b border-gray-100 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <ICONS.Close size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label="Nome Completo *"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Ex: Ana Maria Silva"
          />
          <Input
            label="Telefone / WhatsApp *"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="(11) 99999-9999"
            type="tel"
          />
          <Input
            label="E-mail (Opcional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="cliente@email.com"
            type="email"
          />
          <TextArea
            label="Observações Gerais"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Alergias, preferências, etc."
            rows={3}
          />
          
          <div className="pt-4 flex gap-3">
             <Button variant="ghost" className="w-full dark:text-gray-300 dark:hover:bg-zinc-700" onClick={onClose} type="button">Cancelar</Button>
             <Button type="submit" className="w-full">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};