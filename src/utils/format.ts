import { StatusCarga } from '../types';

export const statusColor: Record<StatusCarga, string> = {
  'planejado': '#9ca3af',
  'em análise': '#6366f1',
  'em oferta': '#0ea5e9',
  'agendado': '#22c55e',
  'em carregamento': '#14b8a6',
  'em trânsito': '#f59e0b',
  'entregue': '#16a34a',
  'encerrada': '#374151',
  'no show': '#ef4444',
  'em cotação spot': '#eab308',
  'devolvida': '#f97316'
};
