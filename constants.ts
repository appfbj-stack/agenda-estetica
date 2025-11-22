import { Cloud, Calendar, Users, Home, Plus, Trash2, Edit, CheckCircle, XCircle, Sparkles, Phone, Search, ChevronLeft, ChevronRight, DollarSign, Clock, Sun, Moon, MessageCircle } from 'lucide-react';

export const APP_NAME = "EstéticaAgenda Pro";

// Navigation Items
export const NAV_ITEMS = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Agenda', path: '/agenda', icon: Calendar },
  { label: 'Clientes', path: '/clientes', icon: Users },
];

// Mock Data Keys for LocalStorage
export const STORAGE_KEYS = {
  CLIENTS: 'estetica_clients_v1',
  APPOINTMENTS: 'estetica_appointments_v1',
  THEME: 'estetica_theme_mode',
};

export const ICONS = {
  Home,
  Calendar,
  Users,
  Plus,
  Trash: Trash2,
  Edit,
  Check: CheckCircle,
  Close: XCircle,
  AI: Sparkles,
  Phone,
  Search,
  Prev: ChevronLeft,
  Next: ChevronRight,
  Money: DollarSign,
  Clock,
  Cloud,
  Sun,
  Moon,
  Whatsapp: MessageCircle
};