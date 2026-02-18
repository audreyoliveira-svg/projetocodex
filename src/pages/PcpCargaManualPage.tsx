import { useState } from 'react';
import { useCargoStore } from '../store/cargoStore';
import { isUrgente } from '../utils/time';

export const PcpCargaManualPage = () => {
  const { createCarga } = useCargoStore();
  const [form, setForm] = useState({ codigo: '', origem: '', destino: '', rota: 'SP-RJ', dataEntrega: '', peso: 0, paletes: 0 });
  const urgente = form.dataEntrega ? isUrgente(form.dataEntrega) : false;
  return <div>
    <h2>T-06 Carga Manual</h2>
    {urgente && <div style={{ background: '#fef3c7', padding: 8 }}>URGENTE D&lt;2</div>}
    <input placeholder="Código" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
    <input placeholder="Origem" value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value })} />
    <input placeholder="Destino" value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} />
    <input placeholder="Rota" value={form.rota} onChange={e => setForm({ ...form, rota: e.target.value })} />
    <input type="date" value={form.dataEntrega} onChange={e => setForm({ ...form, dataEntrega: e.target.value })} />
    <input type="number" placeholder="Peso" value={form.peso} onChange={e => setForm({ ...form, peso: Number(e.target.value) })} />
    <input type="number" placeholder="Paletes" value={form.paletes} onChange={e => setForm({ ...form, paletes: Number(e.target.value) })} />
    <button onClick={() => createCarga({ ...form, urgente })}>Salvar carga</button>
  </div>;
};
