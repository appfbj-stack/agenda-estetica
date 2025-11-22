import { Client, Appointment } from '../types';
import { STORAGE_KEYS } from '../constants';

// Helpers
const get = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erro ao ler do armazenamento:", e);
    return [];
  }
};

const set = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar no armazenamento:", e);
    alert("Erro ao salvar dados. Verifique se o armazenamento do navegador está habilitado.");
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Clients
export const getClients = (): Client[] => get<Client>(STORAGE_KEYS.CLIENTS);

export const saveClient = (client: Client) => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === client.id);
  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  set(STORAGE_KEYS.CLIENTS, clients);
};

export const deleteClient = (id: string) => {
  const clients = getClients().filter(c => c.id !== id);
  set(STORAGE_KEYS.CLIENTS, clients);
};

// Appointments
export const getAppointments = (): Appointment[] => get<Appointment>(STORAGE_KEYS.APPOINTMENTS);

export const saveAppointment = (apt: Appointment) => {
  const list = getAppointments();
  const index = list.findIndex(a => a.id === apt.id);
  if (index >= 0) {
    list[index] = apt;
  } else {
    list.push(apt);
  }
  set(STORAGE_KEYS.APPOINTMENTS, list);
};

export const deleteAppointment = (id: string) => {
  const list = getAppointments().filter(a => a.id !== id);
  set(STORAGE_KEYS.APPOINTMENTS, list);
};

export const getAppointmentsByDate = (date: string): Appointment[] => {
  return getAppointments().filter(a => a.date === date).sort((a,b) => a.time.localeCompare(b.time));
};

export const getClientHistory = (clientId: string): Appointment[] => {
    return getAppointments()
        .filter(a => a.clientId === clientId)
        .sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time)); // Newest first
}