export const timeToMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const isAfter = (current: string, cutoff: string) => timeToMinutes(current) >= timeToMinutes(cutoff);

export const isUrgente = (dataEntrega: string) => {
  const hoje = new Date();
  const entrega = new Date(dataEntrega);
  const diffMs = entrega.getTime() - hoje.setHours(0, 0, 0, 0);
  return diffMs / (1000 * 60 * 60 * 24) < 2;
};
